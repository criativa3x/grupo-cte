import React, { useState, useRef } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { motion } from 'motion/react';
import { 
  ShieldCheck, 
  TrendingUp, 
  Users, 
  ChevronRight, 
  Briefcase, 
  CheckCircle2, 
  Send, 
  Loader2, 
  Building2, 
  Phone, 
  User, 
  Target 
} from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function ForCompanies() {
  const formRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    razao_social: '',
    contato_nome: '',
    telefone_whatsapp: '',
    tipo_vaga: ''
  });

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    console.log('Enviando solicitação de empresa:', {
      razao_social: formData.razao_social,
      nome_empresa: formData.razao_social,
      contato_nome: formData.contato_nome,
      nome_responsavel: formData.contato_nome,
      telefone_whatsapp: formData.telefone_whatsapp,
      telefone: formData.telefone_whatsapp,
      tipo_vaga: formData.tipo_vaga,
      status: 'Pendente'
    });
    
    try {
      const { error } = await supabase
        .from('solicitacoes_empresas')
        .insert([
          {
            razao_social: formData.razao_social,
            contato_nome: formData.contato_nome,
            telefone_whatsapp: formData.telefone_whatsapp,
            tipo_vaga: formData.tipo_vaga,
            status: 'Pendente'
          }
        ]);

      if (error) throw error;
      
      setSuccess(true);
      setFormData({
        razao_social: '',
        contato_nome: '',
        telefone_whatsapp: '',
        tipo_vaga: ''
      });
    } catch (err: any) {
      console.error('Error submitting form:', err);
      const errorMessage = err.message || 'Erro desconhecido';
      alert(`Erro ao enviar solicitação: ${errorMessage}. Tente novamente.`);
    } finally {
      setLoading(false);
    }
  };

  const benefits = [
    {
      title: 'Sem vínculo empregatício',
      description: 'O estágio não gera encargos trabalhistas, facilitando a contratação.',
      icon: <ShieldCheck className="text-blue-600" size={32} />
    },
    {
      title: 'Isenção de encargos',
      description: 'Sua empresa fica isenta de 13º salário, FGTS e aviso prévio.',
      icon: <TrendingUp className="text-blue-600" size={32} />
    },
    {
      title: 'Formação sob medida',
      description: 'Prepare o estagiário de acordo com a cultura e necessidades da sua empresa.',
      icon: <Users className="text-blue-600" size={32} />
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans">
      <Header />

      {/* Hero Section */}
      <section className="relative h-[80vh] min-h-[600px] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://res.cloudinary.com/dapsovbs5/image/upload/q_auto/f_auto/v1775654424/8_yusibp.webp" 
            alt="Ambiente Corporativo" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-blue-950/70 backdrop-blur-[2px]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center space-x-2 bg-blue-600/20 backdrop-blur-md border border-blue-600/30 px-4 py-2 rounded-full mb-6">
              <Building2 size={18} className="text-blue-400" />
              <span className="text-sm font-black uppercase tracking-widest text-blue-100">Soluções Corporativas</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
              Recrute os melhores talentos com <span className="text-blue-400">isenção</span> de encargos
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 font-medium mb-10 leading-relaxed">
              Sua empresa com a equipe ideal, reduzindo custos e formando profissionais sob medida para o seu negócio.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={scrollToForm}
                className="bg-orange-600 hover:bg-orange-700 text-white px-10 py-5 rounded-2xl font-black text-lg shadow-xl shadow-orange-600/20 transition-all hover:scale-105 active:scale-95 flex items-center justify-center space-x-3"
              >
                <span>Solicitar um Estagiário</span>
                <ChevronRight size={20} />
              </button>
              <button className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/20 px-10 py-5 rounded-2xl font-black text-lg transition-all flex items-center justify-center">
                Conhecer Vantagens
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black text-blue-950 mb-6">Vantagens Legais e Financeiras</h2>
            <p className="text-gray-500 font-medium text-lg max-w-2xl mx-auto">
              Contratar um estagiário é uma das formas mais eficientes de oxigenar sua equipe e reduzir custos operacionais.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="bg-[#F8FAFC] p-10 rounded-[2.5rem] border border-gray-100 hover:shadow-xl hover:shadow-blue-900/5 transition-all group"
              >
                <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                  {benefit.icon}
                </div>
                <h3 className="text-2xl font-black text-blue-950 mb-4">{benefit.title}</h3>
                <p className="text-gray-500 font-medium leading-relaxed">
                  {benefit.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section ref={formRef} className="py-24 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-[3rem] shadow-2xl border border-gray-100 overflow-hidden flex flex-col lg:flex-row">
            <div className="lg:w-1/2 bg-blue-950 p-12 md:p-20 text-white relative">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full -mr-32 -mt-32 blur-3xl" />
              <div className="relative z-10">
                <h2 className="text-4xl font-black mb-8">Solicite um Estagiário</h2>
                <p className="text-gray-400 font-medium mb-12 text-lg">
                  Preencha o formulário e nossa equipe entrará em contato para entender seu perfil de vaga e apresentar os melhores candidatos.
                </p>
                
                <div className="space-y-6">
                  {[
                    'Triagem especializada de currículos',
                    'Acompanhamento jurídico completo',
                    'Gestão de contratos e seguros',
                    'Suporte contínuo para a empresa'
                  ].map((item, i) => (
                    <div key={i} className="flex items-center space-x-4">
                      <CheckCircle2 className="text-blue-400" size={24} />
                      <span className="font-bold">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:w-1/2 p-12 md:p-20">
              {success ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="h-full flex flex-col items-center justify-center text-center"
                >
                  <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-8">
                    <CheckCircle2 size={48} />
                  </div>
                  <h3 className="text-3xl font-black text-blue-950 mb-4">Solicitação Enviada!</h3>
                  <p className="text-gray-500 font-medium mb-8">
                    Recebemos seus dados com sucesso. Em breve, um de nossos consultores entrará em contato.
                  </p>
                  <button 
                    onClick={() => setSuccess(false)}
                    className="text-blue-600 font-black hover:underline"
                  >
                    Enviar outra solicitação
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center space-x-2">
                        <Building2 size={14} />
                        <span>Razão Social</span>
                      </label>
                      <input 
                        required
                        type="text"
                        value={formData.razao_social}
                        onChange={(e) => setFormData({...formData, razao_social: e.target.value})}
                        placeholder="Nome da sua empresa"
                        className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-medium"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center space-x-2">
                          <User size={14} />
                          <span>Contato (Nome)</span>
                        </label>
                        <input 
                          required
                          type="text"
                          value={formData.contato_nome}
                          onChange={(e) => setFormData({...formData, contato_nome: e.target.value})}
                          placeholder="Pessoa responsável"
                          className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-medium"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center space-x-2">
                          <Phone size={14} />
                          <span>Telefone/WhatsApp</span>
                        </label>
                        <input 
                          required
                          type="tel"
                          value={formData.telefone_whatsapp}
                          onChange={(e) => setFormData({...formData, telefone_whatsapp: e.target.value})}
                          placeholder="(00) 00000-0000"
                          className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-medium"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center space-x-2">
                        <Target size={14} />
                        <span>Tipo de Vaga</span>
                      </label>
                      <input 
                        required
                        type="text"
                        value={formData.tipo_vaga}
                        onChange={(e) => setFormData({...formData, tipo_vaga: e.target.value})}
                        placeholder="Ex: Administrativo, TI, Vendas..."
                        className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-medium"
                      />
                    </div>
                  </div>

                  <button 
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white px-10 py-5 rounded-2xl font-black text-lg shadow-xl shadow-blue-600/20 transition-all flex items-center justify-center space-x-3 disabled:opacity-50"
                  >
                    {loading ? (
                      <Loader2 className="animate-spin" size={24} />
                    ) : (
                      <>
                        <Send size={20} />
                        <span>Enviar Solicitação</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
