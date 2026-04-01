import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { LayoutDashboard, Image, GraduationCap, Briefcase, Save, Trash2, Plus, Loader2, LogOut, Settings, Bell, Search, Filter, ChevronRight, Menu, Pencil, XCircle, Palette, BarChart3, Star, Headset, UtensilsCrossed, Calculator, Layers, PlusCircle, MinusCircle } from 'lucide-react';
import { getAreaIcon } from '../lib/icons';
import { motion, AnimatePresence } from 'motion/react';

const generateSlug = (text: string) => {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
    .trim();
};

type Tab = 'dashboard' | 'cursos' | 'categorias' | 'vagas' | 'aparencia' | 'alunos' | 'parceiros';

export default function AdminPanel() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [loading, setLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [data, setData] = useState<{
    banners: any[];
    cursos: any[];
    categorias: any[];
    vagas: any[];
    alunos: any[];
    parceiros: any[];
  }>({
    banners: [],
    cursos: [],
    categorias: [],
    vagas: [],
    alunos: [],
    parceiros: [],
  });

  // Form States
  const [bannerForm, setBannerForm] = useState({ titulo: '', subtitulo: '', imagem_url: '', texto_botao: '', link_botao: '' });
  const [cursoForm, setCursoForm] = useState({ 
    titulo: '', 
    slug: '', 
    categoria_id: '', 
    descricao_curta: '', 
    descricao_completa: '', 
    mercado_trabalho: '',
    carga_horaria: '', 
    imagem_url: '', 
    topicos: [] as string[], 
    instrumentos_aprendizagem: [] as string[],
    ativo: true 
  });
  const [cursoFile, setCursoFile] = useState<File | null>(null);
  const [categoriaForm, setCategoriaForm] = useState({ titulo: '', ordem: 0, imagem_url: '' });
  const [categoriaFile, setCategoriaFile] = useState<File | null>(null);
  const [vagaForm, setVagaForm] = useState({ titulo: '', resumo: '', area: '', local: '', valor_bolsa: '', requisitos: '', link_candidatura: '' });
  const [alunoForm, setAlunoForm] = useState({ nome: '', idade: '', empresa: '', imagem_url: '' });
  const [alunoFile, setAlunoFile] = useState<File | null>(null);
  const [parceiroForm, setParceiroForm] = useState({ nome: '', ordem: 0, logo_url: '' });
  const [parceiroFile, setParceiroFile] = useState<File | null>(null);

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
      const [bannersRes, cursosRes, categoriasRes, vagasRes, alunosRes, parceirosRes] = await Promise.all([
        supabase.from('banners_home').select('*').order('created_at', { ascending: false }),
        supabase.from('cursos').select('*').order('created_at', { ascending: false }),
        supabase.from('categorias').select('*').order('ordem', { ascending: true }),
        supabase.from('vagas_estagio').select('*').order('created_at', { ascending: false }),
        supabase.from('alunos_contratados').select('*').order('created_at', { ascending: false }),
        supabase.from('parceiros').select('*').order('ordem', { ascending: true }),
      ]);

      setData({
        banners: bannersRes.data || [],
        cursos: cursosRes.data || [],
        categorias: categoriasRes.data || [],
        vagas: vagasRes.data || [],
        alunos: alunosRes.data || [],
        parceiros: parceirosRes.data || [],
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
        categorias: 'categorias',
        vagas: 'vagas_estagio',
        alunos: 'alunos_contratados',
        parceiros: 'parceiros',
      };
      
      const tableName = tableMap[activeTab];
      if (!tableName) return;

      let query = supabase.from(tableName).select('*');
      
      if (activeTab === 'categorias' || activeTab === 'parceiros') {
        query = query.order('ordem', { ascending: true });
      } else {
        query = query.order('created_at', { ascending: false });
      }

      const { data: result, error } = await query;

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
        categorias: 'categorias',
        vagas: 'vagas_estagio',
        alunos: 'alunos_contratados',
        parceiros: 'parceiros',
      };

      const formMap: Partial<Record<Tab, any>> = {
        aparencia: bannerForm,
        cursos: cursoForm,
        categorias: categoriaForm,
        vagas: vagaForm,
        alunos: alunoForm,
        parceiros: parceiroForm,
      };

      const tableName = tableMap[activeTab];
      if (!tableName) return;

      let finalFormData = { ...formMap[activeTab] };

      // Handle Category Image Upload
      if (activeTab === 'categorias' && categoriaFile) {
        const fileExt = categoriaFile.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `categorias/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('categorias_imagens')
          .upload(filePath, categoriaFile);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('categorias_imagens')
          .getPublicUrl(filePath);

        finalFormData.imagem_url = publicUrl;
      }

      // Handle Partner Logo Upload
      if (activeTab === 'parceiros' && parceiroFile) {
        const fileExt = parceiroFile.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `parceiros/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('categorias_imagens')
          .upload(filePath, parceiroFile);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('categorias_imagens')
          .getPublicUrl(filePath);

        finalFormData.logo_url = publicUrl;
      }

      // Handle Curso Image Upload
      if (activeTab === 'cursos' && cursoFile) {
        const fileExt = cursoFile.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `cursos/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('categorias_imagens')
          .upload(filePath, cursoFile);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('categorias_imagens')
          .getPublicUrl(filePath);

        finalFormData.imagem_url = publicUrl;
      }

      // Handle Aluno Photo Upload
      if (activeTab === 'alunos' && alunoFile) {
        const fileExt = alunoFile.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `alunos/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('categorias_imagens')
          .upload(filePath, alunoFile);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('categorias_imagens')
          .getPublicUrl(filePath);

        finalFormData.imagem_url = publicUrl;
      }

      if (editingId) {
        const { error } = await supabase
          .from(tableName)
          .update(finalFormData)
          .eq('id', editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from(tableName)
          .insert([finalFormData]);
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
    setCursoForm({ 
      titulo: '', 
      slug: '', 
      categoria_id: '', 
      descricao_curta: '', 
      descricao_completa: '', 
      mercado_trabalho: '',
      carga_horaria: '', 
      imagem_url: '', 
      topicos: [], 
      instrumentos_aprendizagem: [],
      ativo: true 
    });
    setCursoFile(null);
    setCategoriaForm({ titulo: '', ordem: 0, imagem_url: '' });
    setCategoriaFile(null);
    setVagaForm({ titulo: '', resumo: '', area: '', local: '', valor_bolsa: '', requisitos: '', link_candidatura: '' });
    setAlunoForm({ nome: '', idade: '', empresa: '', imagem_url: '' });
    setAlunoFile(null);
    setParceiroForm({ nome: '', ordem: 0, logo_url: '' });
    setParceiroFile(null);
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
        titulo: item.titulo || '',
        slug: item.slug || '',
        categoria_id: item.categoria_id || '',
        descricao_curta: item.descricao_curta || '',
        descricao_completa: item.descricao_completa || '',
        mercado_trabalho: item.mercado_trabalho || '',
        carga_horaria: item.carga_horaria || '',
        imagem_url: item.imagem_url || '',
        topicos: item.topicos || [],
        instrumentos_aprendizagem: item.instrumentos_aprendizagem || [],
        ativo: item.ativo !== undefined ? item.ativo : true
      });
    } else if (activeTab === 'categorias') {
      setCategoriaForm({
        titulo: item.titulo || '',
        ordem: item.ordem || 0,
        imagem_url: item.imagem_url || ''
      });
    } else if (activeTab === 'vagas') {
      setVagaForm({
        titulo: item.titulo || '',
        resumo: item.resumo || '',
        area: item.area || item['àrea'] || '',
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
    } else if (activeTab === 'parceiros') {
      setParceiroForm({
        nome: item.nome || '',
        ordem: item.ordem || 0,
        logo_url: item.logo_url || ''
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
        categorias: 'categorias',
        vagas: 'vagas_estagio',
        alunos: 'alunos_contratados',
        parceiros: 'parceiros',
      };

      const tableName = tableMap[activeTab];
      if (!tableName) return;

      // If deleting a category, partner or student, we might want to delete its image from storage too
      if (activeTab === 'categorias' || activeTab === 'parceiros' || activeTab === 'alunos' || activeTab === 'cursos') {
        const dataKey = activeTab === 'categorias' ? 'categorias' : activeTab === 'parceiros' ? 'parceiros' : activeTab === 'alunos' ? 'alunos' : 'cursos';
        const itemToDelete = data[dataKey].find(c => c.id === id);
        const imageUrl = activeTab === 'categorias' ? itemToDelete?.imagem_url : activeTab === 'parceiros' ? itemToDelete?.logo_url : itemToDelete?.imagem_url;
        const prefix = activeTab === 'categorias' ? 'categorias/' : activeTab === 'parceiros' ? 'parceiros/' : activeTab === 'alunos' ? 'alunos/' : 'cursos/';

        if (itemToDelete && imageUrl) {
          try {
            const urlParts = imageUrl.split('/');
            const fileName = urlParts[urlParts.length - 1];
            await supabase.storage
              .from('categorias_imagens')
              .remove([`${prefix}${fileName}`]);
          } catch (storageError) {
            console.error('Error deleting image from storage:', storageError);
          }
        }
      }

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
    if (activeTab === 'categorias') return data.categorias;
    if (activeTab === 'vagas') return data.vagas;
    if (activeTab === 'alunos') return data.alunos;
    if (activeTab === 'parceiros') return data.parceiros;
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
            icon={<Layers size={20} />} 
            label="Categorias" 
            active={activeTab === 'categorias'} 
            onClick={() => setActiveTab('categorias')} 
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
          <SidebarItem 
            icon={<Layers size={20} />} 
            label="Parceiros" 
            active={activeTab === 'parceiros'} 
            onClick={() => setActiveTab('parceiros')} 
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
                      title="Categorias" 
                      value={data.categorias.length} 
                      icon={<Layers className="text-purple-600" />} 
                      color="bg-purple-50"
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
              ) : activeTab === 'parceiros' ? (
                <div className="space-y-10">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                      <h2 className="text-3xl font-black text-blue-950">Empresas Parceiras</h2>
                      <p className="text-gray-500 font-medium">Gerencie as logos que aparecem no carrossel da Home.</p>
                    </div>
                    <button 
                      onClick={resetForm}
                      className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-4 rounded-2xl font-black shadow-lg shadow-orange-600/20 transition-all flex items-center justify-center space-x-3"
                    >
                      <Plus size={20} />
                      <span>Adicionar Parceiro</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    <div className="lg:col-span-1">
                      <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 sticky top-28">
                        <h3 className="text-xl font-black text-blue-950 mb-8">{editingId ? 'Editar Parceiro' : 'Novo Parceiro'}</h3>
                        <form onSubmit={handleSave} className="space-y-6">
                          <FormInput 
                            label="Nome da Empresa" 
                            value={parceiroForm.nome} 
                            onChange={(val: string) => setParceiroForm({...parceiroForm, nome: val})} 
                            placeholder="Ex: Google"
                          />
                          <FormInput 
                            label="Ordem de Exibição" 
                            type="number"
                            value={parceiroForm.ordem} 
                            onChange={(val: string) => setParceiroForm({...parceiroForm, ordem: parseInt(val) || 0})} 
                            placeholder="Ex: 1"
                          />
                          <div className="space-y-2">
                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Logo da Empresa</label>
                            <input 
                              type="file" 
                              accept="image/*"
                              onChange={(e) => setParceiroFile(e.target.files?.[0] || null)}
                              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
                            />
                            {parceiroForm.logo_url && !parceiroFile && (
                              <div className="mt-2 p-2 bg-gray-50 rounded-lg border border-gray-100">
                                <img src={parceiroForm.logo_url} alt="Preview" className="h-10 w-auto object-contain" />
                              </div>
                            )}
                          </div>
                          <button 
                            type="submit" 
                            disabled={loading}
                            className="w-full bg-blue-950 hover:bg-blue-900 text-white font-black py-4 rounded-2xl transition-all shadow-lg shadow-blue-950/10 flex items-center justify-center space-x-3"
                          >
                            {loading ? <Loader2 className="animate-spin" /> : <Save size={20} />}
                            <span>{editingId ? 'Atualizar Parceiro' : 'Salvar Parceiro'}</span>
                          </button>
                          {editingId && (
                            <button 
                              type="button"
                              onClick={resetForm}
                              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-600 font-black py-4 rounded-2xl transition-all"
                            >
                              Cancelar Edição
                            </button>
                          )}
                        </form>
                      </div>
                    </div>

                    <div className="lg:col-span-2">
                      <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
                        <div className="overflow-x-auto">
                          <table className="w-full text-left">
                            <thead>
                              <tr className="bg-gray-50/50 border-b border-gray-100">
                                <th className="px-8 py-6 text-xs font-black text-gray-400 uppercase tracking-widest">Logo</th>
                                <th className="px-8 py-6 text-xs font-black text-gray-400 uppercase tracking-widest">Empresa</th>
                                <th className="px-8 py-6 text-xs font-black text-gray-400 uppercase tracking-widest">Ordem</th>
                                <th className="px-8 py-6 text-xs font-black text-gray-400 uppercase tracking-widest text-right">Ações</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                              {data.parceiros.map((item) => (
                                <tr key={item.id} className="hover:bg-gray-50/50 transition-colors group">
                                  <td className="px-8 py-6">
                                    <div className="w-16 h-10 bg-gray-50 rounded-lg flex items-center justify-center p-2 border border-gray-100">
                                      <img src={item.logo_url} alt={item.nome} className="max-h-full max-w-full object-contain" />
                                    </div>
                                  </td>
                                  <td className="px-8 py-6">
                                    <span className="font-bold text-blue-950">{item.nome}</span>
                                  </td>
                                  <td className="px-8 py-6">
                                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-50 text-blue-600 font-black text-xs">
                                      {item.ordem}
                                    </span>
                                  </td>
                                  <td className="px-8 py-6 text-right">
                                    <div className="flex items-center justify-end space-x-2">
                                      <button 
                                        onClick={() => handleEdit(item)}
                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                      >
                                        <Pencil size={18} />
                                      </button>
                                      <button 
                                        onClick={() => handleDelete(item.id)}
                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                      >
                                        <Trash2 size={18} />
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                              {data.parceiros.length === 0 && (
                                <tr>
                                  <td colSpan={4} className="px-8 py-12 text-center text-gray-400 font-medium">
                                    Nenhum parceiro cadastrado.
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
              ) : (
                <div className="space-y-8">
                  <div className="flex flex-col">
                    <h2 className="text-3xl font-black text-blue-950">
                      {activeTab === 'cursos' ? 'Gestão de Cursos' : 
                       activeTab === 'categorias' ? 'Gerenciar Categorias' :
                       activeTab === 'vagas' ? 'Vagas de Estágio' : 
                       activeTab === 'alunos' ? 'Alunos Contratados' :
                       'Aparência do Site'}
                    </h2>
                    <p className="text-gray-500 font-medium mt-1">
                      {activeTab === 'cursos' ? 'Adicione e edite os cursos oferecidos.' : 
                       activeTab === 'categorias' ? 'Gerencie as áreas de atuação e categorias.' :
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
                              <FormInput 
                                label="Título do Curso" 
                                value={cursoForm.titulo} 
                                onChange={(v) => {
                                  setCursoForm({
                                    ...cursoForm, 
                                    titulo: v,
                                    slug: generateSlug(v)
                                  });
                                }} 
                              />
                              <FormInput 
                                label="Slug" 
                                value={cursoForm.slug} 
                                onChange={(v) => setCursoForm({...cursoForm, slug: v})} 
                              />
                              <div className="space-y-2">
                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Categoria</label>
                                <select 
                                  value={cursoForm.categoria_id}
                                  onChange={(e) => setCursoForm({...cursoForm, categoria_id: e.target.value})}
                                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:bg-white focus:ring-2 focus:ring-orange-500 outline-none transition-all font-medium"
                                >
                                  <option value="">Selecione...</option>
                                  {data.categorias.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.titulo}</option>
                                  ))}
                                </select>
                              </div>
                              <FormTextArea label="Descrição Curta" value={cursoForm.descricao_curta} onChange={(v) => setCursoForm({...cursoForm, descricao_curta: v})} />
                              <FormTextArea label="Descrição Completa" value={cursoForm.descricao_completa} onChange={(v) => setCursoForm({...cursoForm, descricao_completa: v})} />
                              <FormTextArea label="Mercado de Trabalho" value={cursoForm.mercado_trabalho} onChange={(v) => setCursoForm({...cursoForm, mercado_trabalho: v})} placeholder="Fale sobre as oportunidades no mercado..." />
                              
                              <div className="grid grid-cols-2 gap-4">
                                <FormInput label="Carga Horária" value={cursoForm.carga_horaria} onChange={(v) => setCursoForm({...cursoForm, carga_horaria: v})} placeholder="Ex: 40 horas" />
                                <div className="space-y-2">
                                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Status</label>
                                  <div className="flex items-center space-x-3 mt-2">
                                    <button
                                      type="button"
                                      onClick={() => setCursoForm({...cursoForm, ativo: !cursoForm.ativo})}
                                      className={`w-12 h-6 rounded-full transition-colors relative ${cursoForm.ativo ? 'bg-green-500' : 'bg-gray-300'}`}
                                    >
                                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${cursoForm.ativo ? 'left-7' : 'left-1'}`} />
                                    </button>
                                    <span className="text-sm font-bold text-gray-600">{cursoForm.ativo ? 'Ativo' : 'Inativo'}</span>
                                  </div>
                                </div>
                              </div>

                              <div className="space-y-2">
                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Imagem de Capa</label>
                                <input 
                                  type="file" 
                                  accept="image/*"
                                  onChange={(e) => setCursoFile(e.target.files?.[0] || null)}
                                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:bg-white focus:ring-2 focus:ring-orange-500 outline-none transition-all font-medium"
                                />
                                {(cursoForm.imagem_url || cursoFile) && (
                                  <div className="mt-4 p-2 bg-gray-50 rounded-2xl border border-gray-100 inline-block">
                                    <img 
                                      src={cursoFile ? URL.createObjectURL(cursoFile) : cursoForm.imagem_url} 
                                      className="w-32 h-20 rounded-xl object-cover shadow-sm" 
                                      alt="Preview"
                                      referrerPolicy="no-referrer"
                                    />
                                  </div>
                                )}
                              </div>

                              <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Tópicos do Curso</label>
                                  <button 
                                    type="button"
                                    onClick={() => setCursoForm({...cursoForm, topicos: [...cursoForm.topicos, '']})}
                                    className="flex items-center space-x-1 text-orange-600 hover:text-orange-700 transition-colors"
                                  >
                                    <PlusCircle size={16} />
                                    <span className="text-xs font-bold">Adicionar Módulo</span>
                                  </button>
                                </div>
                                
                                <div className="space-y-2">
                                  {cursoForm.topicos.map((topico, index) => (
                                    <div key={index} className="flex items-center space-x-2">
                                      <input 
                                        type="text"
                                        value={topico}
                                        onChange={(e) => {
                                          const newTopicos = [...cursoForm.topicos];
                                          newTopicos[index] = e.target.value;
                                          setCursoForm({...cursoForm, topicos: newTopicos});
                                        }}
                                        placeholder={`Tópico ${index + 1}`}
                                        className="flex-1 px-4 py-2 rounded-xl bg-gray-50 border border-gray-100 focus:bg-white focus:ring-2 focus:ring-orange-500 outline-none transition-all font-medium text-sm"
                                      />
                                      <button 
                                        type="button"
                                        onClick={() => {
                                          const newTopicos = cursoForm.topicos.filter((_, i) => i !== index);
                                          setCursoForm({...cursoForm, topicos: newTopicos});
                                        }}
                                        className="text-red-400 hover:text-red-600 transition-colors"
                                      >
                                        <MinusCircle size={20} />
                                      </button>
                                    </div>
                                  ))}
                                  {cursoForm.topicos.length === 0 && (
                                    <p className="text-xs text-gray-400 italic text-center py-4 bg-gray-50 rounded-xl border border-dashed border-gray-200">Nenhum tópico adicionado.</p>
                                  )}
                                </div>
                              </div>

                              <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Instrumentos de Aprendizagem</label>
                                  <button 
                                    type="button"
                                    onClick={() => setCursoForm({...cursoForm, instrumentos_aprendizagem: [...cursoForm.instrumentos_aprendizagem, '']})}
                                    className="flex items-center space-x-1 text-orange-600 hover:text-orange-700 transition-colors"
                                  >
                                    <PlusCircle size={16} />
                                    <span className="text-xs font-bold">Adicionar Item</span>
                                  </button>
                                </div>
                                
                                <div className="space-y-2">
                                  {cursoForm.instrumentos_aprendizagem.map((item, index) => (
                                    <div key={index} className="flex items-center space-x-2">
                                      <input 
                                        type="text"
                                        value={item}
                                        onChange={(e) => {
                                          const newItems = [...cursoForm.instrumentos_aprendizagem];
                                          newItems[index] = e.target.value;
                                          setCursoForm({...cursoForm, instrumentos_aprendizagem: newItems});
                                        }}
                                        placeholder={`Item ${index + 1} (ex: 48 Aulas)`}
                                        className="flex-1 px-4 py-2 rounded-xl bg-gray-50 border border-gray-100 focus:bg-white focus:ring-2 focus:ring-orange-500 outline-none transition-all font-medium text-sm"
                                      />
                                      <button 
                                        type="button"
                                        onClick={() => {
                                          const newItems = cursoForm.instrumentos_aprendizagem.filter((_, i) => i !== index);
                                          setCursoForm({...cursoForm, instrumentos_aprendizagem: newItems});
                                        }}
                                        className="text-red-400 hover:text-red-600 transition-colors"
                                      >
                                        <MinusCircle size={20} />
                                      </button>
                                    </div>
                                  ))}
                                  {cursoForm.instrumentos_aprendizagem.length === 0 && (
                                    <p className="text-xs text-gray-400 italic text-center py-4 bg-gray-50 rounded-xl border border-dashed border-gray-200">Nenhum instrumento adicionado.</p>
                                  )}
                                </div>
                              </div>
                            </>
                          )}

                          {activeTab === 'categorias' && (
                            <>
                              <FormInput label="Título da Categoria" value={categoriaForm.titulo} onChange={(v) => setCategoriaForm({...categoriaForm, titulo: v})} />
                              <FormInput label="Ordem de Exibição" type="number" value={categoriaForm.ordem} onChange={(v) => setCategoriaForm({...categoriaForm, ordem: parseInt(v) || 0})} />
                              <div className="space-y-2">
                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Imagem</label>
                                <input 
                                  type="file" 
                                  accept="image/*"
                                  onChange={(e) => setCategoriaFile(e.target.files?.[0] || null)}
                                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:bg-white focus:ring-2 focus:ring-orange-500 outline-none transition-all font-medium"
                                />
                                {categoriaForm.imagem_url && !categoriaFile && (
                                  <p className="text-[10px] text-gray-400 mt-1">Imagem atual: {categoriaForm.imagem_url.split('/').pop()}</p>
                                )}
                              </div>
                            </>
                          )}

                          {activeTab === 'vagas' && (
                            <>
                              <div className="flex justify-center mb-6">
                                <div className="w-24 h-24 rounded-full bg-[#1a233e] flex items-center justify-center shadow-md border-4 border-white">
                                  {getAreaIcon(vagaForm.area)}
                                </div>
                              </div>
                              <FormInput label="Título da Vaga" value={vagaForm.titulo} onChange={(v: string) => setVagaForm({...vagaForm, titulo: v})} />
                              <FormTextArea label="Resumo da Vaga" value={vagaForm.resumo} onChange={(v: string) => setVagaForm({...vagaForm, resumo: v})} placeholder="Breve resumo da oportunidade..." />
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Área</label>
                                  <select 
                                    value={vagaForm.area}
                                    onChange={(e) => setVagaForm({...vagaForm, area: e.target.value})}
                                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:bg-white focus:ring-2 focus:ring-orange-500 outline-none transition-all font-medium"
                                  >
                                    <option value="">Selecione...</option>
                                    {data.categorias.map(cat => (
                                      <option key={cat.id} value={cat.titulo}>{cat.titulo}</option>
                                    ))}
                                  </select>
                                </div>
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
                              <div className="space-y-2">
                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Foto do Aluno</label>
                                <input 
                                  type="file" 
                                  accept="image/*"
                                  onChange={(e) => setAlunoFile(e.target.files?.[0] || null)}
                                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:bg-white focus:ring-2 focus:ring-orange-500 outline-none transition-all font-medium"
                                />
                                {(alunoForm.imagem_url || alunoFile) && (
                                  <div className="mt-4 p-2 bg-gray-50 rounded-2xl border border-gray-100 inline-block">
                                    <img 
                                      src={alunoFile ? URL.createObjectURL(alunoFile) : alunoForm.imagem_url} 
                                      className="w-24 h-24 rounded-xl object-cover shadow-sm" 
                                      alt="Preview"
                                      referrerPolicy="no-referrer"
                                    />
                                    <p className="text-[10px] text-gray-400 mt-2 text-center font-bold">PREVIEW</p>
                                  </div>
                                )}
                              </div>
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
                            <h3 className="text-xl font-black text-blue-950">
                              {activeTab === 'categorias' ? 'Categorias Cadastradas' : 'Itens Atuais'}
                            </h3>
                            <p className="text-sm text-gray-500 font-medium">Gerencie o conteúdo exibido na Landing Page.</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            {activeTab === 'categorias' && (
                              <button 
                                onClick={resetForm}
                                className="flex items-center space-x-2 px-4 py-2 bg-orange-600 text-white text-xs font-black rounded-xl hover:bg-orange-700 transition-all shadow-lg shadow-orange-600/20 mr-2"
                              >
                                <Plus size={14} />
                                <span>Nova Categoria</span>
                              </button>
                            )}
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
                                          getAreaIcon(item.area || item['àrea'], "h-6 w-6")
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
                                        <div className="text-xs text-gray-400 font-bold mt-0.5">
                                          {activeTab === 'cursos' 
                                            ? (data.categorias.find(c => c.id === item.categoria_id)?.titulo || 'Sem Categoria')
                                            : activeTab === 'categorias' 
                                              ? `Ordem: ${item.ordem}` 
                                              : activeTab === 'vagas' 
                                                ? (item.area || item['àrea']) 
                                                : activeTab === 'alunos' 
                                                  ? item.idade 
                                                  : 'Banner Home'}
                                        </div>
                                      </div>
                                    </div>
                                  </td>
                                  <td className="px-8 py-6">
                                    <div className="max-w-[240px]">
                                      <div className="text-xs text-gray-500 font-medium line-clamp-2 leading-relaxed">
                                        {item.descricao_curta || item.resumo || item.subtitulo || item.descricao || item.requisitos || item.local || item.empresa}
                                      </div>
                                      {(activeTab === 'vagas' || activeTab === 'cursos') && (
                                        <div className="flex items-center space-x-2 mt-1">
                                          <div className="text-orange-600 font-black text-[10px] uppercase tracking-wider">{item.valor_bolsa || item.carga_horaria}</div>
                                          {activeTab === 'cursos' && (
                                            <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider ${item.ativo ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                              {item.ativo ? 'Ativo' : 'Inativo'}
                                            </span>
                                          )}
                                        </div>
                                      )}
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
