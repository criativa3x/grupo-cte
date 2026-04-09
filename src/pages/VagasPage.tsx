import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { MapPin, Briefcase, ChevronLeft, Loader2, DollarSign, Headset, Calculator, UtensilsCrossed } from 'lucide-react';
import { getAreaIcon } from '../lib/icons';

export default function VagasPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [vagas, setVagas] = useState<any[]>([]);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchVagas();
  }, []);

  const fetchVagas = async () => {
    try {
      // Forçamos a busca em tempo real desativando o cache no cliente Supabase
      const { data, error } = await supabase
        .from('vagas_estagio')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setVagas(data || []);
    } catch (error) {
      console.error('Error fetching vacancies:', error);
    } finally {
      setLoading(false);
    }
  };

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
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="h-12 w-12 text-orange-600 animate-spin mb-4" />
              <p className="text-gray-500 font-medium">Carregando vagas...</p>
            </div>
          ) : vagas.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {vagas.map((vaga) => (
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
