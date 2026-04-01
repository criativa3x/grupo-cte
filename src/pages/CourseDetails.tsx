import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { 
  Clock, 
  ChevronRight, 
  CheckCircle2, 
  MessageCircle, 
  ArrowLeft, 
  Loader2, 
  AlertCircle,
  Facebook,
  Instagram,
  Linkedin,
  MapPin,
  Mail,
  Phone,
  Briefcase,
  ChevronDown
} from 'lucide-react';
import { motion } from 'motion/react';

const FAQ = () => {
  const faqs = [
    {
      question: "Os certificados são reconhecidos?",
      answer: "Sim, nossos certificados são válidos em todo o território nacional e enriquecem seu currículo."
    },
    {
      question: "Como funciona o encaminhamento para estágios?",
      answer: "Temos parcerias com diversas empresas da região. Nossos alunos de destaque são recomendados diretamente para vagas compatíveis com o curso."
    },
    {
      question: "Preciso ter conhecimento prévio?",
      answer: "Não! Nossos cursos são desenhados para você aprender do zero ao nível profissional."
    }
  ];

  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-20 bg-white border-t border-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black text-blue-950 mb-4">Dúvidas Frequentes</h2>
          <p className="text-gray-500 font-medium">Tudo o que você precisa saber para começar sua jornada.</p>
        </div>
        
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="border border-gray-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <button 
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-6 text-left bg-white hover:bg-gray-50 transition-colors"
              >
                <span className="text-lg font-bold text-blue-950">{faq.question}</span>
                <ChevronDown 
                  className={`text-orange-600 transition-transform duration-300 ${openIndex === index ? 'rotate-180' : ''}`} 
                  size={24} 
                />
              </button>
              <motion.div
                initial={false}
                animate={{ height: openIndex === index ? 'auto' : 0, opacity: openIndex === index ? 1 : 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="p-6 pt-0 text-gray-600 font-medium leading-relaxed border-t border-gray-50">
                  {faq.answer}
                </div>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default function CourseDetails() {
  const { slug } = useParams<{ slug: string }>();
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (slug) {
      fetchCourse();
    }
  }, [slug]);

  const fetchCourse = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('cursos')
        .select('*, categorias(titulo)')
        .eq('slug', slug)
        .eq('ativo', true)
        .single();

      if (error || !data) {
        setError(true);
      } else {
        setCourse(data);
      }
    } catch (err) {
      console.error('Error fetching course:', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsApp = () => {
    const message = encodeURIComponent(`Olá, tenho interesse no curso ${course.titulo}`);
    window.open(`https://wa.me/5500000000000?text=${message}`, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <Loader2 className="h-12 w-12 text-orange-600 animate-spin" />
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8FAFC] px-4">
        <div className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-gray-100 text-center max-w-md w-full">
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="text-red-500" size={40} />
          </div>
          <h2 className="text-2xl font-black text-blue-950 mb-4">Curso não encontrado</h2>
          <p className="text-gray-500 font-medium mb-8">
            Desculpe, o curso que você está procurando não existe ou foi desativado.
          </p>
          <Link 
            to="/" 
            className="inline-flex items-center space-x-2 bg-orange-600 hover:bg-orange-700 text-white px-8 py-4 rounded-2xl font-black shadow-lg shadow-orange-600/20 transition-all hover:scale-105 active:scale-95 w-full justify-center"
          >
            <ArrowLeft size={20} />
            <span>Voltar para Home</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans">
      {/* Header (Simplified Navbar) */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link to="/">
              <img 
                src="https://res.cloudinary.com/dapsovbs5/image/upload/v1774648783/logo_kb9nkn.png" 
                alt="Grupo CTE Logo" 
                className="h-10 w-auto"
                referrerPolicy="no-referrer"
              />
            </Link>
            <Link to="/" className="text-blue-950 font-bold hover:text-orange-600 transition-colors flex items-center space-x-1">
              <ArrowLeft size={18} />
              <span>Voltar</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-blue-950 text-white py-16 md:py-24 relative overflow-hidden">
        {/* Background Accents */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-orange-600/10 to-transparent pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl"
          >
            <div className="flex items-center space-x-2 text-orange-500 font-bold uppercase tracking-widest text-xs mb-4">
              <span>{course.categorias?.titulo || 'Curso'}</span>
              <ChevronRight size={14} />
              <span>Detalhes</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight">
              {course.titulo}
            </h1>
            <p className="text-lg md:text-xl text-gray-300 font-medium mb-8 leading-relaxed">
              {course.descricao_curta}
            </p>
            
            <div className="inline-flex items-center space-x-3 bg-white/10 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/10">
              <Clock className="text-orange-500" size={24} />
              <div>
                <p className="text-[10px] uppercase font-black tracking-widest text-gray-400">Carga Horária</p>
                <p className="text-lg font-bold">{course.carga_horaria}</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Left Column: Details */}
          <div className="lg:col-span-2 space-y-12">
            {/* Course Image */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="rounded-[2.5rem] overflow-hidden shadow-2xl border-8 border-white"
            >
              <img 
                src={course.imagem_url} 
                alt={course.titulo}
                className="w-full h-auto object-cover aspect-video"
                referrerPolicy="no-referrer"
              />
            </motion.div>

            {/* About Section */}
            <section className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-sm border border-gray-100">
              <h2 className="text-3xl font-black text-blue-950 mb-6 flex items-center space-x-3">
                <span className="w-2 h-8 bg-orange-600 rounded-full" />
                <span>Sobre o Curso</span>
              </h2>
              <div className="prose prose-lg max-w-none text-gray-600 font-medium leading-relaxed whitespace-pre-wrap">
                {course.descricao_completa}
              </div>
            </section>

            {/* Mercado de Trabalho Section */}
            {course.mercado_trabalho && (
              <section className="bg-blue-50 p-8 md:p-12 rounded-[2.5rem] shadow-sm border border-blue-100 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-blue-600/10 transition-colors" />
                <h2 className="text-3xl font-black text-blue-950 mb-6 flex items-center space-x-4">
                  <div className="bg-blue-600 text-white p-2 rounded-xl shadow-lg shadow-blue-600/20">
                    <Briefcase size={24} />
                  </div>
                  <span>Mercado de Trabalho</span>
                </h2>
                <div className="prose prose-lg max-w-none text-gray-700 font-medium leading-relaxed whitespace-pre-wrap relative z-10">
                  {course.mercado_trabalho}
                </div>
              </section>
            )}

            {/* Topics Section */}
            <section className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-sm border border-gray-100">
              <h2 className="text-3xl font-black text-blue-950 mb-8 flex items-center space-x-3">
                <span className="w-2 h-8 bg-orange-600 rounded-full" />
                <span>O que você vai aprender</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {course.topicos && Array.isArray(course.topicos) && course.topicos.map((topico: string, index: number) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start space-x-4 p-5 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md hover:border-orange-200 transition-all group"
                  >
                    <div className="mt-1 bg-green-500 text-white p-1 rounded-full shadow-lg shadow-green-500/20 group-hover:scale-110 transition-transform">
                      <CheckCircle2 size={16} />
                    </div>
                    <span className="text-gray-800 font-bold leading-tight">{topico}</span>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* Course Structure Section */}
            {course.instrumentos_aprendizagem && Array.isArray(course.instrumentos_aprendizagem) && course.instrumentos_aprendizagem.length > 0 && (
              <section className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-sm border border-gray-100">
                <h2 className="text-3xl font-black text-blue-950 mb-8 flex items-center space-x-3">
                  <span className="w-2 h-8 bg-orange-600 rounded-full" />
                  <span>Estrutura do Curso</span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {course.instrumentos_aprendizagem.map((item: string, index: number) => (
                    <motion.div 
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center space-x-4 p-4 rounded-2xl bg-gray-50 border border-gray-100 hover:bg-white hover:shadow-md transition-all group"
                    >
                      <div className="bg-green-100 text-green-600 p-1 rounded-lg group-hover:bg-green-600 group-hover:text-white transition-colors">
                        <CheckCircle2 size={18} />
                      </div>
                      <span className="text-gray-700 font-bold leading-tight">{item}</span>
                    </motion.div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Right Column: Sticky Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-32 space-y-6">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white p-8 rounded-[2.5rem] shadow-2xl border border-gray-100 text-center"
              >
                <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <MessageCircle className="text-orange-600" size={40} />
                </div>
                <h3 className="text-2xl font-black text-blue-950 mb-2">Ficou com dúvida?</h3>
                <p className="text-gray-500 font-medium mb-8">
                  Nossos consultores estão prontos para te ajudar a escolher o melhor caminho.
                </p>
                
                <button 
                  onClick={handleWhatsApp}
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white px-8 py-5 rounded-2xl font-black shadow-lg shadow-orange-600/20 transition-all flex items-center justify-center space-x-3 hover:scale-105 active:scale-95"
                >
                  <MessageCircle size={24} />
                  <span>Tenho Interesse</span>
                </button>
                
                <p className="mt-6 text-xs text-gray-400 font-bold uppercase tracking-widest">
                  Atendimento Imediato via WhatsApp
                </p>
              </motion.div>

              {/* Info Card */}
              <div className="bg-blue-950 p-8 rounded-[2.5rem] text-white overflow-hidden relative">
                <div className="absolute top-0 right-0 w-24 h-24 bg-orange-600/20 rounded-full -mr-12 -mt-12 blur-2xl" />
                <h4 className="text-lg font-black mb-4 relative z-10">Por que o Grupo CTE?</h4>
                <ul className="space-y-4 relative z-10">
                  {[
                    'Certificado Reconhecido',
                    'Professores Atuantes',
                    'Foco no Mercado',
                    'Encaminhamento para Estágio'
                  ].map((item, i) => (
                    <li key={i} className="flex items-center space-x-3 text-sm font-medium text-gray-300">
                      <div className="w-1.5 h-1.5 bg-orange-500 rounded-full" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* FAQ Section */}
      <FAQ />

      {/* Footer (Simplified) */}
      <footer className="bg-blue-950 text-white pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1 md:col-span-2">
              <img 
                src="https://res.cloudinary.com/dapsovbs5/image/upload/v1774648783/logo_kb9nkn.png" 
                alt="Grupo CTE Logo" 
                className="h-12 w-auto mb-8 brightness-0 invert"
                referrerPolicy="no-referrer"
              />
              <p className="text-gray-400 text-lg leading-relaxed max-w-md">
                Transformando vidas através da educação e do encaminhamento profissional. O seu futuro começa aqui.
              </p>
            </div>
            
            <div>
              <h4 className="text-xl font-black mb-8">Contato</h4>
              <ul className="space-y-4">
                <li className="flex items-center space-x-3 text-gray-400">
                  <Phone size={18} className="text-orange-600" />
                  <span>(00) 0000-0000</span>
                </li>
                <li className="flex items-center space-x-3 text-gray-400">
                  <Mail size={18} className="text-orange-600" />
                  <span>contato@grupocte.com.br</span>
                </li>
                <li className="flex items-center space-x-3 text-gray-400">
                  <MapPin size={18} className="text-orange-600" />
                  <span>Endereço da Unidade, Cidade - UF</span>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-xl font-black mb-8">Siga-nos</h4>
              <div className="flex space-x-4">
                <a href="#" className="bg-white/5 hover:bg-orange-600 p-3 rounded-xl transition-all">
                  <Facebook size={20} />
                </a>
                <a href="#" className="bg-white/5 hover:bg-orange-600 p-3 rounded-xl transition-all">
                  <Instagram size={20} />
                </a>
                <a href="#" className="bg-white/5 hover:bg-orange-600 p-3 rounded-xl transition-all">
                  <Linkedin size={20} />
                </a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-white/10 pt-8 text-center text-gray-500 text-sm font-medium">
            <p>&copy; {new Date().getFullYear()} Grupo CTE. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
