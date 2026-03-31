import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { motion } from 'motion/react';
import { ChevronLeft, GraduationCap, Clock, ArrowRight, Loader2 } from 'lucide-react';

interface Category {
  id: string;
  titulo: string;
  imagem_url: string;
}

interface Course {
  id: string;
  titulo: string;
  slug: string;
  descricao_curta: string;
  carga_horaria: string;
  imagem_url: string;
  ativo: boolean;
  categoria_id: string;
}

export default function CategoryDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState<Category | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    async function fetchData() {
      if (!id) return;
      
      setLoading(true);
      try {
        // Fetch category details
        const { data: catData, error: catError } = await supabase
          .from('categorias')
          .select('*')
          .eq('id', id)
          .single();

        if (catError) throw catError;
        setCategory(catData);

        // Fetch courses for this category
        const { data: coursesData, error: coursesError } = await supabase
          .from('cursos')
          .select('*')
          .eq('categoria_id', id)
          .eq('ativo', true)
          .order('titulo');

        if (coursesError) throw coursesError;
        setCourses(coursesData || []);
      } catch (error) {
        console.error('Error fetching category details:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-orange-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-bold uppercase tracking-widest">Carregando cursos...</p>
        </div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center max-w-md">
          <GraduationCap className="h-20 w-20 text-gray-300 mx-auto mb-6" />
          <h2 className="text-3xl font-black text-blue-950 mb-4">Categoria não encontrada</h2>
          <p className="text-gray-600 mb-8 font-medium">A categoria que você está procurando não existe ou foi removida.</p>
          <button 
            onClick={() => navigate('/')}
            className="bg-orange-600 text-white font-black px-8 py-4 rounded-2xl shadow-xl hover:bg-orange-700 transition-all"
          >
            Voltar para a Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Header */}
      <header className="bg-blue-950 pt-32 pb-20 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-400/5 rounded-full blur-3xl -ml-10 -mb-10"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <Link 
            to="/" 
            className="inline-flex items-center text-orange-400 hover:text-orange-300 font-bold mb-8 transition-colors group"
          >
            <ChevronLeft className="mr-2 h-5 w-5 group-hover:-translate-x-1 transition-transform" />
            Voltar para a Home
          </Link>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div>
              <h1 className="text-4xl md:text-6xl font-black text-white mb-4 leading-tight">
                Cursos de <span className="text-orange-500">{category.titulo}</span>
              </h1>
              <p className="text-blue-100 text-xl max-w-2xl font-medium">
                Explore nossa seleção de cursos práticos e acelere sua carreira hoje mesmo.
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6 flex items-center">
              <div className="w-12 h-12 bg-orange-600 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
                <GraduationCap className="text-white h-6 w-6" />
              </div>
              <div>
                <span className="block text-white font-black text-2xl leading-none">{courses.length}</span>
                <span className="text-blue-200 text-xs font-bold uppercase tracking-widest">Cursos Disponíveis</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {courses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((curso) => (
              <motion.div 
                key={curso.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white rounded-[2.5rem] overflow-hidden shadow-xl hover:shadow-2xl transition-all border border-gray-100 group flex flex-col h-full"
              >
                <div className="relative aspect-video overflow-hidden">
                  <img 
                    src={curso.imagem_url || `https://picsum.photos/seed/${curso.id}/800/600`} 
                    alt={curso.titulo} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-blue-950/80 backdrop-blur-md text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                      {category.titulo}
                    </span>
                  </div>
                </div>
                
                <div className="p-8 flex flex-col flex-1">
                  <div className="flex items-center space-x-2 text-orange-600 mb-4">
                    <Clock size={16} />
                    <span className="text-xs font-bold uppercase tracking-widest">{curso.carga_horaria}</span>
                  </div>
                  
                  <h3 className="text-2xl font-black text-blue-950 mb-4 group-hover:text-orange-600 transition-colors leading-tight">
                    {curso.titulo}
                  </h3>
                  
                  <p className="text-gray-500 font-medium text-sm mb-8 line-clamp-3 leading-relaxed">
                    {curso.descricao_curta}
                  </p>
                  
                  <div className="mt-auto">
                    <Link 
                      to={`/cursos/${curso.slug}`}
                      className="w-full bg-gray-50 hover:bg-orange-600 text-blue-950 hover:text-white py-4 rounded-2xl font-black transition-all flex items-center justify-center group/btn"
                    >
                      <span>Ver Detalhes</span>
                      <ArrowRight className="ml-2 h-5 w-5 group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-32 bg-white rounded-[3rem] shadow-sm border-2 border-dashed border-gray-200">
            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-8">
              <GraduationCap className="h-12 w-12 text-gray-300" />
            </div>
            <h3 className="text-3xl font-black text-blue-950 mb-4">Novos cursos chegando em breve!</h3>
            <p className="text-gray-500 text-xl font-medium max-w-md mx-auto mb-10">
              Estamos preparando conteúdos incríveis para esta área. Fique atento às novidades.
            </p>
            <Link 
              to="/" 
              className="inline-flex items-center bg-blue-950 text-white font-black px-10 py-5 rounded-2xl hover:bg-orange-600 transition-all shadow-xl"
            >
              Ver outras categorias
            </Link>
          </div>
        )}
      </main>

      {/* Footer CTA */}
      <section className="bg-orange-600 py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-5xl font-black text-white mb-8">Não encontrou o que procurava?</h2>
          <p className="text-orange-100 text-xl mb-12 max-w-2xl mx-auto font-medium">
            Entre em contato conosco e tire suas dúvidas sobre nossos cursos e modalidades.
          </p>
          <a 
            href="https://wa.me/557133334444" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center bg-white text-orange-600 font-black px-12 py-5 rounded-full text-xl shadow-2xl hover:scale-105 transition-transform"
          >
            Falar com um Consultor
          </a>
        </div>
      </section>
    </div>
  );
}
