import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { LayoutDashboard, Image, GraduationCap, Briefcase, Save, Trash2, Plus, Loader2 } from 'lucide-react';

// SUPABASE CONFIGURATION
// Pre-filled with the provided credentials
const SUPABASE_URL = 'https://lrbfejskngapnzuwtiim.supabase.co';
const SUPABASE_KEY = 'sb_publishable_JBe4LeOgxxcDPbJV1QZ0HA_ANnF_TvS';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

type Tab = 'banners' | 'cursos' | 'vagas';

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState<Tab>('banners');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<{
    banners: any[];
    cursos: any[];
    vagas: any[];
  }>({
    banners: [],
    cursos: [],
    vagas: [],
  });

  // Form States
  const [bannerForm, setBannerForm] = useState({ titulo: '', subtitulo: '', imagem_url: '', texto_botao: '', link_botao: '' });
  const [cursoForm, setCursoForm] = useState({ nome: '', descricao: '', categoria: '', carga_horaria: '', thumbnail_url: '', banner_url: '' });
  const [vagaForm, setVagaForm] = useState({ titulo: '', area: '', local: '', valor_bolsa: '', descricao: '', link_candidatura: '' });

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const tableMap: Record<Tab, string> = {
        banners: 'banners_home',
        cursos: 'cursos',
        vagas: 'vagas_estagio',
      };
      
      const { data: result, error } = await supabase
        .from(tableMap[activeTab])
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setData((prev) => ({ ...prev, [activeTab]: result || [] }));
    } catch (error) {
      console.error('Error fetching data:', error);
      alert('Erro ao carregar dados. Verifique se as tabelas existem no Supabase.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const tableMap: Record<Tab, string> = {
        banners: 'banners_home',
        cursos: 'cursos',
        vagas: 'vagas_estagio',
      };

      const formMap: Record<Tab, any> = {
        banners: bannerForm,
        cursos: cursoForm,
        vagas: vagaForm,
      };

      const { error } = await supabase
        .from(tableMap[activeTab])
        .insert([formMap[activeTab]]);

      if (error) throw error;

      // Reset form
      if (activeTab === 'banners') setBannerForm({ titulo: '', subtitulo: '', imagem_url: '', texto_botao: '', link_botao: '' });
      if (activeTab === 'cursos') setCursoForm({ nome: '', descricao: '', categoria: '', carga_horaria: '', thumbnail_url: '', banner_url: '' });
      if (activeTab === 'vagas') setVagaForm({ titulo: '', area: '', local: '', valor_bolsa: '', descricao: '', link_candidatura: '' });

      alert('Item salvo com sucesso!');
      fetchData();
    } catch (error) {
      console.error('Error saving data:', error);
      alert('Erro ao salvar. Verifique as permissões de RLS no Supabase.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este item?')) return;
    setLoading(true);
    try {
      const tableMap: Record<Tab, string> = {
        banners: 'banners_home',
        cursos: 'cursos',
        vagas: 'vagas_estagio',
      };

      const { error } = await supabase
        .from(tableMap[activeTab])
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchData();
    } catch (error) {
      console.error('Error deleting data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-950 text-white flex flex-col shadow-xl">
        <div className="p-6 border-b border-blue-900">
          <h1 className="text-2xl font-black text-orange-500 tracking-tighter">CTE ADMIN</h1>
          <p className="text-xs text-blue-300 font-bold mt-1">PAINEL DE CONTROLE</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <button
            onClick={() => setActiveTab('banners')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all font-bold ${activeTab === 'banners' ? 'bg-orange-600 text-white shadow-lg' : 'hover:bg-blue-900 text-blue-200'}`}
          >
            <Image size={20} />
            <span>Banners Home</span>
          </button>
          <button
            onClick={() => setActiveTab('cursos')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all font-bold ${activeTab === 'cursos' ? 'bg-orange-600 text-white shadow-lg' : 'hover:bg-blue-900 text-blue-200'}`}
          >
            <GraduationCap size={20} />
            <span>Cursos</span>
          </button>
          <button
            onClick={() => setActiveTab('vagas')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all font-bold ${activeTab === 'vagas' ? 'bg-orange-600 text-white shadow-lg' : 'hover:bg-blue-900 text-blue-200'}`}
          >
            <Briefcase size={20} />
            <span>Vagas de Estágio</span>
          </button>
        </nav>

        <div className="p-6 border-t border-blue-900">
          <a href="/" className="text-sm text-blue-300 hover:text-white transition-colors flex items-center font-bold">
            <LayoutDashboard size={16} className="mr-2" />
            Voltar ao Site
          </a>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-3xl font-black text-blue-950 capitalize">
              Gerenciar {activeTab === 'vagas' ? 'Vagas de Estágio' : activeTab}
            </h2>
            <p className="text-gray-500 font-medium">Adicione ou remova conteúdo dinâmico do site.</p>
          </div>
          {loading && <Loader2 className="animate-spin text-orange-600" size={24} />}
        </header>

        {/* Form Section */}
        <section className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 mb-10">
          <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {activeTab === 'banners' && (
              <>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Título do Banner</label>
                  <input
                    type="text"
                    required
                    value={bannerForm.titulo}
                    onChange={(e) => setBannerForm({ ...bannerForm, titulo: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                    placeholder="Ex: O seu futuro começa aqui"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Subtítulo</label>
                  <input
                    type="text"
                    value={bannerForm.subtitulo}
                    onChange={(e) => setBannerForm({ ...bannerForm, subtitulo: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                    placeholder="Ex: Capacitação e Estágio"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">URL da Imagem</label>
                  <input
                    type="url"
                    required
                    value={bannerForm.imagem_url}
                    onChange={(e) => setBannerForm({ ...bannerForm, imagem_url: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                    placeholder="https://..."
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Texto do Botão</label>
                  <input
                    type="text"
                    value={bannerForm.texto_botao}
                    onChange={(e) => setBannerForm({ ...bannerForm, texto_botao: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                    placeholder="Ex: Ver Cursos"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Link do Botão</label>
                  <input
                    type="text"
                    value={bannerForm.link_botao}
                    onChange={(e) => setBannerForm({ ...bannerForm, link_botao: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                    placeholder="#cursos"
                  />
                </div>
              </>
            )}

            {activeTab === 'cursos' && (
              <>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Nome do Curso</label>
                  <input
                    type="text"
                    required
                    value={cursoForm.nome}
                    onChange={(e) => setCursoForm({ ...cursoForm, nome: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Categoria</label>
                  <select
                    value={cursoForm.categoria}
                    onChange={(e) => setCursoForm({ ...cursoForm, categoria: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                  >
                    <option value="">Selecione...</option>
                    <option value="Tecnologia">Tecnologia</option>
                    <option value="Saúde">Saúde</option>
                    <option value="Administração">Administração</option>
                    <option value="Beleza">Beleza</option>
                  </select>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-bold text-gray-700">Descrição</label>
                  <textarea
                    value={cursoForm.descricao}
                    onChange={(e) => setCursoForm({ ...cursoForm, descricao: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 outline-none transition-all h-24"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Carga Horária</label>
                  <input
                    type="text"
                    value={cursoForm.carga_horaria}
                    onChange={(e) => setCursoForm({ ...cursoForm, carga_horaria: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                    placeholder="Ex: 120h"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">URL Thumbnail</label>
                  <input
                    type="url"
                    value={cursoForm.thumbnail_url}
                    onChange={(e) => setCursoForm({ ...cursoForm, thumbnail_url: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">URL Banner</label>
                  <input
                    type="url"
                    value={cursoForm.banner_url}
                    onChange={(e) => setCursoForm({ ...cursoForm, banner_url: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                  />
                </div>
              </>
            )}

            {activeTab === 'vagas' && (
              <>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Título da Vaga</label>
                  <input
                    type="text"
                    required
                    value={vagaForm.titulo}
                    onChange={(e) => setVagaForm({ ...vagaForm, titulo: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Área</label>
                  <input
                    type="text"
                    value={vagaForm.area}
                    onChange={(e) => setVagaForm({ ...vagaForm, area: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Local</label>
                  <input
                    type="text"
                    value={vagaForm.local}
                    onChange={(e) => setVagaForm({ ...vagaForm, local: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Valor da Bolsa</label>
                  <input
                    type="text"
                    value={vagaForm.valor_bolsa}
                    onChange={(e) => setVagaForm({ ...vagaForm, valor_bolsa: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                    placeholder="Ex: R$ 800,00"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-bold text-gray-700">Descrição da Vaga</label>
                  <textarea
                    value={vagaForm.descricao}
                    onChange={(e) => setVagaForm({ ...vagaForm, descricao: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 outline-none transition-all h-24"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-bold text-gray-700">Link de Candidatura</label>
                  <input
                    type="text"
                    value={vagaForm.link_candidatura}
                    onChange={(e) => setVagaForm({ ...vagaForm, link_candidatura: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                  />
                </div>
              </>
            )}

            <div className="md:col-span-2 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white font-black py-4 rounded-2xl transition-all shadow-lg flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                <Save size={20} />
                <span>Salvar Item</span>
              </button>
            </div>
          </form>
        </section>

        {/* List Section */}
        <section className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
            <h3 className="font-black text-blue-950">Itens Cadastrados</h3>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{data[activeTab].length} Itens</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 text-gray-400 text-xs uppercase tracking-widest font-black border-b border-gray-100">
                  <th className="px-6 py-4">Título/Nome</th>
                  <th className="px-6 py-4">Informações</th>
                  <th className="px-6 py-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {data[activeTab].map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-blue-950">{item.titulo || item.nome}</div>
                      <div className="text-xs text-gray-400 truncate max-w-[200px]">{item.subtitulo || item.descricao}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600">
                        {activeTab === 'banners' && item.link_botao}
                        {activeTab === 'cursos' && `${item.categoria} | ${item.carga_horaria}`}
                        {activeTab === 'vagas' && `${item.area} | ${item.local}`}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
                {data[activeTab].length === 0 && !loading && (
                  <tr>
                    <td colSpan={3} className="px-6 py-10 text-center text-gray-400 font-medium">
                      Nenhum item cadastrado nesta categoria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}
