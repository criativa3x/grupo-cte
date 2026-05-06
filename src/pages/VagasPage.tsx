import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { MapPin, Briefcase, ChevronLeft, Loader2, DollarSign, Headset, Calculator, UtensilsCrossed, Calendar, Search, Filter } from 'lucide-react';
import { getAreaIcon } from '../lib/icons';

export default function VagasPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [vagas, setVagas] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedArea, setSelectedArea] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchVagas();
  }, []);

  const fetchVagas = async () => {
    try {
      // Forçamos a busca em tempo real desativando o cache no cliente Supabase
      const [vagasRes, parceirosRes] = await Promise.all([
        supabase.from('vagas_estagio').select('*').order('created_at', { ascending: false }),
        supabase.from('parceiros').select('*')
      ]);

      if (vagasRes.error) throw vagasRes.error;
      
      const partners = parceirosRes.data || [];
      const joinedVagas = (vagasRes.data || []).map(vaga => ({
        ...vaga,
        parceiros: partners.find(p => p.id === vaga.parceiro_id)
      }));

      setVagas(joinedVagas);
    } catch (error) {
      console.error('Error fetching vacancies:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredVagas = vagas.filter(vaga => {
    const matchesSearch = searchTerm === '' || 
      vaga.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (vaga.local && vaga.local.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesArea = selectedArea === '' || vaga.area === selectedArea;
    
    return matchesSearch && matchesArea;
  });

  const areas = Array.from(new Set(vagas.map(v => v.area).filter(Boolean)));

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Header />

      {/* Hero Section */}
      <section className="bg-blue-950 py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20px_20px,white_2px,transparent_0)] bg-[length:40px_40px]"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <Link to="/" className="inline-flex items-center text-white/60 hover:text-white mb-8 transition-colors">
            <ChevronLeft className="mr-2 h-5 w-5" />
            Voltar para a Home
          </Link>
          <h1 className="text-4xl md:text-6xl font-black text-white mb-6">Oportunidades de Estágio</h1>
          <p className="text-xl text-blue-100 max-w-2xl font-medium">
            Encontre a vaga ideal para iniciar sua jornada profissional com o Grupo CTE.
          </p>
        </div>
      </section>

      {/* Vacancies List */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Search and Filter */}
          <div className="mb-12 bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Pesquisa */}
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input 
                  type="text" 
                  placeholder="Pesquisar vagas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-orange-500 outline-none font-medium transition-all"
                />
              </div>

              {/* Filtro por Área */}
              <div className="relative">
                <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                <select 
                  value={selectedArea}
                  onChange={(e) => setSelectedArea(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-orange-500 outline-none font-medium transition-all appearance-none"
                >
                  <option value="">Todas as Áreas</option>
                  {areas.map((area: any) => (
                    <option key={area} value={area}>{area}</option>
                  ))}
                </select>
              </div>

              {/* Resultados info */}
              <div className="flex items-center justify-center lg:justify-end text-gray-500 font-bold uppercase tracking-widest text-xs">
                {filteredVagas.length} {filteredVagas.length === 1 ? 'vaga encontrada' : 'vagas encontradas'}
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="h-12 w-12 text-orange-600 animate-spin mb-4" />
              <p className="text-gray-500 font-medium">Carregando vagas...</p>
            </div>
          ) : filteredVagas.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredVagas.map((vaga) => (
                <div key={vaga.id} className="bg-white rounded-3xl shadow-md hover:shadow-lg transition-all duration-500 overflow-hidden border border-gray-50 group flex flex-col h-full">
                  <div className="p-8 flex flex-col items-center flex-1">
                    {/* Top: Logo da empresa ou ícone fallback */}
                    <div className="relative mb-6 w-full flex justify-center items-center h-16">
                      {vaga.parceiros?.logo_url ? (
                        <img 
                          src={vaga.parceiros.logo_url} 
                          alt={vaga.parceiros.nome} 
                          className="h-full w-auto max-w-full object-contain"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-2xl bg-[#1a233e] flex items-center justify-center shadow-md group-hover:scale-105 transition-transform border-4 border-white">
                          <Briefcase className="h-8 w-8 text-white" />
                        </div>
                      )}
                    </div>

                    {/* Tag Condicional (Badge) */}
                    <div className="inline-block px-6 py-2 bg-green-100 text-green-800 text-sm font-bold rounded-full mb-6 uppercase tracking-wide">
                      VAGA DE ESTÁGIO
                    </div>

                    {/* Título */}
                    <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 text-center leading-[1.15]">{vaga.titulo}</h3>

                    {/* Sessão de Requisitos: Alinhado à esquerda */}
                    <div className="w-full text-left mb-8">
                      <h4 className="text-lg font-bold text-gray-900 mb-2 uppercase">REQUISITOS:</h4>
                      <ul className="space-y-1 text-gray-700 text-base">
                        {vaga.requisitos ? (
                          vaga.requisitos.split('\n').filter((line: string) => line.trim()).map((req: string, i: number) => (
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

                    {/* Prazo de Candidatura */}
                    {vaga.prazo_candidatura && String(vaga.prazo_candidatura).length > 2 && (
                      <div className="w-full text-center mb-4 px-2">
                        <div className="bg-orange-50/50 py-2.5 rounded-xl border border-orange-100 flex items-center justify-center gap-2 shadow-sm">
                          <span className="text-lg">⏳</span>
                          <span className="text-gray-600 text-xs font-bold uppercase tracking-widest">
                            Inscrições até: 
                          </span>
                          <span className="font-extrabold text-orange-700 text-sm">
                            {(() => {
                              try {
                                const val = String(vaga.prazo_candidatura);
                                // Tenta extrair DD/MM de formatos ISO (YYYY-MM-DD) ou similares
                                const parts = val.split(/[-T/ ]/);
                                if (parts.length >= 3) {
                                  // Se começar com ano (YYYY-MM-DD)
                                  if (parts[0].length === 4) return `${parts[2].padStart(2, '0')}/${parts[1].padStart(2, '0')}`;
                                  // Se começar com dia (DD/MM/YYYY)
                                  return `${parts[0].padStart(2, '0')}/${parts[1].padStart(2, '0')}`;
                                }
                                return val;
                              } catch (e) {
                                return 'Consulte';
                              }
                            })()}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Botão */}
                    <Link 
                      to={`/cadastro-estagiario?vaga=${encodeURIComponent(vaga.titulo)}`}
                      className="w-full bg-[#1a234e] hover:bg-[#2a336e] text-white text-center font-bold py-4 rounded-xl transition-all shadow-md active:scale-95 mt-auto"
                    >
                      Candidatar-se
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-3xl shadow-inner border-2 border-dashed border-gray-200">
              <Briefcase className="h-16 w-16 text-gray-300 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Nenhuma vaga disponível no momento</h3>
              <p className="text-gray-500">Fique atento, novas oportunidades surgem todos os dias!</p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
