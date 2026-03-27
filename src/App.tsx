/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Menu, X, ChevronRight, Quote, Facebook, Instagram, Linkedin, MapPin, Mail, Phone, Briefcase } from 'lucide-react';

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen font-sans text-gray-800">
      {/* 1. Header */}
      <header className="sticky top-0 z-50 bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-black text-orange-600 tracking-tighter">Grupo CTE</span>
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

      {/* 2. Hero Section - Rich Banner */}
      <section id="inicio" className="relative min-h-[85vh] flex items-center overflow-hidden bg-blue-950">
        <div className="absolute inset-0">
          <img
            src="https://picsum.photos/seed/learning-group/1920/1080"
            alt="Jovens em ambiente de aprendizado"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          {/* Organic Blend Overlay: Navy Blue and Orange hints */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-950/95 via-blue-950/70 to-orange-600/20"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(234,88,12,0.15),transparent_50%)]"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-3xl">
            <div className="inline-block px-4 py-1.5 bg-orange-600/90 text-white text-sm font-bold rounded-full mb-6 backdrop-blur-sm">
              DESDE 1994 TRANSFORMANDO VIDAS
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.1] mb-8">
              O seu futuro começa aqui. <br />
              <span className="text-orange-500">Capacitação e Estágio</span> <br />
              num só lugar.
            </h1>
            <p className="text-xl sm:text-2xl text-gray-200 mb-12 max-w-2xl leading-relaxed font-medium">
              Capacitação profissional e encaminhamento para estágio em um só lugar. Conectamos você às melhores empresas.
            </p>
            <div className="flex flex-col sm:flex-row gap-6">
              <a href="#cursos" className="inline-flex justify-center items-center bg-orange-600 hover:bg-orange-700 text-white px-10 py-5 rounded-full font-black text-xl transition-all shadow-[0_10px_30px_rgba(234,88,12,0.5)] hover:-translate-y-1">
                Ver Cursos
              </a>
              <a href="#estagios" className="inline-flex justify-center items-center bg-white/10 hover:bg-white/20 backdrop-blur-md border-2 border-white/30 text-white px-10 py-5 rounded-full font-black text-xl transition-all hover:-translate-y-1">
                Vagas de Estágio
              </a>
            </div>
            
            {/* Added CTA prominent in Hero */}
            <div className="mt-12 flex items-center gap-4 text-white/80">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <img 
                    key={i}
                    src={`https://picsum.photos/seed/user${i}/100/100`} 
                    className="w-10 h-10 rounded-full border-2 border-blue-950 object-cover" 
                    alt="Aluno"
                    referrerPolicy="no-referrer"
                  />
                ))}
              </div>
              <p className="text-sm font-semibold">
                <span className="text-orange-500">+15.000</span> alunos já encaminhados
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Vagas de Estágio Humanizadas */}
      <section id="estagios" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">As melhores oportunidades de Estágio</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-medium">Conectamos jovens talentos às empresas que buscam renovação e energia.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {/* Card 1 */}
            <div className="bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 group">
              <div className="p-10 flex flex-col items-center text-center">
                <img 
                  src="https://picsum.photos/seed/receptionist/200/200" 
                  alt="Atendimento" 
                  className="w-20 h-20 rounded-full border-2 border-orange-500 mb-6 object-cover shadow-lg group-hover:scale-110 transition-transform"
                  referrerPolicy="no-referrer"
                />
                <div className="inline-block px-4 py-1 bg-green-100 text-green-700 text-xs font-black rounded-full mb-4 uppercase tracking-widest">Vaga Aberta</div>
                <h3 className="text-2xl font-black text-gray-900 mb-4">Estágio em Atendimento</h3>
                <div className="space-y-3 mb-8 w-full">
                  <div className="flex items-center justify-center text-gray-600 font-semibold">
                    <MapPin className="h-5 w-5 mr-2 text-orange-500" />
                    <span>Camaçari - BA</span>
                  </div>
                  <div className="flex items-center justify-center text-gray-600 font-semibold">
                    <Briefcase className="h-5 w-5 mr-2 text-orange-500" />
                    <span>Bolsa: <strong className="text-gray-900">R$ 600,00</strong></span>
                  </div>
                </div>
                <button className="w-full bg-blue-950 hover:bg-orange-600 text-white font-black py-4 rounded-2xl transition-all shadow-lg">
                  Candidatar-se
                </button>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 group">
              <div className="p-10 flex flex-col items-center text-center">
                <img 
                  src="https://picsum.photos/seed/it-support/200/200" 
                  alt="TI" 
                  className="w-20 h-20 rounded-full border-2 border-orange-500 mb-6 object-cover shadow-lg group-hover:scale-110 transition-transform"
                  referrerPolicy="no-referrer"
                />
                <div className="inline-block px-4 py-1 bg-green-100 text-green-700 text-xs font-black rounded-full mb-4 uppercase tracking-widest">Vaga Aberta</div>
                <h3 className="text-2xl font-black text-gray-900 mb-4">Auxiliar de TI (Estágio)</h3>
                <div className="space-y-3 mb-8 w-full">
                  <div className="flex items-center justify-center text-gray-600 font-semibold">
                    <MapPin className="h-5 w-5 mr-2 text-orange-500" />
                    <span>Dias d'Ávila - BA</span>
                  </div>
                  <div className="flex items-center justify-center text-gray-600 font-semibold">
                    <Briefcase className="h-5 w-5 mr-2 text-orange-500" />
                    <span>Bolsa: <strong className="text-gray-900">R$ 750,00</strong></span>
                  </div>
                </div>
                <button className="w-full bg-blue-950 hover:bg-orange-600 text-white font-black py-4 rounded-2xl transition-all shadow-lg">
                  Candidatar-se
                </button>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 group">
              <div className="p-10 flex flex-col items-center text-center">
                <img 
                  src="https://picsum.photos/seed/hr-intern/200/200" 
                  alt="RH" 
                  className="w-20 h-20 rounded-full border-2 border-orange-500 mb-6 object-cover shadow-lg group-hover:scale-110 transition-transform"
                  referrerPolicy="no-referrer"
                />
                <div className="inline-block px-4 py-1 bg-green-100 text-green-700 text-xs font-black rounded-full mb-4 uppercase tracking-widest">Vaga Aberta</div>
                <h3 className="text-2xl font-black text-gray-900 mb-4">Estágio em RH</h3>
                <div className="space-y-3 mb-8 w-full">
                  <div className="flex items-center justify-center text-gray-600 font-semibold">
                    <MapPin className="h-5 w-5 mr-2 text-orange-500" />
                    <span>Camaçari - BA (Polo)</span>
                  </div>
                  <div className="flex items-center justify-center text-gray-600 font-semibold">
                    <Briefcase className="h-5 w-5 mr-2 text-orange-500" />
                    <span>Bolsa: <strong className="text-gray-900">R$ 800,00</strong></span>
                  </div>
                </div>
                <button className="w-full bg-blue-950 hover:bg-orange-600 text-white font-black py-4 rounded-2xl transition-all shadow-lg">
                  Candidatar-se
                </button>
              </div>
            </div>
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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Category 1 */}
            <div className="group relative bg-gray-900 rounded-3xl overflow-hidden aspect-[4/5] shadow-2xl transition-all hover:-translate-y-2">
              <img 
                src="https://picsum.photos/seed/coding/600/800" 
                alt="Informática" 
                className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:scale-110 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-blue-950 via-transparent to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <h3 className="text-2xl font-black text-white mb-4">Informática e Tecnologia</h3>
                <a href="#curso-informatica" className="inline-flex items-center text-orange-500 font-bold group-hover:text-orange-400 transition-colors">
                  Ver cursos <ChevronRight className="ml-1 h-5 w-5" />
                </a>
              </div>
            </div>

            {/* Category 2 */}
            <div className="group relative bg-gray-900 rounded-3xl overflow-hidden aspect-[4/5] shadow-2xl transition-all hover:-translate-y-2">
              <img 
                src="https://picsum.photos/seed/health-worker/600/800" 
                alt="Saúde" 
                className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:scale-110 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-blue-950 via-transparent to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <h3 className="text-2xl font-black text-white mb-4">Saúde e Bem-estar</h3>
                <a href="#curso-saude" className="inline-flex items-center text-orange-500 font-bold group-hover:text-orange-400 transition-colors">
                  Ver cursos <ChevronRight className="ml-1 h-5 w-5" />
                </a>
              </div>
            </div>

            {/* Category 3 */}
            <div className="group relative bg-gray-900 rounded-3xl overflow-hidden aspect-[4/5] shadow-2xl transition-all hover:-translate-y-2">
              <img 
                src="https://picsum.photos/seed/business-meeting/600/800" 
                alt="Administração" 
                className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:scale-110 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-blue-950 via-transparent to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <h3 className="text-2xl font-black text-white mb-4">Administração e Negócios</h3>
                <a href="#curso-adm" className="inline-flex items-center text-orange-500 font-bold group-hover:text-orange-400 transition-colors">
                  Ver cursos <ChevronRight className="ml-1 h-5 w-5" />
                </a>
              </div>
            </div>

            {/* Category 4 */}
            <div className="group relative bg-gray-900 rounded-3xl overflow-hidden aspect-[4/5] shadow-2xl transition-all hover:-translate-y-2">
              <img 
                src="https://picsum.photos/seed/beauty-salon/600/800" 
                alt="Beleza" 
                className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:scale-110 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-blue-950 via-transparent to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <h3 className="text-2xl font-black text-white mb-4">Beleza e Estética</h3>
                <a href="#curso-beleza" className="inline-flex items-center text-orange-500 font-bold group-hover:text-orange-400 transition-colors">
                  Ver cursos <ChevronRight className="ml-1 h-5 w-5" />
                </a>
              </div>
            </div>
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

      {/* 6. Footer */}
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
