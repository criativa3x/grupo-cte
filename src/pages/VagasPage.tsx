import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Menu, X, MapPin, Briefcase, ChevronLeft, Loader2 } from 'lucide-react';

export default function VagasPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [vagas, setVagas] = useState<any[]>([]);

  useEffect(() => {
    fetchVagas();
  }, []);

  const fetchVagas = async () => {
    try {
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
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <img 
                src="https://res.cloudinary.com/dapsovbs5/image/upload/v1774648783/logo_kb9nkn.png" 
                alt="Grupo CTE Logo" 
                className="h-10 w-auto"
                referrerPolicy="no-referrer"
              />
            </Link>

            <nav className="hidden md:flex space-x-8">
              <Link to="/" className="text-gray-700 hover:text-orange-600 font-semibold transition-colors">Início</Link>
              <Link to="/#cursos" className="text-gray-700 hover:text-orange-600 font-semibold transition-colors">Cursos</Link>
              <Link to="/vagas" className="text-orange-600 font-bold">Vagas de Estágio</Link>
            </nav>

            <div className="md:hidden">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-600">
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
      </header>

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
                <div key={vaga.id} className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 group">
                  <div className="p-8 flex flex-col items-center text-center">
                    <img 
                      src={`https://picsum.photos/seed/${vaga.titulo}/200/200`} 
                      alt={vaga.titulo} 
                      className="w-20 h-20 rounded-full border-2 border-orange-500 mb-6 object-cover shadow-lg group-hover:scale-110 transition-transform"
                      referrerPolicy="no-referrer"
                    />
                    <div className="inline-block px-4 py-1 bg-green-100 text-green-700 text-xs font-black rounded-full mb-4 uppercase tracking-widest">Vaga Aberta</div>
                    <h3 className="text-2xl font-black text-gray-900 mb-4">{vaga.titulo}</h3>
                    <div className="space-y-3 mb-8 w-full">
                      <div className="flex items-center justify-center text-gray-600 font-semibold">
                        <MapPin className="h-5 w-5 mr-2 text-orange-500" />
                        <span>{vaga.local}</span>
                      </div>
                      <div className="flex items-center justify-center text-gray-600 font-semibold">
                        <Briefcase className="h-5 w-5 mr-2 text-orange-500" />
                        <span>Bolsa: <strong className="text-gray-900">{vaga.valor_bolsa}</strong></span>
                      </div>
                    </div>
                    <a 
                      href={vaga.link_candidatura} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-full bg-blue-950 hover:bg-orange-600 text-white text-center font-black py-4 rounded-2xl transition-all shadow-lg"
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

      {/* Footer */}
      <footer className="bg-blue-950 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <img 
            src="https://res.cloudinary.com/dapsovbs5/image/upload/v1774648783/logo_kb9nkn.png" 
            alt="Grupo CTE Logo" 
            className="h-12 w-auto mx-auto mb-8 brightness-0 invert"
            referrerPolicy="no-referrer"
          />
          <p className="text-blue-200 mb-4">© 2026 Grupo CTE - Centro de Treinamento e Estágio. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
