import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { motion } from 'motion/react';
import { TrendingUp, Wallet, Users, ChevronRight, GraduationCap, Briefcase, Award } from 'lucide-react';

export default function ForStudents() {
  const advantages = [
    {
      title: 'Crescimento Profissional',
      description: 'Aprenda na prática com profissionais experientes e acelere sua carreira.',
      icon: <TrendingUp className="text-orange-600" size={32} />
    },
    {
      title: 'Bolsa Auxílio',
      description: 'Garanta sua independência financeira enquanto estuda e se especializa.',
      icon: <Wallet className="text-orange-600" size={32} />
    },
    {
      title: 'Networking',
      description: 'Construa uma rede de contatos valiosa no mercado de trabalho desde cedo.',
      icon: <Users className="text-orange-600" size={32} />
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans">
      <Header />

      {/* Hero Section */}
      <section className="relative h-[80vh] min-h-[600px] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1920&auto=format&fit=crop" 
            alt="Estudantes" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center space-x-2 bg-orange-600/20 backdrop-blur-md border border-orange-600/30 px-4 py-2 rounded-full mb-6">
              <GraduationCap size={18} className="text-orange-500" />
              <span className="text-sm font-black uppercase tracking-widest text-orange-100">Oportunidade para Jovens</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
              Dê o próximo passo na sua <span className="text-orange-500">carreira</span> profissional
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 font-medium mb-10 leading-relaxed">
              Conectando jovens talentos às melhores oportunidades do mercado. Comece sua jornada hoje mesmo.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-orange-600 hover:bg-orange-700 text-white px-10 py-5 rounded-2xl font-black text-lg shadow-xl shadow-orange-600/20 transition-all hover:scale-105 active:scale-95 flex items-center justify-center space-x-3">
                <span>Cadastrar meu Currículo</span>
                <ChevronRight size={20} />
              </button>
              <button className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/20 px-10 py-5 rounded-2xl font-black text-lg transition-all flex items-center justify-center">
                Ver Vagas Abertas
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Advantages Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black text-blue-950 mb-6">Por que estagiar conosco?</h2>
            <p className="text-gray-500 font-medium text-lg max-w-2xl mx-auto">
              Oferecemos todo o suporte necessário para que sua primeira experiência profissional seja transformadora.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {advantages.map((adv, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="bg-[#F8FAFC] p-10 rounded-[2.5rem] border border-gray-100 hover:shadow-xl hover:shadow-blue-900/5 transition-all group"
              >
                <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                  {adv.icon}
                </div>
                <h3 className="text-2xl font-black text-blue-950 mb-4">{adv.title}</h3>
                <p className="text-gray-500 font-medium leading-relaxed">
                  {adv.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-24 bg-blue-950 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-orange-600/5 blur-3xl rounded-full -mr-24" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-black mb-8 leading-tight">Como funciona o processo?</h2>
              <div className="space-y-8">
                {[
                  { step: '01', title: 'Cadastro', desc: 'Preencha seus dados e anexe seu currículo em nossa plataforma.' },
                  { step: '02', title: 'Análise', desc: 'Nossa equipe avalia seu perfil e identifica as melhores vagas.' },
                  { step: '03', title: 'Entrevista', desc: 'Preparamos você para as entrevistas com as empresas parceiras.' },
                  { step: '04', title: 'Contratação', desc: 'Pronto! Você começa sua jornada no mercado de trabalho.' }
                ].map((item, i) => (
                  <div key={i} className="flex items-start space-x-6">
                    <div className="text-4xl font-black text-orange-500/30">{item.step}</div>
                    <div>
                      <h4 className="text-xl font-bold mb-2">{item.title}</h4>
                      <p className="text-gray-400 font-medium">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-[3rem] overflow-hidden border-8 border-white/10 shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1000&auto=format&fit=crop" 
                  alt="Trabalho em equipe" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="absolute -bottom-10 -left-10 bg-orange-600 p-8 rounded-3xl shadow-2xl hidden md:block">
                <Award size={48} className="text-white mb-4" />
                <p className="text-2xl font-black">+5000 Jovens</p>
                <p className="text-orange-100 font-bold">Encaminhados</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-orange-600 rounded-[3rem] p-12 md:p-20 text-center text-white shadow-2xl shadow-orange-600/30 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full -ml-32 -mt-32 blur-3xl" />
            <div className="relative z-10">
              <h2 className="text-4xl md:text-6xl font-black mb-8">Pronto para começar?</h2>
              <p className="text-xl text-orange-50 font-medium mb-12 max-w-2xl mx-auto">
                Não deixe seu futuro para depois. Cadastre-se agora e tenha acesso às melhores vagas de estágio da região.
              </p>
              <button className="bg-white text-orange-600 px-12 py-6 rounded-2xl font-black text-xl shadow-xl transition-all hover:scale-105 active:scale-95">
                Cadastrar Currículo Agora
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
