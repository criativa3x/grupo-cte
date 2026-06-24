import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { compressImage } from '../lib/imageUtils';
import { toast } from 'sonner';
import { Loader2, Zap, AlertTriangle, CheckCircle2, Info, Download, Trash2, ArrowRight, Eye } from 'lucide-react';

interface StorageFile {
  name: string;
  id: string;
  updated_at: string;
  created_at: string;
  last_accessed_at: string;
  metadata: {
    size: number;
    mimetype: string;
  };
  folder: string;
}

export default function StorageOptimizer() {
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState<StorageFile[]>([]);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [stats, setStats] = useState({ original: 0, optimized: 0 });
  const [logs, setLogs] = useState<string[]>([]);

  const folders = ['alunos', 'banners', 'categorias', 'parceiros', 'cursos'];

  const fetchFiles = async () => {
    setLoading(true);
    try {
      let allFiles: StorageFile[] = [];
      
      for (const folder of folders) {
        const { data, error } = await supabase.storage.from('categorias_imagens').list(folder);
        if (error) throw error;
        
        if (data) {
          const mapped = data
            .filter(f => f.metadata?.mimetype?.startsWith('image/'))
            .map(f => ({ ...f, folder, metadata: f.metadata as any } as StorageFile));
          allFiles = [...allFiles, ...mapped];
        }
      }
      
      setFiles(allFiles.sort((a, b) => b.metadata.size - a.metadata.size));
      const totalSize = allFiles.reduce((acc, f) => acc + f.metadata.size, 0);
      setStats(prev => ({ ...prev, original: totalSize }));
      
    } catch (error: any) {
      toast.error('Erro ao listar arquivos: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const processFile = async (file: StorageFile, apply = false) => {
    try {
      const publicUrl = supabase.storage.from('categorias_imagens').getPublicUrl(`${file.folder}/${file.name}`).data.publicUrl;
      
      const response = await fetch(publicUrl);
      const blob = await response.blob();
      
      // Criar um File a partir do Blob
      const imgFile = new File([blob], file.name, { type: blob.type });
      
      // Decidir o tipo de saída
      // Se for da pasta parceiros e for PNG, mantemos PNG para preservar transparência
      // Caso contrário, convertemos para JPEG para máxima compressão
      const outputType = (file.folder === 'parceiros' && file.metadata.mimetype === 'image/png') 
        ? 'image/png' 
        : 'image/jpeg';

      // Comprimir
      const compressedBlob = await compressImage(imgFile, 1200, 0.7, outputType);
      const optimizedSize = compressedBlob.size;

      // Se a otimização não reduziu o tamanho (ex: arquivo já estava otimizado), pulamos o upload
      if (optimizedSize >= file.metadata.size * 0.95 && apply) {
        return {
          original: file.metadata.size,
          optimized: file.metadata.size,
          skipped: true,
          success: true
        };
      }

      if (apply) {
        // Upload com upsert para sobrescrever
        const { error: uploadError } = await supabase.storage
          .from('categorias_imagens')
          .upload(`${file.folder}/${file.name}`, compressedBlob, {
            contentType: outputType,
            upsert: true
          });

        if (uploadError) throw uploadError;
      }

      return {
        original: file.metadata.size,
        optimized: optimizedSize,
        skipped: false,
        success: true
      };
    } catch (error: any) {
      console.error(`Erro ao processar ${file.name}:`, error);
      return { success: false, error: error.message };
    }
  };

  const handleProcessAll = async (apply = false) => {
    if (processing) return;
    
    const confirmMsg = apply 
      ? 'Isso irá sobrescrever os arquivos originais por versões otimizadas. Deseja continuar?' 
      : 'Isso irá baixar e comprimir em memória para estimar a economia. Deseja continuar?';
      
    if (!window.confirm(confirmMsg)) return;

    setProcessing(true);
    setProgress({ current: 0, total: files.length });
    let savedTotal = 0;
    let newTotal = 0;
    const newLogs: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      setProgress(prev => ({ ...prev, current: i + 1 }));
      
      const result = await processFile(file, apply);
      
      if (result.success && result.optimized) {
        newTotal += result.optimized;
        savedTotal += (result.original - result.optimized);
        const status = result.skipped ? 'MANTIDO' : (apply ? 'APLICADO' : 'SIMULADO');
        newLogs.unshift(`[${status}] ${file.name}: ${formatSize(result.original)} -> ${formatSize(result.optimized)} ${result.skipped ? '(Já otimizado)' : ''}`);
      } else {
        newLogs.unshift(`[ERRO] ${file.name}: ${result.error}`);
      }
      
      setLogs([...newLogs].slice(0, 50));
      setStats(prev => ({ ...prev, optimized: newTotal }));
    }

    setProcessing(false);
    toast.success(apply ? 'Otimização concluída com sucesso!' : 'Simulação concluída!');
    if (apply) fetchFiles();
  };

  const largeFiles = files.filter(f => f.metadata.size > 1024 * 1024);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
        <div className="flex items-start justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
              <Zap className="text-orange-600" />
              Otimizador de Storage
            </h2>
            <p className="text-gray-500">
              Analise e otimize imagens antigas para reduzir o consumo de banda (Egress) do Supabase.
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => handleProcessAll(false)}
              disabled={loading || processing || files.length === 0}
              className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all disabled:opacity-50 font-medium"
            >
              {processing && !progress.total ? <Loader2 className="animate-spin" size={20} /> : <Eye size={20} />}
              Simular Economia
            </button>
            <button
              onClick={() => handleProcessAll(true)}
              disabled={loading || processing || files.length === 0}
              className="flex items-center gap-2 px-6 py-3 bg-orange-600 text-white rounded-xl hover:bg-orange-700 transition-all shadow-lg shadow-orange-200 disabled:opacity-50 font-bold"
            >
              {processing ? <Loader2 className="animate-spin" size={20} /> : <Zap size={20} />}
              Otimizar Agora
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
            <div className="text-sm font-medium text-gray-500 mb-1">Arquivos Encontrados</div>
            <div className="text-3xl font-bold text-gray-900">{files.length}</div>
            <div className="mt-2 text-xs text-orange-600 font-medium flex items-center gap-1">
              <AlertTriangle size={12} />
              {largeFiles.length} arquivos acima de 1MB
            </div>
          </div>
          <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
            <div className="text-sm font-medium text-gray-500 mb-1">Tamanho Total Atual</div>
            <div className="text-3xl font-bold text-gray-900">{formatSize(stats.original)}</div>
          </div>
          <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-100">
            <div className="text-sm font-medium text-emerald-600 mb-1">Economia Estimada</div>
            <div className="text-3xl font-bold text-emerald-700">
              {stats.optimized > 0 ? formatSize(stats.original - stats.optimized) : '---'}
            </div>
            {stats.optimized > 0 && (
              <div className="mt-2 text-xs text-emerald-600 font-medium">
                Redução de {Math.round((1 - stats.optimized / stats.original) * 100)}%
              </div>
            )}
          </div>
        </div>

        {processing && (
          <div className="mb-8 p-6 bg-orange-50 rounded-2xl border border-orange-100">
            <div className="flex items-center justify-between mb-4">
              <div className="text-orange-700 font-bold flex items-center gap-2">
                <Loader2 className="animate-spin" size={18} />
                Processando arquivos...
              </div>
              <div className="text-orange-700 font-medium">
                {progress.current} / {progress.total}
              </div>
            </div>
            <div className="w-full h-3 bg-orange-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-orange-600 transition-all duration-300"
                style={{ width: `${(progress.current / progress.total) * 100}%` }}
              />
            </div>
          </div>
        )}

        <div className="border border-gray-100 rounded-2xl overflow-hidden">
          <div className="max-h-[400px] overflow-y-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 sticky top-0 z-10">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Arquivo</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Pasta</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Tamanho</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {files.map((file, idx) => (
                  <tr key={idx} className="group hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                          <img 
                            src={supabase.storage.from('categorias_imagens').getPublicUrl(`${file.folder}/${file.name}`).data.publicUrl} 
                            alt="" 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <span className="text-sm font-medium text-gray-900 truncate max-w-[200px]" title={file.name}>
                          {file.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-bold text-gray-400 uppercase bg-gray-100 px-2 py-1 rounded-md">
                        {file.folder}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-600">
                      <span className={file.metadata.size > 1024 * 1024 ? 'text-red-500 font-bold' : ''}>
                        {formatSize(file.metadata.size)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {file.metadata.size < 200 * 1024 ? (
                        <CheckCircle2 size={18} className="text-emerald-500 ml-auto" />
                      ) : (
                        <AlertTriangle size={18} className="text-orange-500 ml-auto" />
                      )}
                    </td>
                  </tr>
                ))}
                {files.length === 0 && !loading && (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                      Nenhum arquivo encontrado para otimização.
                    </td>
                  </tr>
                )}
                {loading && (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                      <Loader2 className="animate-spin mx-auto mb-2" />
                      Carregando arquivos...
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {logs.length > 0 && (
        <div className="bg-gray-900 rounded-2xl p-6 font-mono text-xs text-gray-300">
          <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-800">
            <div className="font-bold text-gray-400">LOGS DE PROCESSAMENTO</div>
            <button onClick={() => setLogs([])} className="text-gray-500 hover:text-white transition-colors">Limpar</button>
          </div>
          <div className="space-y-1 max-h-[200px] overflow-y-auto">
            {logs.map((log, i) => (
              <div key={i}>{log}</div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
