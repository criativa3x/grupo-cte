import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '../lib/supabase';
import { LayoutDashboard, Image, GraduationCap, Briefcase, Save, Trash2, Plus, Loader2, LogOut, Settings, Bell, Search, Filter, ChevronRight, ChevronDown, Menu, Pencil, XCircle, Palette, BarChart3, Star, Headset, UtensilsCrossed, Calculator, Layers, PlusCircle, MinusCircle, Users, MessageCircle, ExternalLink, Eye, Target, FileText, Monitor, Database, Mail, Globe, Link2, Download } from 'lucide-react';
import { getAreaIcon } from '../lib/icons';
import { motion, AnimatePresence } from 'motion/react';
import UsefulLinksGrid from '../components/UsefulLinksGrid';
import { toPng } from 'html-to-image';

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

type Tab = 'dashboard' | 'cursos' | 'categorias' | 'vagas' | 'aparencia' | 'alunos' | 'parceiros' | 'banco_talentos' | 'solicitacoes_empresas' | 'candidaturas' | 'links_uteis' | 'candidatos';

export default function AdminPanel() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [loading, setLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    cursos: true,
    empregabilidade: true,
    site: true,
    externos: false
  });

  const toggleGroup = (group: string) => {
    setExpandedGroups(prev => ({ ...prev, [group]: !prev[group] }));
  };
  const [editingId, setEditingId] = useState<string | null>(null);
  const [vacancyFilter, setVacancyFilter] = useState<string>('Todas');
  const [courseCategoryFilter, setCourseCategoryFilter] = useState<string>('Todas');
  const [adminSearchTerm, setAdminSearchTerm] = useState('');
  const [data, setData] = useState<{
    banners: any[];
    cursos: any[];
    categorias: any[];
    vagas: any[];
    alunos: any[];
    parceiros: any[];
    curriculos: any[];
    solicitacoes: any[];
    candidaturas: any[];
    candidatos: any[];
  }>({
    banners: [],
    cursos: [],
    categorias: [],
    vagas: [],
    alunos: [],
    parceiros: [],
    curriculos: [],
    solicitacoes: [],
    candidaturas: [],
    candidatos: [],
  });

  const newLeadsCount = React.useMemo(() => {
    const studentLeads = [...data.curriculos, ...data.candidaturas, ...data.candidatos].filter(c => !c.status || c.status === 'Novo').length;
    const companyLeads = data.solicitacoes.filter(s => !s.status || s.status === 'Pendente').length;
    return studentLeads + companyLeads;
  }, [data.curriculos, data.candidaturas, data.solicitacoes, data.candidatos]);

  const notificationDetails = React.useMemo(() => {
    const details = [];
    const bancoTalentosCount = data.curriculos.filter(c => !c.status || c.status === 'Novo').length;
    const candidaturasCount = data.candidaturas.filter(c => !c.status || c.status === 'Novo').length;
    const solicitacoesCount = data.solicitacoes.filter(s => !s.status || s.status === 'Pendente').length;
    const candidatosSiteCount = data.candidatos.filter(c => !c.status || c.status === 'Novo').length;

    if (bancoTalentosCount > 0) {
      details.push({
        id: 'banco',
        text: `Você tem ${bancoTalentosCount} novo(s) currículo(s) no Banco de Talentos`,
        tab: 'banco_talentos' as Tab
      });
    }
    if (candidaturasCount > 0) {
      details.push({
        id: 'candidaturas',
        text: `Você tem ${candidaturasCount} nova(s) candidatura(s) para revisar`,
        tab: 'candidaturas' as Tab
      });
    }
    if (solicitacoesCount > 0) {
      details.push({
        id: 'solicitacoes',
        text: `Você tem ${solicitacoesCount} nova(s) solicitação(ões) de empresas`,
        tab: 'solicitacoes_empresas' as Tab
      });
    }
    if (candidatosSiteCount > 0) {
      details.push({
        id: 'candidatos',
        text: `Você tem ${candidatosSiteCount} novo(s) currículo(s) do "Trabalhe Conosco"`,
        tab: 'candidatos' as Tab
      });
    }
    return details;
  }, [data.curriculos, data.candidaturas, data.solicitacoes, data.candidatos]);

  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const storyRef = React.useRef<HTMLDivElement>(null);
  const [capturingVacancy, setCapturingVacancy] = useState<any>(null);

  const handleDownloadInstagram = async (vacancy: any) => {
    setCapturingVacancy(vacancy);
    toast.info('Gerando imagem para Instagram...', { description: 'Aguarde um momento.' });
    
    // Give react time to render the hidden component
    setTimeout(async () => {
      if (storyRef.current) {
        try {
          const dataUrl = await toPng(storyRef.current, {
            width: 1080,
            height: 1920,
            cacheBust: true,
          });
          const link = document.createElement('a');
          link.download = `vaga-instagram-${generateSlug(vacancy.titulo)}.png`;
          link.href = dataUrl;
          link.click();
          toast.success('Imagem baixada com sucesso!');
        } catch (err) {
          console.error('Erro ao gerar imagem:', err);
          toast.error('Erro ao gerar imagem.');
        } finally {
          setCapturingVacancy(null);
        }
      } else {
        toast.error('Erro interno: Template não encontrado.');
        setCapturingVacancy(null);
      }
    }, 800);
  };

  // Form States
  const [bannerForm, setBannerForm] = useState({ titulo: '', subtitulo: '', imagem_url: '' });
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [cursoForm, setCursoForm] = useState({ 
    titulo: '', 
    slug: '', 
    categoria_id: '', 
    descricao_curta: '', 
    descricao_completa: '', 
    mercado_trabalho: '',
    carga_horaria: '', 
    imagem_url: '', 
    video_url: '',
    topicos: '', 
    ordem: 0,
    ativo: true 
  });
  const [cursoFile, setCursoFile] = useState<File | null>(null);
  const [categoriaForm, setCategoriaForm] = useState({ titulo: '', ordem: 0, imagem_url: '' });
  const [categoriaFile, setCategoriaFile] = useState<File | null>(null);
  const [vagaForm, setVagaForm] = useState({ titulo: '', area: '', local: '', valor_bolsa: '', requisitos: '', parceiro_id: '', prazo_candidatura: '' });
  const [alunoForm, setAlunoForm] = useState({ nome: '', idade: '', empresa: '', imagem_url: '' });
  const [alunoFile, setAlunoFile] = useState<File | null>(null);
  const [parceiroForm, setParceiroForm] = useState({ nome: '', logo_url: '' });
  const [parceiroFile, setParceiroFile] = useState<File | null>(null);

  useEffect(() => {
    fetchAllData();
  }, []);

  useEffect(() => {
    const channel = supabase
      .channel('admin-notifications')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'curriculos_estagiarios' },
        (payload) => {
          const newRecord = payload.new;
          setData(prev => {
            const isCandidatura = newRecord.vaga_aplicada && newRecord.vaga_aplicada !== 'Geral';
            if (isCandidatura) {
              return { ...prev, candidaturas: [newRecord, ...prev.candidaturas] };
            } else {
              return { ...prev, curriculos: [newRecord, ...prev.curriculos] };
            }
          });
          toast.info('Nova candidatura recebida!', {
            description: `Candidato: ${newRecord.nome_completo}`,
            action: {
              label: 'Ver',
              onClick: () => setActiveTab(newRecord.vaga_aplicada && newRecord.vaga_aplicada !== 'Geral' ? 'candidaturas' : 'banco_talentos')
            }
          });
        }
      )
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'solicitacoes_empresas' },
        (payload) => {
          const newRecord = payload.new;
          setData(prev => ({
            ...prev,
            solicitacoes: [newRecord, ...prev.solicitacoes]
          }));
          toast.info('Nova solicitação de empresa!', {
            description: `Empresa: ${newRecord.razao_social || 'Não informada'}`,
            action: {
              label: 'Ver',
              onClick: () => setActiveTab('solicitacoes_empresas')
            }
          });
        }
      )
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'candidatos' },
        (payload) => {
          const newRecord = payload.new;
          setData(prev => ({
            ...prev,
            candidatos: [newRecord, ...prev.candidatos]
          }));
          toast.info('Novo currículo recebido (Site)!', {
            description: `Candidato: ${newRecord.nome}`,
            action: {
              label: 'Ver',
              onClick: () => setActiveTab('candidatos')
            }
          });
        }
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'candidatos' },
        (payload) => {
          const updatedRecord = payload.new;
          setData(prev => ({
            ...prev,
            candidatos: prev.candidatos.map(c => c.id === updatedRecord.id ? updatedRecord : c)
          }));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    if (activeTab !== 'dashboard') {
      fetchTabData();
    }
  }, [activeTab]);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [bannersRes, cursosRes, categoriasRes, vagasRes, alunosRes, parceirosRes, curriculosRes, solicitacoesRes, candidatosRes] = await Promise.all([
        supabase.from('banners_home').select('*').order('created_at', { ascending: false }),
        supabase.from('cursos').select('*').order('ordem', { ascending: true }),
        supabase.from('categorias').select('*').order('ordem', { ascending: true }),
        supabase.from('vagas_estagio').select('*').order('prazo_candidatura', { ascending: false }),
        supabase.from('alunos_contratados').select('*').order('created_at', { ascending: false }),
        supabase.from('parceiros').select('*').order('ordem', { ascending: true }),
        supabase.from('curriculos_estagiarios').select('*').order('created_at', { ascending: false }),
        supabase.from('solicitacoes_empresas').select('*').order('created_at', { ascending: false }),
        supabase.from('candidatos').select('*').order('created_at', { ascending: false }),
      ]);

      const allCurriculos = curriculosRes.data || [];
      
      setData({
        banners: bannersRes.data || [],
        cursos: cursosRes.data || [],
        categorias: categoriasRes.data || [],
        vagas: vagasRes.data || [],
        alunos: alunosRes.data || [],
        parceiros: parceirosRes.data || [],
        curriculos: allCurriculos.filter(c => !c.vaga_aplicada || c.vaga_aplicada === 'Geral'),
        candidaturas: allCurriculos.filter(c => c.vaga_aplicada && c.vaga_aplicada !== 'Geral'),
        solicitacoes: solicitacoesRes.data || [],
        candidatos: candidatosRes.data || [],
      });
    } catch (error) {
      console.error('Error fetching all data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTabData = async () => {
    setLoading(true);
    console.log('Buscando dados para:', activeTab, 'Termo:', adminSearchTerm);
    try {
      const tableMap: Partial<Record<Tab, string>> = {
        aparencia: 'banners_home',
        cursos: 'cursos',
        categorias: 'categorias',
        vagas: 'vagas_estagio',
        alunos: 'alunos_contratados',
        parceiros: 'parceiros',
        banco_talentos: 'curriculos_estagiarios',
        candidaturas: 'curriculos_estagiarios',
        solicitacoes_empresas: 'solicitacoes_empresas',
        candidatos: 'candidatos',
      };
      
      const tableName = tableMap[activeTab];
      if (!tableName) return;

      let query = supabase.from(tableName).select('*');
      
      // Pesquisa no servidor se houver termo
      if (adminSearchTerm.trim() !== '') {
        const term = `%${adminSearchTerm}%`;
        if (activeTab === 'vagas') {
          query = query.or(`titulo.ilike.${term},local.ilike.${term}`);
        } else if (activeTab === 'alunos') {
          query = query.or(`nome.ilike.${term},empresa.ilike.${term}`);
        } else if (activeTab === 'banco_talentos' || activeTab === 'candidaturas') {
          query = query.or(`nome_completo.ilike.${term},email.ilike.${term},telefone_whatsapp.ilike.${term}`);
        } else if (activeTab === 'solicitacoes_empresas') {
          query = query.or(`razao_social.ilike.${term},contato_nome.ilike.${term}`);
        } else if (activeTab === 'candidatos') {
          query = query.or(`nome.ilike.${term},email.ilike.${term}`);
        } else if (activeTab === 'cursos') {
          query = query.ilike('titulo', term);
        }
      }

      if (activeTab === 'banco_talentos') {
        query = query.or('vaga_aplicada.is.null,vaga_aplicada.eq.Geral');
      } else if (activeTab === 'candidaturas') {
        query = query.not('vaga_aplicada', 'is', null).not('vaga_aplicada', 'eq', 'Geral');
      }

      if (activeTab === 'categorias' || activeTab === 'parceiros' || activeTab === 'cursos') {
        query = query.order('ordem', { ascending: true });
      } else {
        query = query.order('created_at', { ascending: false });
      }

      const { data: result, error } = await query;

      if (error) throw error;
      
      const dataKey = activeTab === 'aparencia' ? 'banners' : 
                      activeTab === 'alunos' ? 'alunos' : 
                      activeTab === 'banco_talentos' ? 'curriculos' : 
                      activeTab === 'candidaturas' ? 'candidaturas' :
                      activeTab === 'solicitacoes_empresas' ? 'solicitacoes' : 
                      activeTab === 'candidatos' ? 'candidatos' :
                      activeTab;
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
        banco_talentos: 'curriculos_estagiarios',
        solicitacoes_empresas: 'solicitacoes_empresas',
        candidatos: 'candidatos',
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

      // Handle Banner Image Upload
      if (activeTab === 'aparencia' && bannerFile) {
        const fileExt = bannerFile.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `banners/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('categorias_imagens')
          .upload(filePath, bannerFile);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('categorias_imagens')
          .getPublicUrl(filePath);

        finalFormData.imagem_url = publicUrl;
      }

      // Process Cursos Textareas into Arrays
      if (activeTab === 'cursos') {
        const cleanList = (text: string) => {
          return text
            .split('\n')
            .map(line => line.trim())
            .filter(line => line.length > 0)
            .map(line => line.replace(/^(#\d+|\d+[-.)\]]?)\s*/, ''))
            .filter(line => line.length > 0);
        };

        finalFormData.topicos = cleanList(cursoForm.topicos);
      }

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
    setBannerForm({ titulo: '', subtitulo: '', imagem_url: '' });
    setBannerFile(null);
    setCursoForm({ 
      titulo: '', 
      slug: '', 
      categoria_id: '', 
      descricao_curta: '', 
      descricao_completa: '', 
      mercado_trabalho: '',
      carga_horaria: '', 
      imagem_url: '', 
      video_url: '',
      topicos: '', 
      ordem: 0,
      ativo: true 
    });
    setCursoFile(null);
    setCategoriaForm({ titulo: '', ordem: 0, imagem_url: '' });
    setCategoriaFile(null);
    setVagaForm({ titulo: '', area: '', local: '', valor_bolsa: '', requisitos: '', parceiro_id: '', prazo_candidatura: '' });
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
        imagem_url: item.imagem_url || ''
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
        video_url: item.video_url || '',
        topicos: Array.isArray(item.topicos) ? item.topicos.join('\n') : '',
        ordem: item.ordem || 0,
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
        area: item.area || item['àrea'] || '',
        local: item.local || '',
        valor_bolsa: item.valor_bolsa || '',
        requisitos: item.requisitos || item.descricao || '',
        parceiro_id: item.parceiro_id || '',
        prazo_candidatura: item.prazo_candidatura || ''
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
    if (!confirm('Tem certeza que deseja excluir permanentemente este registro?')) return;
    setLoading(true);
    try {
      const tableMap: Partial<Record<Tab, string>> = {
        aparencia: 'banners_home',
        cursos: 'cursos',
        categorias: 'categorias',
        vagas: 'vagas_estagio',
        alunos: 'alunos_contratados',
        parceiros: 'parceiros',
        banco_talentos: 'curriculos_estagiarios',
        candidaturas: 'curriculos_estagiarios',
        solicitacoes_empresas: 'solicitacoes_empresas',
        candidatos: 'candidatos',
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
            const bucketName = 'categorias_imagens';
            await supabase.storage
              .from(bucketName)
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

      // Update local state immediately for instant feedback
      if (activeTab === 'banco_talentos') {
        setData(prev => ({ ...prev, curriculos: prev.curriculos.filter(c => c.id !== id) }));
      } else if (activeTab === 'candidaturas') {
        setData(prev => ({ ...prev, candidaturas: prev.candidaturas.filter(c => c.id !== id) }));
      } else if (activeTab === 'solicitacoes_empresas') {
        setData(prev => ({ ...prev, solicitacoes: prev.solicitacoes.filter(s => s.id !== id) }));
      } else if (activeTab === 'candidatos') {
        setData(prev => ({ ...prev, candidatos: prev.candidatos.filter(c => c.id !== id) }));
      } else {
        fetchTabData();
      }

      toast.success('Registro excluído com sucesso!');
    } catch (error: any) {
      console.error('Error deleting data:', error);
      toast.error(`Erro ao excluir: ${error.message || 'Verifique suas permissões no Supabase.'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleViewCandidate = async (id: string, status: string) => {
    if (status !== 'Novo') return;
    
    try {
      await supabase
        .from('candidatos')
        .update({ status: 'Visualizado' })
        .eq('id', id);
    } catch (error) {
      console.error('Error updating candidate status:', error);
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    const table = (activeTab === 'banco_talentos' || activeTab === 'candidaturas') ? 'curriculos_estagiarios' : 'solicitacoes_empresas';
    try {
      const { error } = await supabase
        .from(table)
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;
      
      toast.success('Status atualizado com sucesso!');
      // Update local state
      if (activeTab === 'banco_talentos') {
        setData({
          ...data,
          curriculos: data.curriculos.map(c => c.id === id ? { ...c, status: newStatus } : c)
        });
      } else if (activeTab === 'candidaturas') {
        setData({
          ...data,
          candidaturas: data.candidaturas.map(c => c.id === id ? { ...c, status: newStatus } : c)
        });
      } else {
        setData({
          ...data,
          solicitacoes: data.solicitacoes.map(s => s.id === id ? { ...s, status: newStatus } : s)
        });
      }

      if (selectedItem && selectedItem.id === id) {
        setSelectedItem({ ...selectedItem, status: newStatus });
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Erro ao atualizar status.');
    }
  };

  const getStatusBadge = (status: string, type: 'estudante' | 'empresa') => {
    const defaultStatus = type === 'estudante' ? 'Novo' : 'Pendente';
    const s = status || defaultStatus;

    if (type === 'estudante') {
      switch (s) {
        case 'Novo': return <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">Novo</span>;
        case 'Em Análise': return <span className="bg-purple-100 text-purple-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">Em Análise</span>;
        case 'Encaminhado': return <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">Encaminhado</span>;
        case 'Contratado': return <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">Contratado</span>;
        default: return <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">{s}</span>;
      }
    } else {
      switch (s) {
        case 'Pendente': return <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">Pendente</span>;
        case 'Em Contato': return <span className="bg-yellow-100 text-yellow-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">Em Contato</span>;
        case 'Fechado': return <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">Fechado</span>;
        case 'Cancelado': return <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">Cancelado</span>;
        default: return <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">{s}</span>;
      }
    }
  };

  const openWhatsApp = (phone: string, name: string, type: 'estudante' | 'empresa', vacancy?: string) => {
    const cleanPhone = phone.replace(/\D/g, '');
    let message = '';
    
    if (type === 'estudante') {
      message = vacancy 
        ? `Olá ${name}, vimos sua candidatura para a vaga de ${vacancy} no portal do Grupo CTE...`
        : `Olá ${name}, vimos seu currículo cadastrado no portal do Grupo CTE...`;
    } else {
      message = `Olá ${name}, recebemos sua solicitação de estagiários pelo portal do Grupo CTE...`;
    }
    
    window.open(`https://wa.me/55${cleanPhone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const getActiveData = () => {
    let baseData: any[] = [];
    if (activeTab === 'aparencia') baseData = data.banners;
    else if (activeTab === 'cursos') {
      if (courseCategoryFilter === 'Todas') baseData = data.cursos;
      else baseData = data.cursos.filter(c => c.categoria_id === courseCategoryFilter);
    }
    else if (activeTab === 'categorias') baseData = data.categorias;
    else if (activeTab === 'vagas') baseData = data.vagas;
    else if (activeTab === 'alunos') baseData = data.alunos;
    else if (activeTab === 'parceiros') baseData = data.parceiros;
    else if (activeTab === 'banco_talentos') baseData = data.curriculos;
    else if (activeTab === 'candidaturas') {
      if (vacancyFilter === 'Todas') baseData = data.candidaturas;
      else baseData = data.candidaturas.filter(c => c.vaga_aplicada === vacancyFilter);
    }
    else if (activeTab === 'solicitacoes_empresas') baseData = data.solicitacoes;
    else if (activeTab === 'candidatos') baseData = data.candidatos;
    
    if (adminSearchTerm.trim() === '') return baseData;

    const term = adminSearchTerm.toLowerCase();
    return baseData.filter(item => {
      const name = (item.titulo || item.nome || item.nome_completo || item.razao_social || '').toLowerCase();
      const company = (item.empresa || '').toLowerCase();
      const area = (item.area || item['àrea'] || '').toLowerCase();
      const res = (item.descricao || item.descricao_curta || item.vaga_aplicada || '').toLowerCase();
      const email = (item.email || '').toLowerCase();
      const phone = (item.telefone_whatsapp || item.whatsapp || '').toLowerCase();
      
      let partnerName = '';
      if (activeTab === 'candidaturas' && item.vaga_aplicada) {
        const vacancy = data.vagas.find(v => v.titulo === item.vaga_aplicada);
        const partner = data.parceiros.find(p => p.id === vacancy?.parceiro_id);
        partnerName = (partner?.nome || '').toLowerCase();
      }

      return name.includes(term) || company.includes(term) || area.includes(term) || res.includes(term) || email.includes(term) || phone.includes(term) || partnerName.includes(term);
    });
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
        
        <nav className="flex-1 p-4 space-y-2 mt-4 overflow-y-auto custom-scrollbar">
          <SidebarItem 
            icon={<BarChart3 size={20} />} 
            label="Dashboard" 
            active={activeTab === 'dashboard'} 
            onClick={() => setActiveTab('dashboard')} 
            isOpen={isSidebarOpen}
          />

          <SidebarGroup 
            icon={<GraduationCap size={20} />} 
            label="Cursos" 
            isOpen={isSidebarOpen}
            isExpanded={expandedGroups.cursos}
            onToggle={() => toggleGroup('cursos')}
          >
            <SidebarItem 
              icon={<GraduationCap size={18} />} 
              label="Cursos" 
              active={activeTab === 'cursos'} 
              onClick={() => setActiveTab('cursos')} 
              isOpen={isSidebarOpen}
              isSubItem
            />
            <SidebarItem 
              icon={<Layers size={18} />} 
              label="Categorias" 
              active={activeTab === 'categorias'} 
              onClick={() => setActiveTab('categorias')} 
              isOpen={isSidebarOpen}
              isSubItem
            />
          </SidebarGroup>

          <SidebarGroup 
            icon={<Briefcase size={20} />} 
            label="Empregabilidade" 
            isOpen={isSidebarOpen}
            isExpanded={expandedGroups.empregabilidade}
            onToggle={() => toggleGroup('empregabilidade')}
          >
            <SidebarItem 
              icon={<Briefcase size={18} />} 
              label="Vagas de Estágio" 
              active={activeTab === 'vagas'} 
              onClick={() => setActiveTab('vagas')} 
              isOpen={isSidebarOpen}
              isSubItem
            />
            <SidebarItem 
              icon={<Users size={18} />} 
              label="Banco de Talentos" 
              active={activeTab === 'banco_talentos'} 
              onClick={() => setActiveTab('banco_talentos')} 
              isOpen={isSidebarOpen}
              isSubItem
            />
            <SidebarItem 
              icon={<Target size={18} />} 
              label="Candidaturas" 
              active={activeTab === 'candidaturas'} 
              onClick={() => setActiveTab('candidaturas')} 
              isOpen={isSidebarOpen}
              isSubItem
            />
            <SidebarItem 
              icon={<Star size={18} />} 
              label="Alunos Contratados" 
              active={activeTab === 'alunos'} 
              onClick={() => setActiveTab('alunos')} 
              isOpen={isSidebarOpen}
              isSubItem
            />
            <SidebarItem 
              icon={<MessageCircle size={18} />} 
              label="Solicitações Empresas" 
              active={activeTab === 'solicitacoes_empresas'} 
              onClick={() => setActiveTab('solicitacoes_empresas')} 
              isOpen={isSidebarOpen}
              isSubItem
            />
            <SidebarItem 
              icon={<FileText size={18} />} 
              label="Currículos (Site)" 
              active={activeTab === 'candidatos'} 
              onClick={() => setActiveTab('candidatos')} 
              isOpen={isSidebarOpen}
              isSubItem
            />
          </SidebarGroup>

          <SidebarGroup 
            icon={<Palette size={20} />} 
            label="Site Institucional" 
            isOpen={isSidebarOpen}
            isExpanded={expandedGroups.site}
            onToggle={() => toggleGroup('site')}
          >
            <SidebarItem 
              icon={<Palette size={18} />} 
              label="Aparência do Site" 
              active={activeTab === 'aparencia'} 
              onClick={() => setActiveTab('aparencia')} 
              isOpen={isSidebarOpen}
              isSubItem
            />
            <SidebarItem 
              icon={<Palette size={18} />} 
              label="Parceiros" 
              active={activeTab === 'parceiros'} 
              onClick={() => setActiveTab('parceiros')} 
              isOpen={isSidebarOpen}
              isSubItem
            />
          </SidebarGroup>

          <SidebarItem 
            icon={<Link2 size={20} />} 
            label="Links Úteis" 
            active={activeTab === 'links_uteis'} 
            onClick={() => setActiveTab('links_uteis')} 
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
                value={adminSearchTerm}
                onChange={(e) => setAdminSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-gray-100 border-none rounded-full text-sm focus:ring-2 focus:ring-orange-500 outline-none w-64 transition-all"
              />
            </div>
            <div className="relative">
              <button 
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors"
              >
                <Bell size={20} />
                {newLeadsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                    {newLeadsCount}
                  </span>
                )}
              </button>

              <AnimatePresence>
                {isNotificationsOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setIsNotificationsOpen(false)}
                    />
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden"
                    >
                      <div className="p-4 border-b border-gray-50 bg-gray-50/50">
                        <h3 className="text-sm font-black text-blue-950 uppercase tracking-wider">Notificações</h3>
                      </div>
                      <div className="max-h-96 overflow-y-auto">
                        {notificationDetails.length > 0 ? (
                          <div className="divide-y divide-gray-50">
                            {notificationDetails.map((notif) => (
                              <button
                                key={notif.id}
                                onClick={() => {
                                  setActiveTab(notif.tab);
                                  setIsNotificationsOpen(false);
                                }}
                                className="w-full text-left p-4 hover:bg-orange-50 transition-colors flex items-start space-x-3 group"
                              >
                                <div className="mt-1 w-2 h-2 rounded-full bg-orange-600 shrink-0" />
                                <span className="text-sm font-medium text-gray-700 group-hover:text-blue-950 leading-relaxed">
                                  {notif.text}
                                </span>
                              </button>
                            ))}
                          </div>
                        ) : (
                          <div className="p-8 text-center">
                            <Bell className="mx-auto h-8 w-8 text-gray-200 mb-3" />
                            <p className="text-sm font-medium text-gray-400">Nenhuma notificação no momento</p>
                          </div>
                        )}
                      </div>
                      {notificationDetails.length > 0 && (
                        <div className="p-3 bg-gray-50 border-t border-gray-100 text-center">
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                            Clique para gerenciar os leads
                          </p>
                        </div>
                      )}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
            <div className="flex items-center space-x-3 pl-4 border-l border-gray-100">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-blue-950">Admin Grupo CTE</p>
                <p className="text-xs text-gray-500">Administrador Master</p>
              </div>
              <img 
                src="https://res.cloudinary.com/dapsovbs5/image/upload/q_auto/f_auto/v1775565377/Favicon_Grupo_CTE_siimdc.webp" 
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
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                    <StatCard 
                      title="Banco de Talentos" 
                      value={data.curriculos.length} 
                      icon={<Users className="text-indigo-600" />} 
                      color="bg-indigo-50"
                    />
                    <StatCard 
                      title="Candidaturas" 
                      value={data.candidaturas.length} 
                      icon={<Target className="text-orange-600" />} 
                      color="bg-orange-50"
                    />
                    <StatCard 
                      title="Solicitações" 
                      value={data.solicitacoes.length} 
                      icon={<Briefcase className="text-rose-600" />} 
                      color="bg-rose-50"
                    />
                    <StatCard 
                      title="Currículos Site" 
                      value={data.candidatos.length} 
                      icon={<FileText className="text-emerald-600" />} 
                      color="bg-emerald-50"
                    />
                  </div>

                  <div className="bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-sm">
                    <h3 className="text-xl font-black text-blue-950 mb-6">Atividades Recentes</h3>
                    <div className="space-y-4">
                      <p className="text-gray-400 font-medium italic">Nenhuma atividade recente para exibir.</p>
                    </div>
                  </div>
                </div>
              ) : activeTab === 'candidatos' ? (
                <div className="space-y-8">
                  <div className="flex flex-col">
                    <h2 className="text-3xl font-black text-blue-950">Currículos Recebidos</h2>
                    <p className="text-gray-500 font-medium mt-1">Candidatos que enviaram currículo através do "Trabalhe Conosco".</p>
                  </div>

                  <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="bg-gray-50/50 border-b border-gray-100">
                            <th className="px-8 py-6 text-xs font-black text-gray-400 uppercase tracking-widest">Data</th>
                            <th className="px-8 py-6 text-xs font-black text-gray-400 uppercase tracking-widest">Nome do Candidato</th>
                            <th className="px-8 py-6 text-xs font-black text-gray-400 uppercase tracking-widest">Contato</th>
                            <th className="px-8 py-6 text-xs font-black text-gray-400 uppercase tracking-widest text-right">Ação</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {data.candidatos.map((item) => (
                            <tr key={item.id} className="hover:bg-gray-50/50 transition-colors group">
                              <td className="px-8 py-6 text-gray-400 text-xs font-medium">
                                {new Date(item.created_at).toLocaleDateString('pt-BR')}
                              </td>
                              <td className="px-8 py-6 font-bold text-blue-950">
                                <div className="flex items-center space-x-2">
                                  <span>{item.nome}</span>
                                  {item.status === 'Novo' && (
                                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-black rounded-full uppercase tracking-wider">
                                      Novo
                                    </span>
                                  )}
                                </div>
                              </td>
                              <td className="px-8 py-6">
                                <div className="flex flex-col">
                                  <span className="text-sm font-bold text-blue-950">{item.email}</span>
                                  <span className="text-xs text-gray-500 font-medium">{item.telefone}</span>
                                </div>
                              </td>
                              <td className="px-8 py-6 text-right">
                                <a 
                                  href={item.url_curriculo} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  onClick={() => handleViewCandidate(item.id, item.status)}
                                  className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-xl text-xs font-black hover:bg-blue-100 transition-all border border-blue-100"
                                >
                                  <FileText size={14} />
                                  <span>Ver Currículo</span>
                                </a>
                                <button 
                                  onClick={() => handleDelete(item.id)}
                                  className="ml-2 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                  title="Excluir"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </td>
                            </tr>
                          ))}
                          {data.candidatos.length === 0 && !loading && (
                            <tr>
                              <td colSpan={4} className="px-8 py-12 text-center text-gray-400 font-medium">
                                Nenhum currículo recebido ainda.
                              </td>
                            </tr>
                          )}
                          {loading && data.candidatos.length === 0 && (
                            <tr>
                              <td colSpan={4} className="px-8 py-12 text-center text-gray-400 font-medium">
                                <div className="flex flex-col items-center justify-center space-y-2">
                                  <Loader2 className="animate-spin text-orange-600" size={32} />
                                  <span>Carregando...</span>
                                </div>
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              ) : activeTab === 'links_uteis' ? (
                <div className="space-y-10">
                  <div className="flex flex-col">
                    <h2 className="text-3xl font-black text-blue-950">Central de Sistemas</h2>
                    <p className="text-gray-500 font-medium mt-1">Acesso rápido aos sistemas utilizados pela equipe do Grupo CTE.</p>
                  </div>

                  <UsefulLinksGrid />
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
              ) : activeTab === 'banco_talentos' || activeTab === 'candidaturas' || activeTab === 'solicitacoes_empresas' ? (
                <div className="space-y-8">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                      <h2 className="text-3xl font-black text-blue-950">
                        {activeTab === 'banco_talentos' ? 'Banco de Talentos' : 
                         activeTab === 'candidaturas' ? 'Candidaturas Específicas' :
                         'Solicitações de Empresas'}
                      </h2>
                      <p className="text-gray-500 font-medium mt-1">
                        {activeTab === 'banco_talentos' 
                          ? 'Visualize os currículos cadastrados no banco geral.' 
                          : activeTab === 'candidaturas'
                            ? 'Gerencie as candidaturas para vagas específicas.'
                            : 'Gerencie as solicitações de estagiários enviadas pelas empresas.'}
                      </p>
                    </div>

                    <div className="flex items-center space-x-4">
                      {/* Search Input local */}
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                        <input 
                          type="text" 
                          placeholder="Pesquisar por nome..." 
                          value={adminSearchTerm}
                          onChange={(e) => setAdminSearchTerm(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && fetchTabData()}
                          className="pl-9 pr-4 py-2 bg-white border border-gray-100 rounded-xl text-xs font-bold text-blue-950 focus:ring-2 focus:ring-orange-500 outline-none w-48 shadow-sm transition-all"
                        />
                      </div>

                      {activeTab === 'candidaturas' && (
                        <div className="flex items-center space-x-2 bg-white p-2 rounded-2xl border border-gray-100 shadow-sm">
                          <div className="flex items-center space-x-2 px-3 text-gray-400">
                            <Filter size={16} />
                            <span className="text-xs font-black uppercase tracking-widest">Filtrar Vaga:</span>
                          </div>
                          <select 
                            value={vacancyFilter}
                            onChange={(e) => setVacancyFilter(e.target.value)}
                            className="bg-gray-50 border-none rounded-xl text-sm font-bold text-blue-950 focus:ring-2 focus:ring-orange-500 outline-none px-4 py-2 min-w-[200px]"
                          >
                            <option value="Todas">Todas as Vagas</option>
                            {Array.from(new Set(data.candidaturas.map(c => c.vaga_aplicada))).map(vaga => (
                              <option key={vaga} value={vaga}>{vaga}</option>
                            ))}
                          </select>
                        </div>
                      )}

                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => {
                            console.log('Botão de Pesquisa (Leads) clicado!');
                            fetchTabData();
                          }}
                          className="p-3 bg-white hover:bg-orange-50 hover:text-orange-600 text-gray-400 rounded-xl border border-gray-100 shadow-sm transition-all"
                          title="Realizar Busca"
                        >
                          <Search size={18} />
                        </button>
                        <button 
                          onClick={() => {
                            console.log('Botão de Limpar (Leads) clicado!');
                            setAdminSearchTerm('');
                            fetchTabData();
                          }}
                          className="p-3 bg-white hover:bg-blue-50 hover:text-blue-600 text-gray-400 rounded-xl border border-gray-100 shadow-sm transition-all"
                          title="Limpar Filtros"
                        >
                          <Filter size={18} />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="bg-gray-50/50 border-b border-gray-100">
                            {activeTab === 'banco_talentos' || activeTab === 'candidaturas' ? (
                              <>
                                <th className="px-8 py-6 text-xs font-black text-gray-400 uppercase tracking-widest">Nome</th>
                                {activeTab === 'candidaturas' && (
                                  <>
                                    <th className="px-8 py-6 text-xs font-black text-orange-600 uppercase tracking-widest text-center">Vaga</th>
                                    <th className="px-8 py-6 text-xs font-black text-gray-400 uppercase tracking-widest">Empresa</th>
                                  </>
                                )}
                                <th className="px-8 py-6 text-xs font-black text-gray-400 uppercase tracking-widest">Telefone</th>
                                <th className="px-8 py-6 text-xs font-black text-gray-400 uppercase tracking-widest">Status</th>
                                <th className="px-8 py-6 text-xs font-black text-gray-400 uppercase tracking-widest">Data</th>
                              </>
                            ) : (
                              <>
                                <th className="px-8 py-6 text-xs font-black text-gray-400 uppercase tracking-widest">Razão Social</th>
                                <th className="px-8 py-6 text-xs font-black text-gray-400 uppercase tracking-widest">Responsável</th>
                                <th className="px-8 py-6 text-xs font-black text-gray-400 uppercase tracking-widest">Telefone</th>
                                <th className="px-8 py-6 text-xs font-black text-gray-400 uppercase tracking-widest">Status</th>
                                <th className="px-8 py-6 text-xs font-black text-gray-400 uppercase tracking-widest">Data</th>
                              </>
                            )}
                            <th className="px-8 py-6 text-xs font-black text-gray-400 uppercase tracking-widest text-right">Ações</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {activeTab === 'banco_talentos' || activeTab === 'candidaturas' ? (
                            getActiveData().map((item) => (
                              <tr key={item.id} className="hover:bg-gray-50/50 transition-colors group">
                                <td className="px-8 py-6 font-bold text-blue-950">{item.nome_completo}</td>
                                {activeTab === 'candidaturas' && (
                                  <>
                                    <td className="px-8 py-6">
                                      <div className="bg-orange-50 text-orange-700 px-3 py-1 rounded-lg text-xs font-black uppercase tracking-wider border border-orange-100 text-center truncate max-w-[150px]" title={item.vaga_aplicada}>
                                        {item.vaga_aplicada}
                                      </div>
                                    </td>
                                    <td className="px-8 py-6">
                                      <div className="text-xs font-bold text-blue-950 truncate max-w-[150px]" title={
                                        (() => {
                                          const vacancy = data.vagas.find(v => v.titulo === item.vaga_aplicada);
                                          const partner = data.parceiros.find(p => p.id === vacancy?.parceiro_id);
                                          return partner?.nome || 'Empresa Própria';
                                        })()
                                      }>
                                        {(() => {
                                          const vacancy = data.vagas.find(v => v.titulo === item.vaga_aplicada);
                                          const partner = data.parceiros.find(p => p.id === vacancy?.parceiro_id);
                                          return partner?.nome || 'Empresa Própria';
                                        })()}
                                      </div>
                                    </td>
                                  </>
                                )}
                                <td className="px-8 py-6 text-gray-500 font-medium">
                                  <div className="flex flex-col">
                                    <span>{item.telefone_whatsapp}</span>
                                    {item.telefone_whatsapp_2 && (
                                      <span className="text-[10px] text-gray-400 font-bold">{item.telefone_whatsapp_2}</span>
                                    )}
                                  </div>
                                </td>
                                <td className="px-8 py-6">
                                  <select 
                                    value={item.status || 'Novo'}
                                    onChange={(e) => handleStatusChange(item.id, e.target.value)}
                                    className={`
                                      text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider border-none outline-none cursor-pointer transition-all appearance-none text-center
                                      ${item.status === 'Novo' ? 'bg-blue-100 text-blue-600' : 
                                        item.status === 'Em Análise' ? 'bg-orange-100 text-orange-600' : 
                                        item.status === 'Encaminhado' ? 'bg-purple-100 text-purple-600' : 
                                        item.status === 'Contratado' ? 'bg-green-100 text-green-600' : 
                                        'bg-gray-100 text-gray-600'}
                                    `}
                                  >
                                    <option value="Novo">Novo</option>
                                    <option value="Em Análise">Em Análise</option>
                                    <option value="Encaminhado">Encaminhado</option>
                                    <option value="Contratado">Contratado</option>
                                  </select>
                                </td>
                                <td className="px-8 py-6 text-gray-400 text-xs font-medium">
                                  {new Date(item.created_at).toLocaleDateString('pt-BR')}
                                </td>
                                <td className="px-8 py-6 text-right">
                                  <div className="flex items-center justify-end space-x-2">
                                    <button 
                                      onClick={() => openWhatsApp(item.telefone_whatsapp, item.nome_completo, 'estudante', item.vaga_aplicada)}
                                      className="p-2 text-green-500 hover:bg-green-50 rounded-lg transition-all"
                                      title="Contatar via WhatsApp"
                                    >
                                      <MessageCircle size={18} />
                                    </button>
                                    <button 
                                      onClick={() => { setSelectedItem(item); setIsModalOpen(true); }}
                                      className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-all"
                                      title="Ver Detalhes"
                                    >
                                      <Eye size={18} />
                                    </button>
                                    <button 
                                      onClick={() => handleDelete(item.id)}
                                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                      title="Excluir"
                                    >
                                      <Trash2 size={18} />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))
                          ) : (
                            getActiveData().map((item) => (
                              <tr key={item.id} className="hover:bg-gray-50/50 transition-colors group">
                                <td className="px-8 py-6 font-bold text-blue-950">{item.razao_social}</td>
                                <td className="px-8 py-6 text-gray-500 font-medium">{item.contato_nome}</td>
                                <td className="px-8 py-6 text-gray-500 font-medium">{item.telefone_whatsapp}</td>
                                <td className="px-8 py-6">
                                  <select 
                                    value={item.status || 'Pendente'}
                                    onChange={(e) => handleStatusChange(item.id, e.target.value)}
                                    className={`
                                      text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider border-none outline-none cursor-pointer transition-all appearance-none text-center
                                      ${item.status === 'Pendente' ? 'bg-blue-100 text-blue-600' : 
                                        item.status === 'Em Contato' ? 'bg-yellow-100 text-yellow-600' : 
                                        item.status === 'Fechado' ? 'bg-green-100 text-green-600' : 
                                        item.status === 'Cancelado' ? 'bg-gray-100 text-gray-600' : 
                                        'bg-gray-100 text-gray-600'}
                                    `}
                                  >
                                    <option value="Pendente">Pendente</option>
                                    <option value="Em Contato">Em Contato</option>
                                    <option value="Fechado">Fechado</option>
                                    <option value="Cancelado">Cancelado</option>
                                  </select>
                                </td>
                                <td className="px-8 py-6 text-gray-400 text-xs font-medium">
                                  {new Date(item.created_at).toLocaleDateString('pt-BR')}
                                </td>
                                <td className="px-8 py-6 text-right">
                                  <div className="flex items-center justify-end space-x-2">
                                    <button 
                                      onClick={() => openWhatsApp(item.telefone_whatsapp, item.contato_nome, 'empresa')}
                                      className="p-2 text-green-500 hover:bg-green-50 rounded-lg transition-all"
                                      title="Contatar via WhatsApp"
                                    >
                                      <MessageCircle size={18} />
                                    </button>
                                    <button 
                                      onClick={() => { setSelectedItem(item); setIsModalOpen(true); }}
                                      className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-all"
                                      title="Ver Detalhes"
                                    >
                                      <Eye size={18} />
                                    </button>
                                    <button 
                                      onClick={() => handleDelete(item.id)}
                                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                      title="Excluir"
                                    >
                                      <Trash2 size={18} />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))
                          )}
                          {((activeTab === 'banco_talentos' && getActiveData().length === 0) || 
                            (activeTab === 'candidaturas' && getActiveData().length === 0) ||
                            (activeTab === 'solicitacoes_empresas' && getActiveData().length === 0)) && (
                            <tr>
                              <td colSpan={7} className="px-8 py-12 text-center text-gray-400 font-medium">
                                Nenhum registro encontrado.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
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
                              
                              <div className="space-y-2">
                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Imagem do Banner</label>
                                <input 
                                  type="file" 
                                  accept="image/*"
                                  onChange={(e) => setBannerFile(e.target.files?.[0] || null)}
                                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:bg-white focus:ring-2 focus:ring-orange-500 outline-none transition-all font-medium"
                                />
                                {(bannerForm.imagem_url || bannerFile) && (
                                  <div className="mt-4 p-2 bg-gray-50 rounded-2xl border border-gray-100 inline-block">
                                    <img 
                                      src={bannerFile ? URL.createObjectURL(bannerFile) : bannerForm.imagem_url} 
                                      className="w-full max-w-[200px] h-auto rounded-xl object-cover shadow-sm" 
                                      alt="Preview"
                                      referrerPolicy="no-referrer"
                                    />
                                  </div>
                                )}
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
                              <FormInput 
                                label="Ordem de Exibição" 
                                type="number"
                                value={cursoForm.ordem} 
                                onChange={(v) => setCursoForm({...cursoForm, ordem: parseInt(v) || 0})} 
                                placeholder="Ex: 1"
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
                              <FormInput 
                                label="URL do Vídeo (Opcional - YouTube/Vimeo/etc.)" 
                                value={cursoForm.video_url} 
                                onChange={(v: string) => setCursoForm({...cursoForm, video_url: v})} 
                                placeholder="https://www.youtube.com/embed/..."
                                required={false}
                              />
                              
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

                              <div className="space-y-2">
                                <FormTextArea 
                                  label="Tópicos do Curso" 
                                  value={cursoForm.topicos} 
                                  onChange={(v) => setCursoForm({...cursoForm, topicos: v})} 
                                  placeholder="Cole os itens aqui, um por linha. O sistema irá separá-los automaticamente."
                                />
                                <p className="text-[10px] text-gray-400 font-bold italic">Dica: O sistema remove automaticamente números e prefixos como #01 ou 1.</p>
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
                              <FormInput label="Título da Vaga" value={vagaForm.titulo} onChange={(v: string) => setVagaForm({...vagaForm, titulo: v})} />
                              <div className="grid grid-cols-2 gap-4">
                                <FormInput 
                                  label="Área" 
                                  value={vagaForm.area} 
                                  onChange={(v: string) => setVagaForm({...vagaForm, area: v})} 
                                  placeholder="Ex: Tecnologia, Administração..."
                                />
                                <FormInput label="Local" value={vagaForm.local} onChange={(v: string) => setVagaForm({...vagaForm, local: v})} />
                              </div>
                              <div className="space-y-2">
                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Empresa Parceira *</label>
                                <select 
                                  required
                                  value={vagaForm.parceiro_id}
                                  onChange={(e) => setVagaForm({...vagaForm, parceiro_id: e.target.value})}
                                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:bg-white focus:ring-2 focus:ring-orange-500 outline-none transition-all font-medium"
                                >
                                  <option value="">Selecione a Empresa...</option>
                                  {data.parceiros.map(p => (
                                    <option key={p.id} value={p.id}>{p.nome}</option>
                                  ))}
                                </select>
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <FormInput label="Valor da Bolsa" value={vagaForm.valor_bolsa} onChange={(v: string) => setVagaForm({...vagaForm, valor_bolsa: v})} placeholder="R$ 800,00" />
                                <FormInput label="Prazo de Candidatura" value={vagaForm.prazo_candidatura} onChange={(v: string) => setVagaForm({...vagaForm, prazo_candidatura: v})} type="date" />
                              </div>
                              <FormTextArea label="Requisitos" value={vagaForm.requisitos} onChange={(v: string) => setVagaForm({...vagaForm, requisitos: v})} placeholder="Liste os requisitos da vaga..." />
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
                            {/* Search Input local para reforço visual */}
                            <div className="relative">
                              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                              <input 
                                type="text" 
                                placeholder="Pesquisar..." 
                                value={adminSearchTerm}
                                onChange={(e) => setAdminSearchTerm(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && fetchTabData()}
                                className="pl-9 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-[11px] font-bold focus:ring-2 focus:ring-orange-500 outline-none w-40 transition-all"
                              />
                            </div>
                            
                            {activeTab === 'cursos' && (
                              <div className="flex items-center space-x-2 bg-gray-50 p-1.5 rounded-xl border border-gray-100">
                                <Filter size={14} className="text-gray-400 ml-2" />
                                <select 
                                  value={courseCategoryFilter}
                                  onChange={(e) => setCourseCategoryFilter(e.target.value)}
                                  className="bg-transparent border-none text-[11px] font-black uppercase tracking-wider text-blue-950 focus:ring-0 outline-none cursor-pointer pr-8"
                                >
                                  <option value="Todas">Todas Categorias</option>
                                  {data.categorias.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.titulo}</option>
                                  ))}
                                </select>
                              </div>
                            )}
                            {activeTab === 'categorias' && (
                              <button 
                                onClick={resetForm}
                                className="flex items-center space-x-2 px-4 py-2 bg-orange-600 text-white text-xs font-black rounded-xl hover:bg-orange-700 transition-all shadow-lg shadow-orange-600/20 mr-2"
                              >
                                <Plus size={14} />
                                <span>Nova Categoria</span>
                              </button>
                            )}
                            <button 
                              onClick={() => {
                                console.log('Botão de Pesquisa clicado!');
                                fetchTabData();
                              }} 
                              className="p-2 hover:bg-orange-50 hover:text-orange-600 rounded-lg transition-colors text-gray-500"
                              title="Executar Busca"
                            >
                              <Search size={18} />
                            </button>
                            <button 
                              onClick={() => {
                                console.log('Botão de Filtro clicado!');
                                setAdminSearchTerm('');
                                fetchTabData();
                              }}
                              className="p-2 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors text-gray-500"
                              title="Limpar Filtros"
                            >
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
                                      <div className="w-12 h-12 rounded-xl bg-white overflow-hidden flex-shrink-0 border border-gray-100 flex items-center justify-center">
                                        {activeTab === 'vagas' ? (
                                          (() => {
                                            const partner = data.parceiros.find(p => p.id === item.parceiro_id);
                                            return partner?.logo_url ? (
                                              <img 
                                                src={partner.logo_url} 
                                                className="w-full h-full object-contain p-1.5" 
                                                alt={partner.nome}
                                                referrerPolicy="no-referrer"
                                              />
                                            ) : (
                                              <div className="w-full h-full bg-[#1a233e] flex items-center justify-center">
                                                <Briefcase className="h-5 w-5 text-white" />
                                              </div>
                                            );
                                          })()
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
                                            ? `${data.categorias.find(c => c.id === item.categoria_id)?.titulo || 'Sem Categoria'} • Ordem: ${item.ordem || 0}`
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
                                        {item.descricao_curta || item.subtitulo || item.descricao || item.requisitos || item.local || item.empresa}
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
                                      {activeTab === 'vagas' && (
                                        <button 
                                          onClick={() => handleDownloadInstagram(item)}
                                          className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"
                                          title="Baixar Imagem para Instagram"
                                        >
                                          <Download size={18} />
                                        </button>
                                      )}
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

      {/* Details Modal */}
      <AnimatePresence>
        {isModalOpen && selectedItem && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-blue-950/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-2xl overflow-hidden relative z-10"
            >
              <div className="p-8 md:p-12">
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <span className="text-orange-600 font-black text-xs uppercase tracking-[0.2em] mb-2 block">
                      {activeTab === 'banco_talentos' ? 'Currículo do Estudante' : 
                       activeTab === 'candidaturas' ? 'Candidatura Específica' :
                       'Solicitação de Empresa'}
                    </span>
                    <h2 className="text-3xl font-black text-blue-950">
                      {selectedItem.nome_completo || selectedItem.razao_social}
                    </h2>
                  </div>
                  <button 
                    onClick={() => setIsModalOpen(false)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <XCircle size={24} className="text-gray-400" />
                  </button>
                </div>

                <div className="space-y-8 max-h-[60vh] overflow-y-auto pr-4 custom-scrollbar">
                  {activeTab === 'banco_talentos' || activeTab === 'candidaturas' ? (
                    <>
                      {selectedItem.vaga_aplicada && selectedItem.vaga_aplicada !== 'Geral' && (
                        <div className="mb-8 bg-orange-50 p-6 rounded-2xl border border-orange-100 grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <h4 className="text-[10px] font-black text-orange-600 uppercase tracking-widest mb-2">Vaga Aplicada</h4>
                            <p className="text-2xl font-black text-blue-950">{selectedItem.vaga_aplicada}</p>
                          </div>
                          <div>
                            <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Empresa</h4>
                            <p className="text-xl font-black text-blue-950">
                              {(() => {
                                const vacancy = data.vagas.find(v => v.titulo === selectedItem.vaga_aplicada);
                                const partner = data.parceiros.find(p => p.id === vacancy?.parceiro_id);
                                return partner?.nome || 'Empresa Própria';
                              })()}
                            </p>
                          </div>
                        </div>
                      )}
                      <div className="grid grid-cols-2 gap-8">
                        <div>
                          <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Contato</h4>
                          <p className="font-bold text-blue-950">{selectedItem.telefone_whatsapp}</p>
                          {selectedItem.telefone_whatsapp_2 && (
                            <p className="font-bold text-blue-950">{selectedItem.telefone_whatsapp_2}</p>
                          )}
                          <p className="text-gray-500 font-medium">{selectedItem.email}</p>
                        </div>
                        <div>
                          <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Localização</h4>
                          <p className="font-bold text-blue-950">{selectedItem.cidade}</p>
                          <p className="text-gray-500 font-medium">{selectedItem.bairro}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-8">
                        <div>
                          <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Escolaridade</h4>
                          <p className="font-bold text-blue-950">{selectedItem.escolaridade}</p>
                          <p className="text-gray-500 font-medium">{selectedItem.instituicao_ensino}</p>
                          <p className="text-xs text-gray-400 font-bold mt-1">Turno: {selectedItem.turno_estudo}</p>
                        </div>
                        <div>
                          <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Status do Lead</h4>
                          <select 
                            value={selectedItem.status || (activeTab === 'solicitacoes_empresas' ? 'Pendente' : 'Novo')}
                            onChange={(e) => handleStatusChange(selectedItem.id, e.target.value)}
                            className="w-full px-4 py-2 rounded-xl bg-gray-50 border border-gray-100 focus:bg-white focus:ring-2 focus:ring-orange-500 outline-none transition-all font-bold text-sm text-blue-950"
                          >
                            {activeTab === 'solicitacoes_empresas' ? (
                              <>
                                <option value="Pendente">Pendente</option>
                                <option value="Em Contato">Em Contato</option>
                                <option value="Fechado">Fechado</option>
                                <option value="Cancelado">Cancelado</option>
                              </>
                            ) : (
                              <>
                                <option value="Novo">Novo</option>
                                <option value="Em Análise">Em Análise</option>
                                <option value="Encaminhado">Encaminhado</option>
                                <option value="Contratado">Contratado</option>
                              </>
                            )}
                          </select>
                          <div className="mt-2">
                            {getStatusBadge(selectedItem.status, activeTab === 'solicitacoes_empresas' ? 'empresa' : 'estudante')}
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Áreas de Interesse</h4>
                        <p className="font-bold text-blue-950">{selectedItem.areas_interesse}</p>
                      </div>

                      <div>
                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Resumo / Experiência</h4>
                        <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 italic text-gray-600 font-medium leading-relaxed">
                          {selectedItem.resumo_experiencia || 'Nenhum resumo fornecido.'}
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="grid grid-cols-2 gap-8">
                        <div>
                          <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Empresa</h4>
                          <p className="font-bold text-blue-950">{selectedItem.razao_social}</p>
                        </div>
                        <div>
                          <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Responsável</h4>
                          <p className="font-bold text-blue-950">{selectedItem.contato_nome}</p>
                          <p className="text-gray-500 font-medium">{selectedItem.telefone_whatsapp}</p>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Vaga Solicitada</h4>
                        <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
                          <p className="text-xl font-black text-blue-950">{selectedItem.tipo_vaga}</p>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Data da Solicitação</h4>
                        <p className="font-bold text-blue-950">
                          {new Date(selectedItem.created_at).toLocaleString('pt-BR')}
                        </p>
                      </div>
                    </>
                  )}
                </div>

                <div className="mt-12 pt-8 border-t border-gray-100 flex justify-end">
                  <button 
                    onClick={() => setIsModalOpen(false)}
                    className="bg-blue-950 text-white px-8 py-4 rounded-2xl font-black hover:bg-blue-900 transition-all"
                  >
                    Fechar Detalhes
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Hidden elements for capture */}
      <div style={{ position: 'absolute', top: '-10000px', left: '-10000px', pointerEvents: 'none' }}>
        <InstagramStoryTemplate 
          ref={storyRef} 
          vacancy={capturingVacancy} 
          partner={data.parceiros.find(p => p.id === capturingVacancy?.parceiro_id)}
        />
      </div>
    </div>
  );
}

function SidebarItem({ icon, label, active, onClick, href, isOpen, className = "", target, rel, isSubItem }: any) {
  const content = (
    <div className={`flex items-center ${isOpen ? (isSubItem ? 'space-x-3 pl-10 pr-4' : 'space-x-3 px-4') : 'justify-center'} py-3 rounded-xl transition-all font-bold ${isSubItem ? 'text-[13px] opacity-80' : 'text-sm'} ${active ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/20' : 'hover:bg-white/5 text-gray-400 hover:text-white'} ${className}`}>
      <div className={`${active ? 'scale-110' : ''} transition-transform flex-shrink-0`}>{icon}</div>
      {isOpen && <motion.span initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="truncate">{label}</motion.span>}
    </div>
  );

  if (href) return <a href={href} target={target} rel={rel} className="block">{content}</a>;
  return <button onClick={onClick} className="w-full text-left">{content}</button>;
}

function SidebarGroup({ icon, label, isOpen, isExpanded, onToggle, children }: any) {
  return (
    <div className="space-y-1">
      <button 
        onClick={onToggle}
        className={`w-full flex items-center justify-between py-3 rounded-xl transition-all font-bold text-sm hover:bg-white/5 text-gray-400 hover:text-white ${isOpen ? 'px-4' : 'justify-center'}`}
      >
        <div className="flex items-center space-x-3 overflow-hidden">
          <div className="transition-transform flex-shrink-0">{icon}</div>
          {isOpen && <motion.span initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="truncate">{label}</motion.span>}
        </div>
        {isOpen && (
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="flex-shrink-0"
          >
            <ChevronDown size={14} className="opacity-30" />
          </motion.div>
        )}
      </button>
      
      <AnimatePresence initial={false}>
        {isExpanded && isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden space-y-1"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
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

function FormInput({ label, value, onChange, placeholder, type = "text", required = true }: any) {
  return (
    <div className="space-y-2">
      <label className="text-xs font-black text-gray-400 uppercase tracking-widest">{label}</label>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:bg-white focus:ring-2 focus:ring-orange-500 outline-none transition-all font-medium placeholder:text-gray-300"
        placeholder={placeholder}
      />
    </div>
  );
}

function FormTextArea({ label, value, onChange, placeholder, required = true }: any) {
  return (
    <div className="space-y-2">
      <label className="text-xs font-black text-gray-400 uppercase tracking-widest">{label}</label>
      <textarea
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:bg-white focus:ring-2 focus:ring-orange-500 outline-none transition-all font-medium h-32 resize-none placeholder:text-gray-300"
        placeholder={placeholder}
      />
    </div>
  );
}

const InstagramStoryTemplate = React.forwardRef(({ vacancy, partner }: any, ref: any) => {
  if (!vacancy) return null;
  
  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    // Corrigindo problema de fuso horário: formatar data sem conversão automática para UTC
    const [year, month, day] = dateStr.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString('pt-BR');
  };

  const InfoItem = ({ icon, text, label }: { icon: string, text: string, label: string }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '25px', marginBottom: '20px' }}>
      <div style={{ 
        width: '65px', 
        height: '65px', 
        backgroundColor: '#E0F2FE', 
        borderRadius: '50%', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        fontSize: '32px',
        flexShrink: 0
      }}>
        {icon}
      </div>
      <div style={{ textAlign: 'left' }}>
        <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#64748B', textTransform: 'uppercase' }}>{label}</div>
        <div style={{ fontSize: '30px', fontWeight: '800', color: '#1E293B' }}>{text}</div>
      </div>
    </div>
  );

  return (
    <div 
      ref={ref}
      style={{ 
        width: '1080px', 
        height: '1920px', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center',
        justifyContent: 'flex-start',
        backgroundColor: '#FFFFFF', 
        position: 'relative',
        color: '#1a234e',
        fontFamily: 'Inter, sans-serif',
        textAlign: 'center',
        overflow: 'hidden'
      }}
    >
      {/* Top Logo */}
      <div style={{ padding: '60px 0 40px 0', zIndex: 10 }}>
        <img 
          src="https://res.cloudinary.com/dapsovbs5/image/upload/v1774648783/logo_kb9nkn.png" 
          alt="Grupo CTE" 
          style={{ height: '110px', width: 'auto' }}
        />
      </div>

      {/* Header Bar */}
      <div style={{ 
        width: '100%', 
        backgroundColor: '#EA580C', 
        padding: '30px 0', 
        zIndex: 10,
        marginBottom: '40px',
        flexShrink: 0
      }}>
        <div style={{ 
          fontSize: '70px', 
          fontWeight: '900', 
          letterSpacing: '0.05em', 
          textTransform: 'uppercase',
          color: 'white',
          whiteSpace: 'nowrap'
        }}>
          VAGA DE ESTÁGIO
        </div>
      </div>

      {/* Container para o conteúdo central com flex: 1 para empurrar o rodapé */}
      <div style={{ 
        flex: '1', 
        width: '100%', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'flex-start',
        overflow: 'hidden'
      }}>
        {/* Group 1: Título da vaga e Logo (Horizontal) */}
        <div style={{ padding: '0 60px', marginBottom: '30px', width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: '40px' }}>
          {partner?.logo_url && (
            <div style={{ 
              width: '180px', 
              height: '180px', 
              minWidth: '180px',
              backgroundColor: 'transparent', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              overflow: 'hidden'
            }}>
              <img src={partner.logo_url} alt={partner.nome} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            </div>
          )}
          <div style={{ textAlign: 'left', flex: 1 }}>
            <h1 style={{ 
              fontSize: '52px', 
              fontWeight: '900', 
              color: '#1a234e', 
              lineHeight: '1.1',
              textTransform: 'uppercase'
            }}>
              {vacancy.titulo}
            </h1>
          </div>
        </div>

        {/* Group 2: Requisitos (lista de requisitos) */}
        <div style={{ width: '100%', padding: '0 100px', textAlign: 'left', marginBottom: '30px' }}>
          <div style={{ 
            fontSize: '32px', 
            fontWeight: '900', 
            textTransform: 'uppercase', 
            color: '#EA580C', 
            marginBottom: '15px',
            borderLeft: '12px solid #EA580C',
            paddingLeft: '25px'
          }}>
            REQUISITOS:
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', paddingLeft: '20px' }}>
            {vacancy.requisitos ? (
              vacancy.requisitos.split('\n').filter((l: string) => l.trim()).slice(0, 5).map((req: string, i: number) => (
                <div key={i} style={{ display: 'flex', fontSize: '28px', fontWeight: '700', color: '#1E293B', lineHeight: '1.2' }}>
                  <span style={{ marginRight: '15px', color: '#EA580C' }}>•</span>
                  <span>{req}</span>
                </div>
              ))
            ) : (
              <div style={{ fontSize: '26px', fontWeight: '700', color: '#1E293B' }}>Consulte os detalhes no site.</div>
            )}
          </div>
        </div>

        {/* Group 3: Detalhes (Área, Local, Valor) */}
        <div style={{ width: '100%', padding: '0 100px', textAlign: 'left', marginBottom: '30px' }}>
          <div style={{ 
            fontSize: '32px', 
            fontWeight: '900', 
            textTransform: 'uppercase', 
            color: '#EA580C', 
            marginBottom: '15px',
            borderLeft: '12px solid #EA580C',
            paddingLeft: '25px'
          }}>
            DETALHES:
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '5px' }}>
            <InfoItem icon="💼" label="Área" text={vacancy.area || vacancy['àrea'] || 'Não informada'} />
            <InfoItem icon="📍" label="Local" text={vacancy.local || 'Não informado'} />
            <InfoItem icon="💰" label="Bolsa + Transporte" text={vacancy.valor_bolsa || 'A combinar'} />
          </div>
        </div>

        {/* Group 4: Data das Inscrições / Prazo de candidatura */}
        {vacancy.prazo_candidatura && (
          <div style={{ 
            width: '85%', 
            backgroundColor: '#FFF7ED', 
            borderRadius: '40px', 
            padding: '20px 40px', 
            border: '4px dashed #EA580C',
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            margin: '0 auto 10px auto'
          }}>
            <div style={{ fontSize: '40px' }}>⏰</div>
            <div style={{ 
              fontSize: '28px', 
              fontWeight: '600', 
              color: '#EA580C', 
              textTransform: 'uppercase' 
            }}>
              Inscrições até: <span style={{ fontSize: '36px', fontWeight: '900' }}>{formatDate(vacancy.prazo_candidatura)}</span>
            </div>
          </div>
        )}
      </div>

      {/* Novo Rodapé (Footer da Imagem) */}
      <div style={{ 
        width: '100%', 
        backgroundColor: '#EA580C', 
        padding: '50px 40px', 
        color: 'white',
        textAlign: 'center',
        flexShrink: 0,
        zIndex: 10
      }}>
        <div style={{ fontSize: '38px', fontWeight: '900', lineHeight: '1.4' }}>
          Interessados enviar o currículo para o e-mail: <br/>
          <span style={{ fontSize: '48px', textDecoration: 'underline' }}>vagas@grupocte.com.br</span>
        </div>
      </div>
    </div>
  );
});
