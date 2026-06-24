import React, { useState, useRef } from 'react';
import { X, Upload, CheckCircle2, Loader2, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { supabase } from '../lib/supabase';
import { toast } from 'sonner';

interface WorkWithUsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function WorkWithUsModal({ isOpen, onClose }: WorkWithUsModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
  });
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      const MAX_SIZE_MB = 2;
      const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

      if (selectedFile.size > MAX_SIZE_BYTES) {
        toast.error(`O arquivo é muito grande. O limite é de ${MAX_SIZE_MB}MB.`);
        e.target.value = '';
        return;
      }

      const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword'];
      
      if (validTypes.includes(selectedFile.type) || selectedFile.name.endsWith('.pdf') || selectedFile.name.endsWith('.docx') || selectedFile.name.endsWith('.doc')) {
        setFile(selectedFile);
      } else {
        toast.error('Formato inválido. Por favor, envie um arquivo .pdf ou .docx');
        e.target.value = '';
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      toast.error('Por favor, selecione seu currículo.');
      return;
    }

    setLoading(true);
    try {
      // Step B: Upload file to storage
      const fileExt = file.name.split('.').pop();
      // Sanitizar o nome do arquivo: remover acentos, parênteses e caracteres especiais
      const sanitizedName = file.name
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, "") // Remove acentos
        .replace(/[^a-zA-Z0-9.]/g, '_') // Substitui tudo que não for letra, número ou ponto por _
        .replace(/_{2,}/g, '_'); // Remove underscores duplicados
        
      const fileName = `public/${Date.now()}_${sanitizedName}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('curriculos')
        .upload(fileName, file);

      if (uploadError) {
        console.error('Erro detalhado do Storage:', uploadError);
        throw new Error(`Erro no upload: ${uploadError.message}. Verifique as políticas de RLS do bucket "curriculos" no Supabase.`);
      }

      // Step C: Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('curriculos')
        .getPublicUrl(fileName);

      // Step D: Insert into database
      const { error: insertError } = await supabase
        .from('candidatos')
        .insert([
          {
            nome: formData.nome,
            email: formData.email,
            telefone: formData.telefone,
            url_curriculo: publicUrl,
            status: 'Novo'
          }
        ]);

      if (insertError) {
        console.error('Erro detalhado da Tabela:', insertError);
        throw new Error(`Erro ao salvar dados: ${insertError.message}. Verifique as políticas de RLS da tabela "candidatos" no Supabase.`);
      }

      // Final Step: Success feedback
      toast.success('Currículo enviado com sucesso!');
      setFormData({ nome: '', email: '', telefone: '' });
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      onClose();
    } catch (error: any) {
      console.error('Work with us error:', error);
      toast.error(error.message || 'Ocorreu um erro ao enviar seu currículo. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-blue-950/60 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden"
          >
            <div className="p-8 md:p-12">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-3xl font-black text-blue-950 mb-2">Trabalhe Conosco</h2>
                  <p className="text-gray-500 font-medium">Envie seu currículo para nosso banco de talentos</p>
                </div>
                <button 
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-blue-950"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2 block">Nome Completo</label>
                  <input 
                    required
                    type="text"
                    value={formData.nome}
                    onChange={(e) => setFormData({...formData, nome: e.target.value})}
                    placeholder="Seu nome"
                    className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:bg-white focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 outline-none transition-all font-medium text-blue-950"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2 block">E-mail</label>
                    <input 
                      required
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      placeholder="seu@email.com"
                      className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:bg-white focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 outline-none transition-all font-medium text-blue-950"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2 block">Telefone</label>
                    <input 
                      required
                      type="tel"
                      value={formData.telefone}
                      onChange={(e) => setFormData({...formData, telefone: e.target.value})}
                      placeholder="(00) 00000-0000"
                      className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:bg-white focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 outline-none transition-all font-medium text-blue-950"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2 block">Currículo (PDF ou DOCX)</label>
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-3xl p-8 transition-all flex flex-col items-center justify-center cursor-pointer ${
                      file ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50 hover:border-orange-200 hover:bg-orange-50'
                    }`}
                  >
                    <input 
                      ref={fileInputRef}
                      type="file"
                      id="curriculo"
                      onChange={handleFileChange}
                      accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                      className="hidden"
                    />
                    {file ? (
                      <div className="flex items-center space-x-3 text-green-700">
                        <CheckCircle2 size={32} />
                        <div className="text-left">
                          <p className="font-bold text-sm truncate max-w-[200px]">{file.name}</p>
                          <p className="text-xs opacity-70">Arquivo selecionado</p>
                        </div>
                      </div>
                    ) : (
                      <>
                        <Upload className="text-gray-400 mb-2" size={32} />
                        <p className="text-sm font-bold text-gray-500">Clique para selecionar o arquivo</p>
                        <p className="text-xs text-gray-400 mt-1">PDF ou DOCX até 5MB</p>
                      </>
                    )}
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    disabled={loading}
                    type="submit"
                    className="w-full bg-orange-600 text-white font-black py-5 rounded-2xl shadow-xl shadow-orange-500/20 hover:bg-orange-700 hover:-translate-y-1 transition-all disabled:opacity-50 disabled:translate-y-0 flex items-center justify-center space-x-2"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="animate-spin" size={20} />
                        <span>Enviando...</span>
                      </>
                    ) : (
                      <span>Enviar Currículo</span>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
