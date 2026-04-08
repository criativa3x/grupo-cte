import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  User, 
  GraduationCap, 
  FileText, 
  ChevronRight, 
  ChevronLeft, 
  CheckCircle2, 
  Loader2, 
  ArrowLeft,
  Calendar,
  Phone,
  Mail,
  MapPin,
  School,
  Clock,
  Star,
  Target
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import Header from '../components/Header';
import Footer from '../components/Footer';

type Step = 1 | 2 | 3;

export default function StudentRegistration() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [step, success]);

  const [formData, setFormData] = useState({
    // Step 1
    nome_completo: '',
    data_nascimento: '',
    telefone_whatsapp: '',
    email: '',
    cidade: '',
    bairro: '',
    // Step 2
    escolaridade: '',
    instituicao_ensino: '',
    turno_estudo: '',
    // Step 3
    ja_aluno_cte: 'Não',
    curso_cte: '',
    areas_interesse: '',
    resumo_experiencia: ''
  });

  const handleNext = () => {
    if (step < 3) setStep((step + 1) as Step);
  };

  const handleBack = () => {
    if (step > 1) setStep((step - 1) as Step);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) {
      handleNext();
      return;
    }

    setLoading(true);
    const { data_nascimento, telefone_whatsapp, ...rest } = formData;
    const dataToSubmit = {
      ...rest,
      nome: formData.nome_completo, // Alias
      telefone_whatsapp,
      telefone: telefone_whatsapp, // Alias
      whatsapp: telefone_whatsapp, // Alias
      data_nascimento: data_nascimento || null,
      status: 'Novo'
    };
    
    console.log('Enviando currículo:', dataToSubmit);
    
    try {
      const { error } = await supabase
        .from('curriculos_estagiarios')
        .insert([dataToSubmit]);

      if (error) throw error;
      setSuccess(true);
    } catch (err: any) {
      console.error('Error submitting resume:', err);
      // More descriptive error for debugging
      const errorMessage = err.message || 'Erro desconhecido';
      alert(`Erro ao enviar currículo: ${errorMessage}. Por favor, tente novamente.`);
    } finally {
      setLoading(false);
    }
  };

  const progressWidth = `${(step / 3) * 100}%`;

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans">
      <Header />

      <main className="max-w-3xl mx-auto px-4 py-12 md:py-20 min-h-[60vh]">
        {/* Back Button */}
        {!success && (
          <Link 
            to="/quero-estagiar" 
            className="inline-flex items-center space-x-2 text-gray-500 hover:text-orange-600 font-bold mb-8 transition-colors group"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            <span>Voltar</span>
          </Link>
        )}

        {success ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-[3rem] p-12 md:p-20 text-center shadow-2xl border border-gray-100"
          >
            <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8">
              <CheckCircle2 size={48} />
            </div>
            <h2 className="text-4xl font-black text-blue-950 mb-6">Currículo Enviado!</h2>
            <p className="text-xl text-gray-500 font-medium mb-10 leading-relaxed">
              Obrigado por se cadastrar, <span className="text-blue-950 font-bold">{formData.nome_completo.split(' ')[0]}</span>! 
              Seu perfil agora faz parte do nosso banco de talentos e entraremos em contato assim que surgir uma oportunidade ideal para você.
            </p>
            <button 
              onClick={() => navigate('/')}
              className="bg-orange-600 hover:bg-orange-700 text-white px-12 py-5 rounded-2xl font-black text-lg shadow-xl shadow-orange-600/20 transition-all hover:scale-105 active:scale-95"
            >
              Voltar para a Home
            </button>
          </motion.div>
        ) : (
          <div className="bg-white rounded-[3rem] shadow-2xl border border-gray-100 overflow-hidden">
            {/* Progress Bar */}
            <div className="h-2 bg-gray-100 w-full">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: progressWidth }}
                className="h-full bg-orange-600"
              />
            </div>

            <div className="p-8 md:p-16">
              <div className="flex items-center justify-between mb-12">
                <div>
                  <span className="text-orange-600 font-black text-sm uppercase tracking-widest">Passo {step} de 3</span>
                  <h1 className="text-3xl font-black text-blue-950 mt-1">
                    {step === 1 && 'Dados Pessoais'}
                    {step === 2 && 'Escolaridade'}
                    {step === 3 && 'Perfil Profissional'}
                  </h1>
                </div>
                <div className="hidden sm:flex items-center space-x-2">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black ${step >= 1 ? 'bg-orange-600 text-white' : 'bg-gray-100 text-gray-400'}`}>1</div>
                  <div className={`w-8 h-[2px] ${step >= 2 ? 'bg-orange-600' : 'bg-gray-100'}`} />
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black ${step >= 2 ? 'bg-orange-600 text-white' : 'bg-gray-100 text-gray-400'}`}>2</div>
                  <div className={`w-8 h-[2px] ${step >= 3 ? 'bg-orange-600' : 'bg-gray-100'}`} />
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black ${step >= 3 ? 'bg-orange-600 text-white' : 'bg-gray-100 text-gray-400'}`}>3</div>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                {step === 1 && (
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center space-x-2">
                        <User size={14} />
                        <span>Nome Completo *</span>
                      </label>
                      <input 
                        required
                        type="text"
                        value={formData.nome_completo}
                        onChange={(e) => setFormData({...formData, nome_completo: e.target.value})}
                        placeholder="Seu nome completo"
                        className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:bg-white focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 outline-none transition-all font-medium"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center space-x-2">
                          <Calendar size={14} />
                          <span>Data de Nascimento</span>
                        </label>
                        <input 
                          type="date"
                          value={formData.data_nascimento}
                          onChange={(e) => setFormData({...formData, data_nascimento: e.target.value})}
                          className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:bg-white focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 outline-none transition-all font-medium"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center space-x-2">
                          <Phone size={14} />
                          <span>Telefone/WhatsApp *</span>
                        </label>
                        <input 
                          required
                          type="tel"
                          value={formData.telefone_whatsapp}
                          onChange={(e) => setFormData({...formData, telefone_whatsapp: e.target.value})}
                          placeholder="(00) 00000-0000"
                          className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:bg-white focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 outline-none transition-all font-medium"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center space-x-2">
                        <Mail size={14} />
                        <span>E-mail</span>
                      </label>
                      <input 
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        placeholder="seu@email.com"
                        className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:bg-white focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 outline-none transition-all font-medium"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center space-x-2">
                          <MapPin size={14} />
                          <span>Cidade</span>
                        </label>
                        <input 
                          type="text"
                          value={formData.cidade}
                          onChange={(e) => setFormData({...formData, cidade: e.target.value})}
                          placeholder="Sua cidade"
                          className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:bg-white focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 outline-none transition-all font-medium"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center space-x-2">
                          <MapPin size={14} />
                          <span>Bairro</span>
                        </label>
                        <input 
                          type="text"
                          value={formData.bairro}
                          onChange={(e) => setFormData({...formData, bairro: e.target.value})}
                          placeholder="Seu bairro"
                          className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:bg-white focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 outline-none transition-all font-medium"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center space-x-2">
                        <GraduationCap size={14} />
                        <span>Escolaridade</span>
                      </label>
                      <select 
                        required
                        value={formData.escolaridade}
                        onChange={(e) => setFormData({...formData, escolaridade: e.target.value})}
                        className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:bg-white focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 outline-none transition-all font-medium"
                      >
                        <option value="">Selecione...</option>
                        <option value="Ensino Médio">Ensino Médio</option>
                        <option value="Cursando Superior">Cursando Superior</option>
                        <option value="Superior Completo">Superior Completo</option>
                        <option value="Técnico">Técnico</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center space-x-2">
                        <School size={14} />
                        <span>Nome da Instituição de Ensino</span>
                      </label>
                      <input 
                        type="text"
                        value={formData.instituicao_ensino}
                        onChange={(e) => setFormData({...formData, instituicao_ensino: e.target.value})}
                        placeholder="Onde você estuda/estudou?"
                        className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:bg-white focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 outline-none transition-all font-medium"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center space-x-2">
                        <Clock size={14} />
                        <span>Turno de Estudo</span>
                      </label>
                      <select 
                        value={formData.turno_estudo}
                        onChange={(e) => setFormData({...formData, turno_estudo: e.target.value})}
                        className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:bg-white focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 outline-none transition-all font-medium"
                      >
                        <option value="">Selecione...</option>
                        <option value="Matutino">Matutino</option>
                        <option value="Vespertino">Vespertino</option>
                        <option value="Noturno">Noturno</option>
                        <option value="Integral">Integral</option>
                      </select>
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center space-x-2">
                        <Star size={14} />
                        <span>Você já é aluno do Grupo CTE?</span>
                      </label>
                      <div className="flex items-center space-x-8">
                        {['Sim', 'Não'].map((opt) => (
                          <label key={opt} className="flex items-center space-x-3 cursor-pointer group">
                            <div className="relative flex items-center justify-center">
                              <input 
                                type="radio" 
                                name="ja_aluno"
                                value={opt}
                                checked={formData.ja_aluno_cte === opt}
                                onChange={(e) => setFormData({...formData, ja_aluno_cte: e.target.value})}
                                className="sr-only"
                              />
                              <div className={`w-6 h-6 rounded-full border-2 transition-all ${formData.ja_aluno_cte === opt ? 'border-orange-600 bg-orange-600' : 'border-gray-200 group-hover:border-orange-300'}`} />
                              {formData.ja_aluno_cte === opt && <div className="absolute w-2 h-2 bg-white rounded-full" />}
                            </div>
                            <span className={`font-bold ${formData.ja_aluno_cte === opt ? 'text-blue-950' : 'text-gray-400'}`}>{opt}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {formData.ja_aluno_cte === 'Sim' && (
                      <div className="space-y-2">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Qual curso você faz/fez conosco?</label>
                        <input 
                          type="text"
                          value={formData.curso_cte}
                          onChange={(e) => setFormData({...formData, curso_cte: e.target.value})}
                          placeholder="Ex: Auxiliar Administrativo"
                          className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:bg-white focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 outline-none transition-all font-medium"
                        />
                      </div>
                    )}

                    <div className="space-y-2">
                      <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center space-x-2">
                        <Target size={14} />
                        <span>Áreas de Interesse para Estágio</span>
                      </label>
                      <input 
                        type="text"
                        value={formData.areas_interesse}
                        onChange={(e) => setFormData({...formData, areas_interesse: e.target.value})}
                        placeholder="Ex: Administrativo, Vendas, TI..."
                        className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:bg-white focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 outline-none transition-all font-medium"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center space-x-2">
                        <FileText size={14} />
                        <span>Resumo de Experiência / Outras Informações</span>
                      </label>
                      <textarea 
                        value={formData.resumo_experiencia}
                        onChange={(e) => setFormData({...formData, resumo_experiencia: e.target.value})}
                        placeholder="Conte um pouco sobre você, suas habilidades e experiências anteriores..."
                        className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:bg-white focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 outline-none transition-all font-medium h-32 resize-none"
                      />
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between pt-8 border-t border-gray-100">
                  {step > 1 ? (
                    <button 
                      type="button"
                      onClick={handleBack}
                      className="flex items-center space-x-2 text-gray-400 hover:text-blue-950 font-black transition-colors"
                    >
                      <ChevronLeft size={20} />
                      <span>Voltar</span>
                    </button>
                  ) : (
                    <div />
                  )}

                  <button 
                    type="submit"
                    disabled={loading}
                    className="bg-orange-600 hover:bg-orange-700 text-white px-10 py-5 rounded-2xl font-black text-lg shadow-xl shadow-orange-600/20 transition-all hover:scale-105 active:scale-95 flex items-center justify-center space-x-3 disabled:opacity-50"
                  >
                    {loading ? (
                      <Loader2 className="animate-spin" size={24} />
                    ) : (
                      <>
                        <span>{step === 3 ? 'Enviar Currículo' : 'Avançar'}</span>
                        <ChevronRight size={20} />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

