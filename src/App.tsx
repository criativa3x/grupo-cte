/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Menu, X, ChevronRight, Monitor, HeartPulse, Briefcase, Scissors, Quote, Facebook, Instagram, Linkedin, MapPin, Mail, Phone } from 'lucide-react';

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen font-sans text-gray-800">
      {/* 1. Header */}
      <header className="sticky top-0 z-50 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold text-orange-600">Grupo CTE</span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              <a href="#inicio" className="text-gray-600 hover:text-orange-600 font-medium transition-colors">Início</a>
              <a href="#cursos" className="text-gray-600 hover:text-orange-600 font-medium transition-colors">Cursos</a>
              <a href="#estagios" className="text-gray-600 hover:text-orange-600 font-medium transition-colors">Estágios</a>
              <a href="#quem-somos" className="text-gray-600 hover:text-orange-600 font-medium transition-colors">Quem Somos</a>
            </nav>

            {/* CTA Button */}
            <div className="hidden md:flex items-center">
              <a href="#contato" className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2.5 rounded-full font-medium transition-colors shadow-md hover:shadow-lg">
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

      {/* 2. Hero Section */}
      <section id="inicio" className="relative bg-gray-900 text-white">
        <div className="absolute inset-0 overflow-hidden">
          <img
            src="https://picsum.photos/seed/students/1920/1080?blur=2"
            alt="Jovens estudando"
            className="w-full h-full object-cover opacity-40"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/80 to-transparent"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32 flex flex-col justify-center min-h-[80vh]">
          <div className="max-w-3xl">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight mb-6">
              O seu futuro começa aqui. <span className="text-orange-500">Capacitação e Estágio</span> num só lugar.
            </h1>
            <p className="text-lg sm:text-xl text-gray-300 mb-10 max-w-2xl leading-relaxed">
              Conectando jovens talentos ao mercado de trabalho desde 1994. Transforme o seu potencial em carreira de sucesso com o Grupo CTE.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="#cursos" className="inline-flex justify-center items-center bg-orange-600 hover:bg-orange-700 text-white px-8 py-4 rounded-full font-bold text-lg transition-all shadow-lg hover:shadow-orange-600/30">
                Ver Cursos
              </a>
              <a href="#estagios" className="inline-flex justify-center items-center bg-transparent border-2 border-white hover:bg-white hover:text-gray-900 text-white px-8 py-4 rounded-full font-bold text-lg transition-all">
                Vagas de Estágio
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Vagas de Estágio em Destaque */}
      <section id="estagios" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">As melhores oportunidades de Estágio</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">Vagas exclusivas para os nossos alunos e jovens talentos da região.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-100 flex flex-col">
              <div className="p-8 flex-grow">
                <div className="inline-block px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full mb-4 uppercase tracking-wide">Ativo</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Estágio em Atendimento</h3>
                <div className="space-y-2 mb-6">
                  <div className="flex items-center text-gray-600">
                    <MapPin className="h-4 w-4 mr-2 text-orange-500" />
                    <span>Camaçari - BA</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Briefcase className="h-4 w-4 mr-2 text-orange-500" />
                    <span>Bolsa Auxílio: <strong className="text-gray-900">R$ 600,00</strong> + Transporte</span>
                  </div>
                </div>
                <p className="text-gray-500 text-sm line-clamp-3">Atendimento ao público, organização de documentos e suporte administrativo geral na recepção da clínica.</p>
              </div>
              <div className="px-8 pb-8 pt-2">
                <button className="w-full bg-gray-900 hover:bg-orange-600 text-white font-medium py-3 rounded-xl transition-colors">
                  Candidatar-se
                </button>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-100 flex flex-col">
              <div className="p-8 flex-grow">
                <div className="inline-block px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full mb-4 uppercase tracking-wide">Ativo</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Auxiliar de TI (Estágio)</h3>
                <div className="space-y-2 mb-6">
                  <div className="flex items-center text-gray-600">
                    <MapPin className="h-4 w-4 mr-2 text-orange-500" />
                    <span>Dias d'Ávila - BA</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Briefcase className="h-4 w-4 mr-2 text-orange-500" />
                    <span>Bolsa Auxílio: <strong className="text-gray-900">R$ 750,00</strong> + Transporte</span>
                  </div>
                </div>
                <p className="text-gray-500 text-sm line-clamp-3">Suporte técnico básico, manutenção preventiva de computadores e auxílio na gestão da rede local.</p>
              </div>
              <div className="px-8 pb-8 pt-2">
                <button className="w-full bg-gray-900 hover:bg-orange-600 text-white font-medium py-3 rounded-xl transition-colors">
                  Candidatar-se
                </button>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-100 flex flex-col">
              <div className="p-8 flex-grow">
                <div className="inline-block px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full mb-4 uppercase tracking-wide">Ativo</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Estágio em RH</h3>
                <div className="space-y-2 mb-6">
                  <div className="flex items-center text-gray-600">
                    <MapPin className="h-4 w-4 mr-2 text-orange-500" />
                    <span>Camaçari - BA (Polo)</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Briefcase className="h-4 w-4 mr-2 text-orange-500" />
                    <span>Bolsa Auxílio: <strong className="text-gray-900">R$ 800,00</strong> + Benefícios</span>
                  </div>
                </div>
                <p className="text-gray-500 text-sm line-clamp-3">Apoio no recrutamento e seleção, triagem de currículos e rotinas de departamento pessoal.</p>
              </div>
              <div className="px-8 pb-8 pt-2">
                <button className="w-full bg-gray-900 hover:bg-orange-600 text-white font-medium py-3 rounded-xl transition-colors">
                  Candidatar-se
                </button>
              </div>
            </div>
          </div>
          
          <div className="mt-12 text-center">
            <a href="#todas-vagas" className="inline-flex items-center text-orange-600 font-bold hover:text-orange-700 transition-colors">
              Ver todas as vagas disponíveis <ChevronRight className="ml-1 h-5 w-5" />
            </a>
          </div>
        </div>
      </section>

      {/* 4. Nossos Cursos */}
      <section id="cursos" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Escolha a sua área de atuação</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">Cursos práticos e atualizados com as exigências do mercado de trabalho.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Category 1 */}
            <a href="#curso-informatica" className="group block bg-gray-50 rounded-2xl p-8 hover:bg-orange-50 transition-colors duration-300 border border-transparent hover:border-orange-100 text-center">
              <div className="mx-auto w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-6 group-hover:scale-110 transition-transform duration-300">
                <Monitor className="h-8 w-8 text-orange-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Informática e Tecnologia</h3>
              <p className="text-orange-600 font-medium flex items-center justify-center text-sm">
                Ver cursos da área <ChevronRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </p>
            </a>

            {/* Category 2 */}
            <a href="#curso-saude" className="group block bg-gray-50 rounded-2xl p-8 hover:bg-orange-50 transition-colors duration-300 border border-transparent hover:border-orange-100 text-center">
              <div className="mx-auto w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-6 group-hover:scale-110 transition-transform duration-300">
                <HeartPulse className="h-8 w-8 text-orange-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Saúde e Bem-estar</h3>
              <p className="text-orange-600 font-medium flex items-center justify-center text-sm">
                Ver cursos da área <ChevronRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </p>
            </a>

            {/* Category 3 */}
            <a href="#curso-adm" className="group block bg-gray-50 rounded-2xl p-8 hover:bg-orange-50 transition-colors duration-300 border border-transparent hover:border-orange-100 text-center">
              <div className="mx-auto w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-6 group-hover:scale-110 transition-transform duration-300">
                <Briefcase className="h-8 w-8 text-orange-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Administração e Negócios</h3>
              <p className="text-orange-600 font-medium flex items-center justify-center text-sm">
                Ver cursos da área <ChevronRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </p>
            </a>

            {/* Category 4 */}
            <a href="#curso-beleza" className="group block bg-gray-50 rounded-2xl p-8 hover:bg-orange-50 transition-colors duration-300 border border-transparent hover:border-orange-100 text-center">
              <div className="mx-auto w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-6 group-hover:scale-110 transition-transform duration-300">
                <Scissors className="h-8 w-8 text-orange-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Beleza e Estética</h3>
              <p className="text-orange-600 font-medium flex items-center justify-center text-sm">
                Ver cursos da área <ChevronRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </p>
            </a>
          </div>
        </div>
      </section>

      {/* 5. Casos de Sucesso */}
      <section className="py-24 bg-orange-500 relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10 pointer-events-none">
          <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-white"></div>
          <div className="absolute bottom-10 right-10 w-64 h-64 rounded-full bg-white"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Quem faz, aprova e recomenda.</h2>
            <p className="text-orange-100 text-lg max-w-2xl mx-auto">Conheça a história de quem transformou a sua vida através da educação e do estágio.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-white rounded-3xl p-8 shadow-xl relative mt-8">
              <div className="absolute -top-6 left-8 bg-orange-600 rounded-full p-3 shadow-lg">
                <Quote className="h-6 w-6 text-white" />
              </div>
              <p className="text-gray-700 italic mb-6 mt-4 text-lg leading-relaxed">
                "Graças ao curso de Informática do CTE, consegui o meu primeiro estágio na área administrativa. A indicação da agência foi fundamental!"
              </p>
              <div className="flex items-center">
                <img src="https://picsum.photos/seed/face1/100/100" alt="Lucas Silva" className="w-12 h-12 rounded-full object-cover mr-4" referrerPolicy="no-referrer" />
                <div>
                  <h4 className="font-bold text-gray-900">Lucas Silva</h4>
                  <p className="text-sm text-gray-500">Aluno de Informática</p>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-white rounded-3xl p-8 shadow-xl relative mt-8 md:mt-0">
              <div className="absolute -top-6 left-8 bg-orange-600 rounded-full p-3 shadow-lg">
                <Quote className="h-6 w-6 text-white" />
              </div>
              <p className="text-gray-700 italic mb-6 mt-4 text-lg leading-relaxed">
                "A didática dos professores é excelente. O curso de Auxiliar de Farmácia abriu portas que eu nem imaginava. Hoje estou empregada."
              </p>
              <div className="flex items-center">
                <img src="https://picsum.photos/seed/face2/100/100" alt="Mariana Costa" className="w-12 h-12 rounded-full object-cover mr-4" referrerPolicy="no-referrer" />
                <div>
                  <h4 className="font-bold text-gray-900">Mariana Costa</h4>
                  <p className="text-sm text-gray-500">Aluna de Saúde</p>
                </div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-white rounded-3xl p-8 shadow-xl relative mt-8 md:mt-12">
              <div className="absolute -top-6 left-8 bg-orange-600 rounded-full p-3 shadow-lg">
                <Quote className="h-6 w-6 text-white" />
              </div>
              <p className="text-gray-700 italic mb-6 mt-4 text-lg leading-relaxed">
                "O encaminhamento para estágio do CTE funciona de verdade. Em menos de 2 meses de curso já estava fazendo entrevistas."
              </p>
              <div className="flex items-center">
                <img src="https://picsum.photos/seed/face3/100/100" alt="Pedro Santos" className="w-12 h-12 rounded-full object-cover mr-4" referrerPolicy="no-referrer" />
                <div>
                  <h4 className="font-bold text-gray-900">Pedro Santos</h4>
                  <p className="text-sm text-gray-500">Aluno de Administração</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Footer */}
      <footer className="bg-gray-900 text-gray-300 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
            {/* Column 1 */}
            <div>
              <span className="text-2xl font-bold text-white mb-6 block">Grupo CTE</span>
              <p className="text-gray-400 mb-6 leading-relaxed">
                Instituição de ensino focada em cursos profissionalizantes e agência de encaminhamento para estágios, conectando jovens ao mercado de trabalho desde 1994.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-orange-600 hover:text-white transition-colors">
                  <Facebook className="h-5 w-5" />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-orange-600 hover:text-white transition-colors">
                  <Instagram className="h-5 w-5" />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-orange-600 hover:text-white transition-colors">
                  <Linkedin className="h-5 w-5" />
                </a>
              </div>
            </div>

            {/* Column 2 */}
            <div>
              <h4 className="text-lg font-bold text-white mb-6">Links Úteis</h4>
              <ul className="space-y-3">
                <li><a href="#" className="hover:text-orange-500 transition-colors flex items-center"><ChevronRight className="h-4 w-4 mr-2" /> Portal do Aluno</a></li>
                <li><a href="#" className="hover:text-orange-500 transition-colors flex items-center"><ChevronRight className="h-4 w-4 mr-2" /> Webmail</a></li>
                <li><a href="#" className="hover:text-orange-500 transition-colors flex items-center"><ChevronRight className="h-4 w-4 mr-2" /> Sistema Sponte</a></li>
                <li><a href="#" className="hover:text-orange-500 transition-colors flex items-center"><ChevronRight className="h-4 w-4 mr-2" /> Painel de Vagas</a></li>
                <li><a href="#" className="hover:text-orange-500 transition-colors flex items-center"><ChevronRight className="h-4 w-4 mr-2" /> Trabalhe Conosco</a></li>
              </ul>
            </div>

            {/* Column 3 */}
            <div>
              <h4 className="text-lg font-bold text-white mb-6">Contacto e Morada</h4>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <MapPin className="h-6 w-6 text-orange-500 mr-3 flex-shrink-0 mt-0.5" />
                  <span>Av. Comercial, 123 - Centro<br />Camaçari - BA, 42800-000</span>
                </li>
                <li className="flex items-center">
                  <Phone className="h-5 w-5 text-orange-500 mr-3 flex-shrink-0" />
                  <span>(71) 3333-4444</span>
                </li>
                <li className="flex items-center">
                  <Mail className="h-5 w-5 text-orange-500 mr-3 flex-shrink-0" />
                  <span>contato@grupocte.com.br</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-500 mb-4 md:mb-0">
              &copy; {new Date().getFullYear()} Grupo CTE. Todos os direitos reservados.
            </p>
            <div className="flex space-x-4 text-sm text-gray-500">
              <a href="#" className="hover:text-white transition-colors">Política de Privacidade</a>
              <a href="#" className="hover:text-white transition-colors">Termos de Uso</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
