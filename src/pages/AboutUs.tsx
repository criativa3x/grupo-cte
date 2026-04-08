import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Target, Eye, Gem, ChevronRight, GraduationCap, Building2 } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

export default function AboutUs() {
  const structureImages = [
    "https://res.cloudinary.com/dapsovbs5/image/upload/v1775678705/recepcao_copisystem_jup4ar.jpg",
    "https://res.cloudinary.com/dapsovbs5/image/upload/v1775678705/evolua_sxpdgs.jpg",
    "https://res.cloudinary.com/dapsovbs5/image/upload/v1775678704/copi_lab2_cmnwsu.jpg",
    "https://res.cloudinary.com/dapsovbs5/image/upload/v1775678705/copi_lab1_puaopw.jpg",
    "https://res.cloudinary.com/dapsovbs5/image/upload/v1775678704/sala_de_entrevista_yepnm5.jpg",
    "https://res.cloudinary.com/dapsovbs5/image/upload/v1775678704/evolua2_qvghpe.jpg",
    "https://res.cloudinary.com/dapsovbs5/image/upload/v1775678704/sala_de_espera_qrvf42.jpg"
  ];

  return (
    <div className="min-h-screen bg-white font-sans">
      <Header />

      {/* 1. Hero Section */}
      <section className="relative min-h-[45vh] flex items-center justify-center overflow-hidden bg-blue-950">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1920&auto=format&fit=crop" 
            alt="Grupo CTE Ambiente" 
            className="w-full h-full object-cover opacity-30"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-blue-950/80 to-blue-950" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
              Tradição em Capacitação e <br />
              <span className="text-orange-500">Excelência</span> em Recrutamento.
            </h1>
            <p className="text-xl md:text-2xl text-orange-400 font-bold tracking-wide uppercase">
              Transformando vidas e carreiras desde 1994.
            </p>
          </motion.div>
        </div>
      </section>

      {/* 2. Nossa História Section */}
      <section className="py-16 md:py-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="aspect-[4/3] rounded-[3rem] overflow-hidden shadow-2xl border-8 border-gray-50 group">
                <Swiper
                  modules={[Autoplay, Pagination, Navigation]}
                  spaceBetween={0}
                  slidesPerView={1}
                  autoplay={{ delay: 5000, disableOnInteraction: false }}
                  pagination={{ clickable: true }}
                  navigation={true}
                  loop={true}
                  className="w-full h-full about-us-swiper"
                >
                  {structureImages.map((url, index) => (
                    <SwiperSlide key={index}>
                      <img 
                        src={url} 
                        alt={`Estrutura Grupo CTE ${index + 1}`} 
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
              <div className="absolute -bottom-6 -right-6 bg-orange-600 text-white p-8 rounded-3xl shadow-2xl hidden md:block z-20">
                <p className="text-4xl font-black">30+</p>
                <p className="font-bold text-orange-100">Anos de História</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              <h2 className="text-3xl md:text-4xl font-black text-blue-950 mb-8">Sobre o Grupo CTE</h2>
              <div className="space-y-6 text-gray-600 text-lg leading-relaxed font-medium">
                <p>
                  Há mais de três décadas, o Grupo CTE nasceu com o propósito de ser a ponte entre o potencial dos jovens e as necessidades do mercado de trabalho. Fundado em 1994, iniciamos nossa jornada focados em capacitação profissional de excelência, acreditando que a educação é a ferramenta mais poderosa de transformação social.
                </p>
                <p>
                  Ao longo dos anos, evoluímos para nos tornar referência em recrutamento e seleção de estagiários, desenvolvendo metodologias próprias que garantem o match perfeito entre empresa e candidato. Nossa tradição é construída diariamente através de milhares de histórias de sucesso de alunos que hoje são líderes em suas áreas.
                </p>
                <p>
                  Hoje, o Grupo CTE continua inovando, unindo tecnologia e atendimento humanizado para oferecer soluções completas em RH e educação. Nossa missão é clara: capacitar pessoas e impulsionar organizações, gerando valor para toda a sociedade através do trabalho e do conhecimento.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 3. Missão, Visão e Valores Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Missão */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white p-10 rounded-[2.5rem] shadow-xl shadow-blue-900/5 border border-gray-100 group hover:-translate-y-2 transition-all"
            >
              <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                <Target className="text-orange-600" size={32} />
              </div>
              <h3 className="text-2xl font-black text-blue-950 mb-4">Missão</h3>
              <p className="text-gray-500 font-medium leading-relaxed">
                Capacitar jovens talentos e conectar empresas a profissionais qualificados, promovendo o desenvolvimento humano e organizacional através da excelência em educação e recrutamento.
              </p>
            </motion.div>

            {/* Visão */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-white p-10 rounded-[2.5rem] shadow-xl shadow-blue-900/5 border border-gray-100 group hover:-translate-y-2 transition-all"
            >
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                <Eye className="text-blue-600" size={32} />
              </div>
              <h3 className="text-2xl font-black text-blue-950 mb-4">Visão</h3>
              <p className="text-gray-500 font-medium leading-relaxed">
                Ser reconhecido como o principal ecossistema de integração entre educação e mercado de trabalho no Brasil, transformando o futuro de gerações através da empregabilidade.
              </p>
            </motion.div>

            {/* Valores */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="bg-white p-10 rounded-[2.5rem] shadow-xl shadow-blue-900/5 border border-gray-100 group hover:-translate-y-2 transition-all"
            >
              <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                <Gem className="text-orange-600" size={32} />
              </div>
              <h3 className="text-2xl font-black text-blue-950 mb-4">Valores</h3>
              <ul className="text-gray-500 font-medium leading-relaxed space-y-2">
                <li className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-orange-600 rounded-full" />
                  <span>Ética e Transparência</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-orange-600 rounded-full" />
                  <span>Compromisso com o Aprendizado</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-orange-600 rounded-full" />
                  <span>Inovação Constante</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-orange-600 rounded-full" />
                  <span>Foco em Resultados</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-orange-600 rounded-full" />
                  <span>Valorização das Pessoas</span>
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 4. Call to Action Section */}
      <section className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-orange-600 rounded-[3rem] p-12 md:p-20 text-center text-white shadow-2xl shadow-orange-600/30 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full -ml-32 -mt-32 blur-3xl" />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative z-10"
            >
              <h2 className="text-4xl md:text-6xl font-black mb-12">Faça parte da nossa história.</h2>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <Link 
                  to="/quero-estagiar"
                  className="w-full sm:w-auto bg-white text-orange-600 px-12 py-5 rounded-2xl font-black text-xl shadow-xl transition-all hover:scale-105 active:scale-95 flex items-center justify-center space-x-3"
                >
                  <GraduationCap size={24} />
                  <span>Quero Estagiar</span>
                </Link>
                <Link 
                  to="/para-empresas"
                  className="w-full sm:w-auto bg-transparent border-2 border-white text-white px-12 py-5 rounded-2xl font-black text-xl transition-all hover:bg-white/10 flex items-center justify-center space-x-3"
                >
                  <Building2 size={24} />
                  <span>Para Empresas</span>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
