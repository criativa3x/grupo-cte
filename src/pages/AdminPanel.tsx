import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { LayoutDashboard, Image, GraduationCap, Briefcase, Save, Trash2, Plus, Loader2, LogOut, Settings, Bell, Search, Filter, ChevronRight, Menu, Pencil, XCircle, Palette, BarChart3, Star, Headset, UtensilsCrossed, Calculator } from 'lucide-react';
import { getAreaIcon } from '../lib/icons';
import { motion, AnimatePresence } from 'motion/react';

type Tab = 'dashboard' | 'cursos' | 'vagas' | 'aparencia' | 'alunos';

export default function AdminPanel() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [loading, setLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [data, setData] = useState<{
    banners: any[];
    cursos: any[];
    vagas: any[];
    alunos: any[];
  }>({
    banners: [],
    cursos: [],
    vagas: [],
    alunos: [],
  });

  // Form States
  const [bannerForm, setBannerForm] = useState({ titulo: '', subtitulo: '', imagem_url: '', texto_botao: '', link_botao: '' });
  const [cursoForm, setCursoForm] = useState({ nome: '', descricao: '', categoria: '', carga_horaria: '', thumbnail_url: '', banner_url: '' });
  const [vagaForm, setVagaForm] = useState({ titulo: '', resumo: '', 'àrea': '', local: '', valor_bolsa: '', requisitos: '', link_candidatura: '' });
  const [alunoForm, setAlunoForm] = useState({ nome: '', idade: '', empresa: '', imagem_url: '' });

  useEffect(() => {
    fetchAllData();
  }, []);

  useEffect(() => {
    if (activeTab !== 'dashboard') {
      fetchTabData();
    }
  }, [activeTab]);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [bannersRes, cursosRes, vagasRes, alunosRes] = await Promise.all([
        supabase.from('banners_home').select('*').order('created_at', { ascending: false }),
        supabase.from('cursos').select('*').order('created_at', { ascending: false }),
        supabase.from('vagas_estagio').select('*').order('created_at', { ascending: false }),
        supabase.from('alunos_contratados').select('*').order('created_at', { ascending: false }),
      ]);

      setData({
        banners: bannersRes.data || [],
        cursos: cursosRes.data || [],
        vagas: vagasRes.data || [],
        alunos: alunosRes.data || [],
      });
    } catch (error) {
      console.error('Error fetching all data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTabData = async () => {
    setLoading(true);
    try {
      const tableMap: Partial<Record<Tab, string>> = {
        aparencia: 'banners_home',
        cursos: 'cursos',
        vagas: 'vagas_estagio',
        alunos: 'alunos_contratados',
      };
      
      const tableName = tableMap[activeTab];
      if (!tableName) return;

      const { data: result, error } = await supabase
        .from(tableName)
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const dataKey = activeTab === 'aparencia' ? 'banners' : activeTab === 'alunos' ? 'alunos' : activeTab;
      setData((prev) => ({ ...prev, [dataKey]: result || [] }));
    } catch (error) {
      console.error('Error fetching tab data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const tableMap: Partial<Record<Tab, string>> = {
        aparencia: 'banners_home',
        cursos: 'cursos',
        vagas: 'vagas_estagio',
        alunos: 'alunos_contratados',
      };

      const formMap: Partial<Record<Tab, any>> = {
        aparencia: bannerForm,
        cursos: cursoForm,
        vagas: vagaForm,
        alunos: alunoForm,
      };

      const tableName = tableMap[activeTab];
      if (!tableName) return;

      if (editingId) {
        const { error } = await supabase
          .from(tableName)
          .update(formMap[activeTab])
          .eq('id', editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from(tableName)
          .insert([formMap[activeTab]]);
        if (error) throw error;
      }

      // Reset form
      resetForm();
      fetchTabData();
    } catch (error: any) {
      console.error('Error saving data:', error);
      alert(`Erro ao salvar: ${error.message || 'Verifique as permissões de RLS no Supabase.'}`);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setBannerForm({ titulo: '', subtitulo: '', imagem_url: '', texto_botao: '', link_botao: '' });
    setCursoForm({ nome: '', descricao: '', categoria: '', carga_horaria: '', thumbnail_url: '', banner_url: '' });
    setVagaForm({ titulo: '', resumo: '', 'àrea': '', local: '', valor_bolsa: '', requisitos: '', link_candidatura: '' });
    setAlunoForm({ nome: '', idade: '', empresa: '', imagem_url: '' });
  };

  const handleEdit = (item: any) => {
    setEditingId(item.id);
    if (activeTab === 'aparencia') {
      setBannerForm({
        titulo: item.titulo || '',
        subtitulo: item.subtitulo || '',
        imagem_url: item.imagem_url || '',
        texto_botao: item.texto_botao || '',
        link_botao: item.link_botao || ''
      });
    } else if (activeTab === 'cursos') {
      setCursoForm({
        nome: item.nome || '',
        descricao: item.descricao || '',
        categoria: item.categoria || '',
        carga_horaria: item.carga_horaria || '',
        thumbnail_url: item.thumbnail_url || '',
        banner_url: item.banner_url || ''
      });
    } else if (activeTab === 'vagas') {
      setVagaForm({
        titulo: item.titulo || '',
        resumo: item.resumo || '',
        'àrea': item['àrea'] || item.area || '',
        local: item.local || '',
        valor_bolsa: item.valor_bolsa || '',
        requisitos: item.requisitos || item.descricao || '',
        link_candidatura: item.link_candidatura || ''
      });
    } else if (activeTab === 'alunos') {
      setAlunoForm({
        nome: item.nome || '',
        idade: item.idade || item.curso || '',
        empresa: item.empresa || '',
        imagem_url: item.imagem_url || item.foto || item.foto_url || ''
      });
    }
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
      alert('Erro ao sair. Tente novamente.');
    }
  };
  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este item?')) return;
    setLoading(true);
    try {
      const tableMap: Partial<Record<Tab, string>> = {
        aparencia: 'banners_home',
        cursos: 'cursos',
        vagas: 'vagas_estagio',
        alunos: 'alunos_contratados',
      };

      const tableName = tableMap[activeTab];
      if (!tableName) return;

      const { error } = await supabase
        .from(tableName)
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchTabData();
    } catch (error) {
      console.error('Error deleting data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getActiveData = () => {
    if (activeTab === 'aparencia') return data.banners;
    if (activeTab === 'cursos') return data.cursos;
    if (activeTab === 'vagas') return data.vagas;
    if (activeTab === 'alunos') return data.alunos;
    return [];
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] font-sans selection:bg-orange-100 selection:text-orange-600">
      {/* Sidebar */}
      <motion.aside 
        initial={false}
        animate={{ width: isSidebarOpen ? 280 : 80 }}
        className="bg-[#0F172A] text-white flex flex-col shadow-2xl relative z-50 overflow-hidden"
      >
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          {isSidebarOpen && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center space-x-2"
            >
              <img 
                src="https://res.cloudinary.com/dapsovbs5/image/upload/v1774648783/logo_kb9nkn.png" 
                alt="Logo" 
                className="h-8 w-auto brightness-0 invert"
                referrerPolicy="no-referrer"
              />
              <h1 className="text-xl font-black text-white tracking-tighter">ADMIN</h1>
            </motion.div>
          )}
          {!isSidebarOpen && (
            <img 
              src="https://res.cloudinary.com/dapsovbs5/image/upload/v1774648783/logo_kb9nkn.png" 
              alt="Logo" 
              className="h-8 w-auto mx-auto brightness-0 invert"
              referrerPolicy="no-referrer"
            />
          )}
        </div>
        
        <nav className="flex-1 p-4 space-y-2 mt-4">
          <SidebarItem 
            icon={<BarChart3 size={20} />} 
            label="Dashboard" 
            active={activeTab === 'dashboard'} 
            onClick={() => setActiveTab('dashboard')} 
            isOpen={isSidebarOpen}
          />
          <SidebarItem 
            icon={<GraduationCap size={20} />} 
            label="Cursos" 
            active={activeTab === 'cursos'} 
            onClick={() => setActiveTab('cursos')} 
            isOpen={isSidebarOpen}
          />
          <SidebarItem 
            icon={<Briefcase size={20} />} 
            label="Vagas de Estágio" 
            active={activeTab === 'vagas'} 
            onClick={() => setActiveTab('vagas')} 
            isOpen={isSidebarOpen}
          />
          <SidebarItem 
            icon={<Star size={20} />} 
            label="Alunos Contratados" 
            active={activeTab === 'alunos'} 
            onClick={() => setActiveTab('alunos')} 
            isOpen={isSidebarOpen}
          />
          <SidebarItem 
            icon={<Palette size={20} />} 
            label="Aparência do Site" 
            active={activeTab === 'aparencia'} 
            onClick={() => setActiveTab('aparencia')} 
            isOpen={isSidebarOpen}
          />
        </nav>

        <div className="p-4 border-t border-white/5 space-y-2">
          <SidebarItem 
            icon={<LayoutDashboard size={20} />} 
            label="Voltar ao Site" 
            href="/"
            isOpen={isSidebarOpen}
          />
          <SidebarItem 
            icon={<LogOut size={20} />} 
            label="Sair" 
            onClick={handleLogout} 
            isOpen={isSidebarOpen}
            className="text-red-400 hover:bg-red-500/10 hover:text-red-300"
          />
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Header */}
        <header className="h-20 bg-white border-b border-gray-100 px-8 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500"
            >
              <Menu size={20} />
            </button>
            <div className="h-6 w-[1px] bg-gray-200 mx-2"></div>
            <div className="flex items-center text-sm font-medium text-gray-500">
              <span>Dashboard</span>
              <ChevronRight size={14} className="mx-2" />
              <span className="text-blue-950 font-bold capitalize">{activeTab}</span>
            </div>
          </div>

          <div className="flex items-center space-x-6">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input 
                type="text" 
                placeholder="Buscar..." 
                className="pl-10 pr-4 py-2 bg-gray-100 border-none rounded-full text-sm focus:ring-2 focus:ring-orange-500 outline-none w-64 transition-all"
              />
            </div>
            <button className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-orange-600 rounded-full border-2 border-white"></span>
            </button>
            <div className="flex items-center space-x-3 pl-4 border-l border-gray-100">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-blue-950">Admin Grupo CTE</p>
                <p className="text-xs text-gray-500">Administrador Master</p>
              </div>
              <img 
                src="https://picsum.photos/seed/admin/100/100" 
                className="w-10 h-10 rounded-full border-2 border-orange-500 object-cover" 
                alt="Admin"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === 'dashboard' ? (
                <div className="space-y-10">
                  <div className="flex flex-col">
                    <h2 className="text-3xl font-black text-blue-950">Bem-vindo ao Dashboard</h2>
                    <p className="text-gray-500 font-medium mt-1">Visão geral do seu sistema de gestão.</p>
                  </div>
                  
                  {/* Stats Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <StatCard 
                      title="Total de Banners" 
                      value={data.banners.length} 
                      icon={<Image className="text-blue-600" />} 
                      color="bg-blue-50"
                    />
                    <StatCard 
                      title="Cursos Ativos" 
                      value={data.cursos.length} 
                      icon={<GraduationCap className="text-orange-600" />} 
                      color="bg-orange-50"
                    />
                    <StatCard 
                      title="Vagas Abertas" 
                      value={data.vagas.length} 
                      icon={<Briefcase className="text-green-600" />} 
                      color="bg-green-50"
                    />
                    <StatCard 
                      title="Alunos Contratados" 
                      value={data.alunos.length} 
                      icon={<Star className="text-yellow-600" />} 
                      color="bg-yellow-50"
                    />
                  </div>

                  <div className="bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-sm">
                    <h3 className="text-xl font-black text-blue-950 mb-6">Atividades Recentes</h3>
                    <div className="space-y-4">
                      <p className="text-gray-400 font-medium italic">Nenhuma atividade recente para exibir.</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-8">
                  <div className="flex flex-col">
                    <h2 className="text-3xl font-black text-blue-950">
                      {activeTab === 'cursos' ? 'Gestão de Cursos' : 
                       activeTab === 'vagas' ? 'Vagas de Estágio' : 
                       activeTab === 'alunos' ? 'Alunos Contratados' :
                       'Aparência do Site'}
                    </h2>
                    <p className="text-gray-500 font-medium mt-1">
                      {activeTab === 'cursos' ? 'Adicione e edite os cursos oferecidos.' : 
                       activeTab === 'vagas' ? 'Gerencie as oportunidades de estágio.' : 
                       activeTab === 'alunos' ? 'Gerencie o mural de alunos contratados.' :
                       'Personalize os banners da página inicial.'}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Form Section */}
                    <div className="lg:col-span-1">
                      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 sticky top-8">
                        <div className="flex items-center justify-between mb-8">
                          <h3 className="text-xl font-black text-blue-950">{editingId ? 'Editar Item' : 'Novo Item'}</h3>
                          <div className={`p-2 ${editingId ? 'bg-blue-50 text-blue-600' : 'bg-orange-50 text-orange-600'} rounded-lg`}>
                            {editingId ? <Pencil size={20} /> : <Plus size={20} />}
                          </div>
                        </div>
                        
                        <form onSubmit={handleSave} className="space-y-6">
                          {editingId && (
                            <button 
                              type="button" 
                              onClick={resetForm}
                              className="w-full flex items-center justify-center space-x-2 py-2 text-xs font-bold text-gray-500 hover:text-red-500 transition-colors border border-dashed border-gray-200 rounded-xl"
                            >
                              <XCircle size={14} />
                              <span>Cancelar Edição</span>
                            </button>
                          )}
                          {activeTab === 'aparencia' && (
                            <>
                              <FormInput label="Título" value={bannerForm.titulo} onChange={(v) => setBannerForm({...bannerForm, titulo: v})} placeholder="Ex: O seu futuro começa aqui" />
                              <FormInput label="Subtítulo" value={bannerForm.subtitulo} onChange={(v) => setBannerForm({...bannerForm, subtitulo: v})} placeholder="Ex: Capacitação e Estágio" />
                              <FormInput label="URL da Imagem" value={bannerForm.imagem_url} onChange={(v) => setBannerForm({...bannerForm, imagem_url: v})} placeholder="https://..." />
                              <div className="grid grid-cols-2 gap-4">
                                <FormInput label="Texto Botão" value={bannerForm.texto_botao} onChange={(v) => setBannerForm({...bannerForm, texto_botao: v})} placeholder="Ver Cursos" />
                                <FormInput label="Link Botão" value={bannerForm.link_botao} onChange={(v) => setBannerForm({...bannerForm, link_botao: v})} placeholder="#cursos" />
                              </div>
                            </>
                          )}

                          {activeTab === 'cursos' && (
                            <>
                              <FormInput label="Nome do Curso" value={cursoForm.nome} onChange={(v) => setCursoForm({...cursoForm, nome: v})} />
                              <div className="space-y-2">
                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Categoria</label>
                                <select 
                                  value={cursoForm.categoria}
                                  onChange={(e) => setCursoForm({...cursoForm, categoria: e.target.value})}
                                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:bg-white focus:ring-2 focus:ring-orange-500 outline-none transition-all font-medium"
                                >
                                  <option value="">Selecione...</option>
                                  <option value="Tecnologia">Tecnologia</option>
                                  <option value="Saúde">Saúde</option>
                                  <option value="Administração">Administração</option>
                                  <option value="Beleza">Beleza</option>
                                </select>
                              </div>
                              <FormTextArea label="Descrição" value={cursoForm.descricao} onChange={(v) => setCursoForm({...cursoForm, descricao: v})} />
                              <div className="grid grid-cols-2 gap-4">
                                <FormInput label="Carga Horária" value={cursoForm.carga_horaria} onChange={(v) => setCursoForm({...cursoForm, carga_horaria: v})} placeholder="120h" />
                                <FormInput label="Thumbnail URL" value={cursoForm.thumbnail_url} onChange={(v) => setCursoForm({...cursoForm, thumbnail_url: v})} />
                              </div>
                            </>
                          )}

                          {activeTab === 'vagas' && (
                            <>
                              <div className="flex justify-center mb-6">
                                <div className="w-24 h-24 rounded-full bg-[#1a233e] flex items-center justify-center shadow-md border-4 border-white">
                                  {getAreaIcon(vagaForm['àrea'])}
                                </div>
                              </div>
                              <FormInput label="Título da Vaga" value={vagaForm.titulo} onChange={(v: string) => setVagaForm({...vagaForm, titulo: v})} />
                              <FormTextArea label="Resumo da Vaga" value={vagaForm.resumo} onChange={(v: string) => setVagaForm({...vagaForm, resumo: v})} placeholder="Breve resumo da oportunidade..." />
                              <div className="grid grid-cols-2 gap-4">
                                <FormInput label="Área" value={vagaForm['àrea']} onChange={(v: string) => setVagaForm({...vagaForm, 'àrea': v})} />
                                <FormInput label="Local" value={vagaForm.local} onChange={(v: string) => setVagaForm({...vagaForm, local: v})} />
                              </div>
                              <FormInput label="Valor da Bolsa" value={vagaForm.valor_bolsa} onChange={(v: string) => setVagaForm({...vagaForm, valor_bolsa: v})} placeholder="R$ 800,00" />
                              <FormTextArea label="Requisitos" value={vagaForm.requisitos} onChange={(v: string) => setVagaForm({...vagaForm, requisitos: v})} placeholder="Liste os requisitos da vaga..." />
                              <FormInput label="Link Candidatura" value={vagaForm.link_candidatura} onChange={(v: string) => setVagaForm({...vagaForm, link_candidatura: v})} />
                            </>
                          )}

                          {activeTab === 'alunos' && (
                            <>
                              <FormInput label="Nome do Aluno" value={alunoForm.nome} onChange={(v) => setAlunoForm({...alunoForm, nome: v})} />
                              <FormInput label="Idade" value={alunoForm.idade} onChange={(v) => setAlunoForm({...alunoForm, idade: v})} placeholder="Ex: 18 anos" />
                              <FormInput label="Empresa" value={alunoForm.empresa} onChange={(v) => setAlunoForm({...alunoForm, empresa: v})} />
                              <FormInput label="URL da Foto" value={alunoForm.imagem_url} onChange={(v) => setAlunoForm({...alunoForm, imagem_url: v})} placeholder="https://..." />
                            </>
                          )}

                          <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-orange-600 hover:bg-orange-700 text-white font-black py-4 rounded-2xl transition-all shadow-lg shadow-orange-600/20 flex items-center justify-center space-x-2 disabled:opacity-50 group"
                          >
                            {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} className="group-hover:scale-110 transition-transform" />}
                            <span>Salvar Alterações</span>
                          </button>
                        </form>
                      </div>
                    </div>

                    {/* List Section */}
                    <div className="lg:col-span-2">
                      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-8 border-b border-gray-100 flex justify-between items-center">
                          <div>
                            <h3 className="text-xl font-black text-blue-950">Itens Atuais</h3>
                            <p className="text-sm text-gray-500 font-medium">Gerencie o conteúdo exibido na Landing Page.</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button onClick={fetchTabData} className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500">
                              <Search size={18} />
                            </button>
                            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500">
                              <Filter size={18} />
                            </button>
                          </div>
                        </div>
                        
                        <div className="overflow-x-auto">
                          <table className="w-full text-left">
                            <thead>
                              <tr className="bg-gray-50/50 text-gray-400 text-[10px] uppercase tracking-[0.2em] font-black border-b border-gray-100">
                                <th className="px-8 py-5">Visualização</th>
                                <th className="px-8 py-5">Detalhes</th>
                                <th className="px-8 py-5 text-right">Ações</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                              {getActiveData().map((item, idx) => (
                                <motion.tr 
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: idx * 0.05 }}
                                  key={item.id} 
                                  className="group hover:bg-gray-50/80 transition-all"
                                >
                                  <td className="px-8 py-6">
                                    <div className="flex items-center space-x-4">
                                      <div className="w-16 h-12 rounded-xl bg-[#1a233e] overflow-hidden flex-shrink-0 border border-gray-100 flex items-center justify-center">
                                        {activeTab === 'vagas' ? (
                                          getAreaIcon(item['àrea'] || item.area, "h-6 w-6")
                                        ) : (
                                          <img 
                                            src={item.imagem_url || item.thumbnail_url || `https://picsum.photos/seed/${item.id}/200/200`} 
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                                            alt="Preview"
                                            referrerPolicy="no-referrer"
                                          />
                                        )}
                                      </div>
                                      <div>
                                        <div className="font-black text-blue-950 text-sm">{item.titulo || item.nome}</div>
                                        <div className="text-xs text-gray-400 font-bold mt-0.5">{activeTab === 'cursos' ? item.categoria : activeTab === 'vagas' ? (item['àrea'] || item.area) : activeTab === 'alunos' ? item.idade : 'Banner Home'}</div>
                                      </div>
                                    </div>
                                  </td>
                                  <td className="px-8 py-6">
                                    <div className="max-w-[240px]">
                                      <div className="text-xs text-gray-500 font-medium line-clamp-2 leading-relaxed">
                                        {item.resumo || item.subtitulo || item.descricao || item.requisitos || item.local || item.empresa}
                                      </div>
                                      {activeTab === 'vagas' && <div className="text-orange-600 font-black text-[10px] mt-1 uppercase tracking-wider">{item.valor_bolsa}</div>}
                                    </div>
                                  </td>
                                  <td className="px-8 py-6 text-right">
                                    <div className="flex items-center justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                      <button 
                                        onClick={() => handleEdit(item)}
                                        className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-all"
                                      >
                                        <Pencil size={18} />
                                      </button>
                                      <button
                                        onClick={() => handleDelete(item.id)}
                                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                      >
                                        <Trash2 size={18} />
                                      </button>
                                    </div>
                                  </td>
                                </motion.tr>
                              ))}
                              {getActiveData().length === 0 && !loading && (
                                <tr>
                                  <td colSpan={3} className="px-8 py-20 text-center">
                                    <div className="flex flex-col items-center justify-center text-gray-400">
                                      <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                                        <Search size={32} />
                                      </div>
                                      <p className="font-bold">Nenhum item encontrado</p>
                                      <p className="text-xs mt-1">Comece adicionando um novo item ao lado.</p>
                                    </div>
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

function SidebarItem({ icon, label, active, onClick, href, isOpen, className = "" }: any) {
  const content = (
    <div className={`flex items-center ${isOpen ? 'space-x-3 px-4' : 'justify-center'} py-3.5 rounded-xl transition-all font-bold text-sm ${active ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/20' : 'hover:bg-white/5 text-gray-400 hover:text-white'} ${className}`}>
      <div className={`${active ? 'scale-110' : ''} transition-transform`}>{icon}</div>
      {isOpen && <motion.span initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>{label}</motion.span>}
    </div>
  );

  if (href) return <a href={href} className="block">{content}</a>;
  return <button onClick={onClick} className="w-full text-left">{content}</button>;
}

function StatCard({ title, value, icon, color }: any) {
  return (
    <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex items-center space-x-5">
      <div className={`w-14 h-14 ${color} rounded-2xl flex items-center justify-center`}>
        {React.cloneElement(icon, { size: 24 })}
      </div>
      <div>
        <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">{title}</p>
        <p className="text-2xl font-black text-blue-950">{value}</p>
      </div>
    </div>
  );
}

function FormInput({ label, value, onChange, placeholder, type = "text" }: any) {
  return (
    <div className="space-y-2">
      <label className="text-xs font-black text-gray-400 uppercase tracking-widest">{label}</label>
      <input
        type={type}
        required
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:bg-white focus:ring-2 focus:ring-orange-500 outline-none transition-all font-medium placeholder:text-gray-300"
        placeholder={placeholder}
      />
    </div>
  );
}

function FormTextArea({ label, value, onChange, placeholder }: any) {
  return (
    <div className="space-y-2">
      <label className="text-xs font-black text-gray-400 uppercase tracking-widest">{label}</label>
      <textarea
        required
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:bg-white focus:ring-2 focus:ring-orange-500 outline-none transition-all font-medium h-24 resize-none placeholder:text-gray-300"
        placeholder={placeholder}
      />
    </div>
  );
}
