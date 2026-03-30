import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Menu, X, ChevronRight, Quote, Facebook, Instagram, Linkedin, MapPin, Mail, Phone, Briefcase, Loader2, GraduationCap, Clock, Star, CheckCircle2, Users, Award, ArrowRight, Play, ExternalLink, DollarSign, Headset, Calculator, UtensilsCrossed } from 'lucide-react';
import { getAreaIcon } from '../lib/icons';
import { motion, AnimatePresence } from 'motion/react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState({
    banners: [] as any[],
    cursos: [] as any[],
    vagas: [] as any[],
    alunos_contratados: [] as any[],
    categorias: [] as any[],
  });

  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);

  const mockAlunos = [
    {
      nome: "Ana Oliveira",
      idade: "19 anos",
      empresa: "Banco Itaú",
      foto: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop"
    },
    {
      nome: "Ricardo Santos",
      idade: "21 anos",
      empresa: "Dell Technologies",
      foto: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=800&auto=format&fit=crop"
    },
    {
      nome: "Juliana Mendes",
      idade: "20 anos",
      empresa: "Hospital Aliança",
      foto: "https://images.unsplash.com/photo-1559839734-2b71f1536783?q=80&w=800&auto=format&fit=crop"
    },
    {
      nome: "Felipe Almeida",
      idade: "22 anos",
      empresa: "Accenture",
      foto: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop"
    }
  ];

  useEffect(() => {
    fetchContent();
  }, []);

  useEffect(() => {
    if (content.banners.length > 1) {
      const timer = setInterval(() => {
        setCurrentBannerIndex((prev) => (prev + 1) % content.banners.length);
      }, 6000);
      return () => clearInterval(timer);
    }
  }, [content.banners.length]);

  const fetchContent = async () => {
    try {
      // Forçamos a busca em tempo real desativando o cache no cliente Supabase
      const [bannersRes, cursosRes, vagasRes, alunosRes, categoriasRes] = await Promise.all([
        supabase.from('banners_home').select('*').order('created_at', { ascending: false }),
        supabase.from('cursos').select('*').order('created_at', { ascending: false }),
        supabase.from('vagas_estagio').select('*').order('created_at', { ascending: false }),
        supabase.from('alunos_contratados').select('*').order('created_at', { ascending: false }),
        supabase.from('categorias').select('*').order('ordem', { ascending: true }),
      ]);

      setContent({
        banners: bannersRes.data || [],
        cursos: cursosRes.data || [],
        vagas: vagasRes.data || [],
        alunos_contratados: alunosRes.data || [],
        categorias: categoriasRes.data || [],
      });
    } catch (error) {
      console.error('Error fetching content:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fallback banners if none exists in DB
  const displayBanners = content.banners.length > 0 ? content.banners : [
    {
      id: 'default-1',
      titulo: 'O seu futuro começa aqui.',
      subtitulo: 'Capacitação e Estágio num só lugar.',
      imagem_url: 'https://picsum.photos/seed/learning-group/1920/1080',
      texto_botao: 'Ver Cursos',
      link_botao: '#cursos'
    },
    {
      id: 'default-2',
      titulo: 'Transforme sua carreira hoje.',
      subtitulo: 'Cursos práticos com foco no mercado de trabalho.',
      imagem_url: 'https://picsum.photos/seed/career-growth/1920/1080',
      texto_botao: 'Conhecer Cursos',
      link_botao: '#cursos'
    }
  ];

  const activeBanner = displayBanners[currentBannerIndex];

  return (
    <div className="min-h-screen font-sans text-gray-800">
      {/* 1. Header */}
      <header className="sticky top-0 z-50 bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <img 
                src="https://res.cloudinary.com/dapsovbs5/image/upload/v1774648783/logo_kb9nkn.png" 
                alt="Grupo CTE Logo" 
                className="h-12 w-auto"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              <a href="#inicio" className="text-gray-700 hover:text-orange-600 font-semibold transition-colors">Início</a>
              <a href="#cursos" className="text-gray-700 hover:text-orange-600 font-semibold transition-colors">Cursos</a>
              <a href="#estagios" className="text-gray-700 hover:text-orange-600 font-semibold transition-colors">Estágios</a>
              <a href="#quem-somos" className="text-gray-700 hover:text-orange-600 font-semibold transition-colors">Quem Somos</a>
            </nav>

            {/* CTA Button - High Prominence */}
            <div className="hidden md:flex items-center">
              <a href="#contato" className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 rounded-full font-bold transition-all shadow-[0_4px_20px_rgba(234,88,12,0.4)] hover:scale-105 active:scale-95">
                Fale com um Consultor
              </a>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-600 hover:text-orange-600 focus:outline-none"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <a href="#inicio" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-md">Início</a>
              <a href="#cursos" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-md">Cursos</a>
              <a href="#estagios" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-md">Estágios</a>
              <a href="#quem-somos" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-md">Quem Somos</a>
              <a href="#contato" className="block w-full text-center mt-4 bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-full font-medium transition-colors">
                Fale com um Consultor
              </a>
            </div>
          </div>
        )}
      </header>

      {/* 2. Hero Section - Rich Banner Slider */}
      <section id="inicio" className="relative min-h-[85vh] flex items-center overflow-hidden bg-blue-950">
        {/* Background Images Stack - Perfect Crossfade */}
        <div className="absolute inset-0">
          {displayBanners.map((banner, index) => (
            <div 
              key={banner.id || index}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                currentBannerIndex === index ? "opacity-100" : "opacity-0"
              }`}
            >
              <img
                src={banner.imagem_url}
                alt={banner.titulo}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          ))}
        </div>

        {/* Fixed Overlay - Always on top of images, below text */}
        <div className="absolute inset-0 z-10">
          {/* Organic Blend Overlay: Navy Blue and Orange hints */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-950/95 via-blue-950/70 to-orange-600/20"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(234,88,12,0.15),transparent_50%)]"></div>
        </div>
        
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-3xl">
            {/* Initial Load Animation Wrapper (No key, so it only runs once) */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
              }}
            >
              {/* Badge - Only animates on initial load */}
              <motion.div 
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
                }}
                className="inline-block px-4 py-1.5 bg-orange-600/90 text-white text-sm font-bold rounded-full mb-6 backdrop-blur-sm"
              >
                DESDE 1994 TRANSFORMANDO VIDAS
              </motion.div>
              
              {/* Keyed Content - Animates on every slide change with a 0.5s delay */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentBannerIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.8, ease: "easeOut", delay: 0.5 }}
                >
                  <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.1] mb-8">
                    {activeBanner.titulo}
                  </h1>
                  
                  <p className="text-xl sm:text-2xl text-gray-200 mb-12 max-w-2xl leading-relaxed font-medium">
                    {activeBanner.subtitulo}
                  </p>
                </motion.div>
              </AnimatePresence>
              
              {/* Buttons - Only animate on initial load, then stay fixed */}
              <motion.div 
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
                }}
                className="flex flex-col sm:flex-row gap-6"
              >
                <a href={activeBanner.link_botao} className="inline-flex justify-center items-center bg-orange-600 hover:bg-orange-700 text-white px-10 py-5 rounded-full font-black text-xl transition-all shadow-[0_10px_30px_rgba(234,88,12,0.5)] hover:-translate-y-1">
                  {activeBanner.texto_botao}
                </a>
                <a href="#estagios" className="inline-flex justify-center items-center bg-white/10 hover:bg-white/20 backdrop-blur-md border-2 border-white/30 text-white px-10 py-5 rounded-full font-black text-xl transition-all hover:-translate-y-1">
                  Vagas de Estágio
                </a>
              </motion.div>
              
              {/* Stats - Only animate on initial load */}
              <motion.div 
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.8, delay: 0.8 } }
                }}
                className="mt-12 flex items-center gap-4 text-white/80"
              >
                <div className="flex -space-x-3">
                  {[
                    "https://res.cloudinary.com/dapsovbs5/image/upload/v1774869604/4_zzbcvt.png",
                    "https://res.cloudinary.com/dapsovbs5/image/upload/v1774869604/3_kdgocd.png",
                    "https://res.cloudinary.com/dapsovbs5/image/upload/v1774869604/2_vynefl.png",
                    "https://res.cloudinary.com/dapsovbs5/image/upload/v1774869604/1_oxjzqh.png"
                  ].map((url, i) => (
                    <img 
                      key={i}
                      src={url} 
                      className="w-10 h-10 rounded-full border-2 border-blue-950 object-cover" 
                      alt="Aluno"
                      referrerPolicy="no-referrer"
                    />
                  ))}
                </div>
                <p className="text-sm font-semibold">
                  <span className="text-orange-500">+15.000</span> alunos já encaminhados
                </p>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Slider Controls - Dots */}
        {displayBanners.length > 1 && (
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex space-x-3 z-20">
            {displayBanners.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentBannerIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  currentBannerIndex === index 
                    ? "bg-orange-600 w-10 shadow-[0_0_15px_rgba(234,88,12,0.8)]" 
                    : "bg-white/40 hover:bg-white/60"
                }`}
                aria-label={`Ir para slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </section>

      {/* 3. Vagas de Estágio Humanizadas - Vitrine */}
      <section id="estagios" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">As melhores oportunidades de Estágio</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-medium">Conectamos jovens talentos às empresas que buscam renovação e energia.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {content.vagas.length > 0 ? (
              content.vagas.slice(0, 3).map((vaga) => (
                <div key={vaga.id} className="bg-white rounded-3xl shadow-md hover:shadow-lg transition-all duration-500 overflow-hidden border border-gray-50 group flex flex-col h-full">
                  <div className="p-8 flex flex-col items-center flex-1">
                    {/* Top: Ícone circular centralizado */}
                    <div className="relative mb-6">
                      <div className="w-24 h-24 rounded-full bg-[#1a233e] flex items-center justify-center shadow-md group-hover:scale-105 transition-transform border-4 border-white">
                        {getAreaIcon(vaga.area || vaga['àrea'])}
                      </div>
                    </div>

                    {/* Tag Condicional (Badge) */}
                    <div className="inline-block px-6 py-2 bg-green-100 text-green-800 text-sm font-bold rounded-full mb-6 uppercase tracking-wide">
                      VAGA DE ESTÁGIO
                    </div>

                    {/* Título */}
                    <h3 className="text-3xl font-bold text-gray-900 mb-4 text-center leading-tight">{vaga.titulo}</h3>

                    {/* Resumo da Vaga */}
                    {vaga.resumo && (
                      <p className="text-gray-700 text-center mb-8 font-medium line-clamp-3 text-base">
                        {vaga.resumo}
                      </p>
                    )}

                    {/* Sessão de Requisitos: Alinhado à esquerda */}
                    <div className="w-full text-left mb-8">
                      <h4 className="text-lg font-bold text-gray-900 mb-2 uppercase">REQUISITOS:</h4>
                      <ul className="space-y-1 text-gray-700 text-base">
                        {vaga.requisitos ? (
                          vaga.requisitos.split('\n').filter(line => line.trim()).map((req, i) => (
                            <li key={i} className="flex items-start">
                              <span className="mr-2">•</span>
                              <span>{req}</span>
                            </li>
                          ))
                        ) : (
                          <>
                            <li className="flex items-start">
                              <span className="mr-2">•</span>
                              <span>Sexo: {vaga.sexo || 'Masculino'}</span>
                            </li>
                            <li className="flex items-start">
                              <span className="mr-2">•</span>
                              <span>Idade: {vaga.idade || 'A partir de 14 anos'}</span>
                            </li>
                            <li className="flex items-start">
                              <span className="mr-2">•</span>
                              <span>Horário: {vaga.horario || 'Manhã ou tarde'}</span>
                            </li>
                          </>
                        )}
                      </ul>
                    </div>

                    {/* Destaques Inferiores (Bolsa e Local): Alinhados à esquerda */}
                    <div className="w-full space-y-4 mb-10">
                      <div className="flex items-center gap-3 text-gray-800 text-base">
                        <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center shrink-0 shadow-sm">
                          <DollarSign className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <span className="font-bold mr-1">Bolsa auxílio:</span>
                          <span>{vaga.valor_bolsa}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 text-gray-800 text-base">
                        <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center shrink-0 shadow-sm">
                          <MapPin className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <span className="font-bold mr-1">Local:</span>
                          <span>{vaga.local}</span>
                        </div>
                      </div>
                    </div>

                    {/* Botão */}
                    <a 
                      href={vaga.link_candidatura} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-full bg-[#1a234e] hover:bg-[#2a336e] text-white text-center font-bold py-4 rounded-xl transition-all shadow-md active:scale-95 mt-auto"
                    >
                      Candidatar-se
                    </a>
                  </div>
                </div>
              ))
            ) : (
              // Fallback cards if no vacancies in DB
              [1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-3xl shadow-md overflow-hidden border border-gray-50 animate-pulse flex flex-col h-full">
                  <div className="p-8 flex flex-col items-center flex-1">
                    <div className="w-24 h-24 rounded-full bg-[#1a233e]/10 flex items-center justify-center mb-6">
                      <div className="w-10 h-10 bg-[#1a233e]/20 rounded"></div>
                    </div>
                    <div className="h-8 w-48 bg-gray-200 rounded-full mb-6"></div>
                    <div className="h-10 w-64 bg-gray-200 rounded mb-8"></div>
                    <div className="w-full space-y-4 mb-8">
                      <div className="h-6 w-32 bg-gray-200 rounded"></div>
                      <div className="h-4 w-full bg-gray-200 rounded"></div>
                      <div className="h-4 w-full bg-gray-200 rounded"></div>
                      <div className="h-4 w-full bg-gray-200 rounded"></div>
                    </div>
                    <div className="w-full space-y-4 mb-10">
                      <div className="h-8 w-full bg-gray-100 rounded"></div>
                      <div className="h-8 w-full bg-gray-100 rounded"></div>
                    </div>
                    <div className="h-14 w-full bg-gray-200 rounded-xl mt-auto"></div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* CTA Button - Ver Todas */}
          <div className="mt-16 text-center">
            <Link 
              to="/vagas" 
              className="inline-flex items-center px-10 py-4 border-2 border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white font-black text-lg rounded-full transition-all duration-300 group"
            >
              Ver todas as vagas
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* 4. Áreas de Atuação com Imagens Ricas */}
      <section id="cursos" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">Escolha a sua área de atuação</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-medium">Cursos práticos com foco no que o mercado realmente exige.</p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-8">
            {content.categorias.length > 0 ? (
              content.categorias.map((cat, i) => (
                <div key={cat.id || i} className="group relative bg-gray-900 rounded-2xl overflow-hidden aspect-[4/5] shadow-xl transition-all hover:-translate-y-2">
                  <img 
                    src={cat.imagem_url || `https://picsum.photos/seed/category-${i}/600/800`} 
                    alt={cat.titulo} 
                    className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8">
                    <h3 className="text-base md:text-lg xl:text-xl font-black text-white mb-2 md:mb-4 leading-tight">{cat.titulo}</h3>
                    <a href="#cursos" className="inline-flex items-center text-orange-500 font-bold text-sm md:text-base group-hover:text-orange-400 transition-colors">
                      Ver cursos <ChevronRight className="ml-1 h-4 w-4 md:h-5 md:w-5" />
                    </a>
                  </div>
                </div>
              ))
            ) : (
              [
                'Informática e Tecnologia',
                'Administração e Negócios',
                'Saúde e Bem-Estar',
                'Marketing e Design',
                'Atendimento e Vendas',
                'Idiomas'
              ].map((cat, i) => (
                <div key={i} className="group relative bg-gray-900 rounded-2xl overflow-hidden aspect-[4/5] shadow-xl transition-all hover:-translate-y-2">
                  <img 
                    src={`https://picsum.photos/seed/category-${i}/600/800`} 
                    alt={cat} 
                    className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8">
                    <h3 className="text-base md:text-lg xl:text-xl font-black text-white mb-2 md:mb-4 leading-tight">{cat}</h3>
                    <a href="#cursos" className="inline-flex items-center text-orange-500 font-bold text-sm md:text-base group-hover:text-orange-400 transition-colors">
                      Ver cursos <ChevronRight className="ml-1 h-4 w-4 md:h-5 md:w-5" />
                    </a>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* 5. Casos de Sucesso - Humanizados e Estilizados */}
      <section className="py-28 bg-orange-600 relative overflow-hidden">
        {/* Stylized Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20px_20px,white_2px,transparent_0)] bg-[length:40px_40px]"></div>
        </div>
        <div className="absolute -right-20 -top-20 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute -left-20 -bottom-20 w-96 h-96 bg-blue-950/20 rounded-full blur-3xl"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-black text-white mb-6">Quem faz, aprova e recomenda.</h2>
            <p className="text-orange-100 text-xl max-w-3xl mx-auto font-medium">Histórias reais de quem transformou o sonho em carreira.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Testimonial 1 */}
            <div className="bg-white rounded-[2.5rem] p-10 shadow-2xl relative group hover:-translate-y-2 transition-transform">
              <div className="absolute -top-12 left-1/2 -translate-x-1/2">
                <img 
                  src="https://picsum.photos/seed/student-success-1/300/300" 
                  alt="Lucas Silva" 
                  className="w-24 h-24 rounded-full border-4 border-orange-600 object-cover shadow-xl group-hover:scale-110 transition-transform"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="pt-12 text-center">
                <Quote className="h-10 w-10 text-orange-200 mx-auto mb-6" />
                <p className="text-gray-700 italic mb-8 text-xl leading-relaxed font-medium">
                  "O CTE mudou minha visão de futuro. Comecei como aluno de Informática e hoje sou estagiário em uma grande empresa de tecnologia."
                </p>
                <h4 className="font-black text-2xl text-gray-900">Lucas Silva</h4>
                <p className="text-orange-600 font-bold">Aluno de Informática</p>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-white rounded-[2.5rem] p-10 shadow-2xl relative group hover:-translate-y-2 transition-transform">
              <div className="absolute -top-12 left-1/2 -translate-x-1/2">
                <img 
                  src="https://picsum.photos/seed/student-success-2/300/300" 
                  alt="Mariana Costa" 
                  className="w-24 h-24 rounded-full border-4 border-orange-600 object-cover shadow-xl group-hover:scale-110 transition-transform"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="pt-12 text-center">
                <Quote className="h-10 w-10 text-orange-200 mx-auto mb-6" />
                <p className="text-gray-700 italic mb-8 text-xl leading-relaxed font-medium">
                  "A equipe do CTE é maravilhosa. O suporte que recebi para montar meu currículo e me preparar para as entrevistas foi o diferencial."
                </p>
                <h4 className="font-black text-2xl text-gray-900">Mariana Costa</h4>
                <p className="text-orange-600 font-bold">Aluna de Saúde</p>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-white rounded-[2.5rem] p-10 shadow-2xl relative group hover:-translate-y-2 transition-transform">
              <div className="absolute -top-12 left-1/2 -translate-x-1/2">
                <img 
                  src="https://picsum.photos/seed/student-success-3/300/300" 
                  alt="Pedro Santos" 
                  className="w-24 h-24 rounded-full border-4 border-orange-600 object-cover shadow-xl group-hover:scale-110 transition-transform"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="pt-12 text-center">
                <Quote className="h-10 w-10 text-orange-200 mx-auto mb-6" />
                <p className="text-gray-700 italic mb-8 text-xl leading-relaxed font-medium">
                  "Não é apenas um curso, é uma ponte para o mercado. O Grupo CTE realmente se preocupa com o nosso encaminhamento profissional."
                </p>
                <h4 className="font-black text-2xl text-gray-900">Pedro Santos</h4>
                <p className="text-orange-600 font-bold">Aluno de Administração</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Mural de Sucesso - Alunos Contratados */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">Mural de Sucesso</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-medium">
              Nossos alunos já estão no mercado de trabalho. O próximo pode ser você!
            </p>
          </div>

          <div className="relative">
            <Swiper
              modules={[Autoplay, Pagination]}
              spaceBetween={30}
              slidesPerView={1}
              autoplay={{
                delay: 3000,
                disableOnInteraction: false,
              }}
              pagination={{ clickable: true }}
              breakpoints={{
                640: {
                  slidesPerView: 2,
                },
                1024: {
                  slidesPerView: 4,
                },
              }}
              className="pb-16"
            >
              {(content.alunos_contratados.length > 0 ? content.alunos_contratados : mockAlunos).map((aluno, index) => (
                <SwiperSlide key={index}>
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="group relative bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all h-full"
                  >
                    {/* Image Container */}
                    <div className="aspect-[4/5] relative overflow-hidden">
                      <img 
                        src={aluno.imagem_url || aluno.foto || aluno.foto_url} 
                        alt={aluno.nome} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        referrerPolicy="no-referrer"
                      />
                      
                      {/* Floating Badge */}
                      <div className="absolute top-4 left-4 z-10">
                        <span className="bg-orange-600 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-lg">
                          CONTRATADO(A)
                        </span>
                      </div>

                      {/* Gradient Overlay for Info */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity"></div>
                      
                      {/* Info Overlay */}
                      <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                        <h4 className="text-xl font-black mb-1">{aluno.nome}</h4>
                        <p className="text-white/70 text-xs font-bold mb-2 uppercase tracking-wide">{aluno.idade || aluno.curso}</p>
                        <div className="flex items-center text-orange-500 font-black text-sm">
                          <Briefcase className="h-4 w-4 mr-2" />
                          {aluno.empresa}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </SwiperSlide>
              ))}
            </Swiper>

            {/* CTA Button - Mural de Sucesso */}
            <div className="flex justify-center mt-12 mb-8">
              <motion.a 
                href="#cursos"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-orange-600 hover:bg-orange-700 text-white font-black text-xl px-12 py-5 rounded-full shadow-[0_10px_30px_rgba(234,88,12,0.4)] transition-all hover:-translate-y-1 flex items-center group"
              >
                Quero ser o próximo!
                <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-2 transition-transform" />
              </motion.a>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Footer */}
      <footer className="bg-blue-950 text-gray-300 pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 mb-16">
            {/* Column 1 */}
            <div>
              <span className="text-3xl font-black text-white mb-8 block tracking-tighter">Grupo CTE</span>
              <p className="text-gray-400 mb-8 text-lg leading-relaxed font-medium">
                Sua porta de entrada para o mercado de trabalho. Capacitação de excelência e oportunidades reais de estágio desde 1994.
              </p>
              <div className="flex space-x-5">
                <a href="#" className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center hover:bg-orange-600 hover:text-white transition-all hover:-translate-y-1">
                  <Facebook className="h-6 w-6" />
                </a>
                <a href="#" className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center hover:bg-orange-600 hover:text-white transition-all hover:-translate-y-1">
                  <Instagram className="h-6 w-6" />
                </a>
                <a href="#" className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center hover:bg-orange-600 hover:text-white transition-all hover:-translate-y-1">
                  <Linkedin className="h-5 w-5" />
                </a>
              </div>
            </div>

            {/* Column 2 */}
            <div>
              <h4 className="text-xl font-black text-white mb-8 uppercase tracking-widest">Links Úteis</h4>
              <ul className="space-y-4 font-semibold">
                <li><a href="#" className="hover:text-orange-500 transition-colors flex items-center"><ChevronRight className="h-5 w-5 mr-2 text-orange-600" /> Portal do Aluno</a></li>
                <li><a href="#" className="hover:text-orange-500 transition-colors flex items-center"><ChevronRight className="h-5 w-5 mr-2 text-orange-600" /> Webmail Corporativo</a></li>
                <li><a href="#" className="hover:text-orange-500 transition-colors flex items-center"><ChevronRight className="h-5 w-5 mr-2 text-orange-600" /> Sistema Sponte</a></li>
                <li><a href="#" className="hover:text-orange-500 transition-colors flex items-center"><ChevronRight className="h-5 w-5 mr-2 text-orange-600" /> Painel de Vagas</a></li>
                <li><a href="#" className="hover:text-orange-500 transition-colors flex items-center"><ChevronRight className="h-5 w-5 mr-2 text-orange-600" /> Trabalhe Conosco</a></li>
              </ul>
            </div>

            {/* Column 3 */}
            <div>
              <h4 className="text-xl font-black text-white mb-8 uppercase tracking-widest">Contato e Localização</h4>
              <ul className="space-y-6 font-semibold">
                <li className="flex items-start">
                  <div className="w-10 h-10 rounded-xl bg-orange-600/20 flex items-center justify-center mr-4 flex-shrink-0">
                    <MapPin className="h-6 w-6 text-orange-500" />
                  </div>
                  <span className="text-lg">Av. Comercial, 123 - Centro<br />Camaçari - BA, 42800-000</span>
                </li>
                <li className="flex items-center">
                  <div className="w-10 h-10 rounded-xl bg-orange-600/20 flex items-center justify-center mr-4 flex-shrink-0">
                    <Phone className="h-5 w-5 text-orange-500" />
                  </div>
                  <span className="text-lg">(71) 3333-4444</span>
                </li>
                <li className="flex items-center">
                  <div className="w-10 h-10 rounded-xl bg-orange-600/20 flex items-center justify-center mr-4 flex-shrink-0">
                    <Mail className="h-5 w-5 text-orange-500" />
                  </div>
                  <span className="text-lg">contato@grupocte.com.br</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 pt-10 flex flex-col md:flex-row justify-between items-center text-gray-500 font-bold text-sm">
            <p className="mb-4 md:mb-0">
              &copy; {new Date().getFullYear()} Grupo CTE. Todos os direitos reservados.
            </p>
            <div className="flex space-x-8">
              <a href="/admin" className="hover:text-white transition-colors">Admin</a>
              <a href="#" className="hover:text-white transition-colors">Privacidade</a>
              <a href="#" className="hover:text-white transition-colors">Termos</a>
              <a href="#" className="hover:text-white transition-colors">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
