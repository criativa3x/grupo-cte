import React from 'react';
import { Facebook, Instagram, MapPin, Mail, Phone } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-blue-950 text-gray-300 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2">
            <img 
              src="https://res.cloudinary.com/dapsovbs5/image/upload/v1774648783/logo_kb9nkn.png" 
              alt="Grupo CTE Logo" 
              className="h-12 w-auto mb-8 brightness-0 invert"
              referrerPolicy="no-referrer"
            />
            <p className="text-gray-400 text-lg leading-relaxed max-w-md">
              Transformando vidas através da educação e do encaminhamento profissional. O seu futuro começa aqui.
            </p>
          </div>

          <div>
            <h4 className="text-xl font-black text-white mb-8">Links Úteis</h4>
            <ul className="space-y-4">
              <li><a href="/quero-estagiar" className="hover:text-orange-600 transition-colors">Quero Estagiar</a></li>
              <li><a href="/para-empresas" className="hover:text-orange-600 transition-colors">Para Empresas</a></li>
              <li><a href="/vagas" className="hover:text-orange-600 transition-colors">Vagas Abertas</a></li>
              <li><a href="/#cursos" className="hover:text-orange-600 transition-colors">Nossos Cursos</a></li>
              <li><a href="/quem-somos" className="hover:text-orange-600 transition-colors">Quem Somos</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-xl font-black text-white mb-8">Contato</h4>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3 text-gray-400">
                <Phone size={18} className="text-orange-600 mt-1" />
                <div className="flex flex-col space-y-1">
                  <a 
                    href="https://wa.me/5571981586484?text=Olá!%20Gostaria%20de%20informações%20sobre%20o%20Grupo%20CTE." 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:text-orange-600 transition-colors"
                  >
                    71 98158-6484
                  </a>
                  <span className="text-sm">71 99975-6746</span>
                </div>
              </li>
              <li className="flex items-center space-x-3 text-gray-400">
                <Mail size={18} className="text-orange-600" />
                <a href="mailto:contato@grupocte.com.br" className="hover:text-orange-600 transition-colors">
                  contato@grupocte.com.br
                </a>
              </li>
              <li className="flex items-start space-x-3 text-gray-400">
                <MapPin size={18} className="text-orange-600 mt-1 shrink-0" />
                <span className="text-sm leading-relaxed">
                  Rua Duque de Caxias, 88, Centro,<br />
                  Camaçari BA, 42800-031, Brasil
                </span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xl font-black text-white mb-8">Siga-nos</h4>
            <div className="flex space-x-4 mb-8">
              <a href="https://www.facebook.com/ctegrupo" target="_blank" rel="noopener noreferrer" className="bg-white/5 hover:bg-orange-600 p-3 rounded-xl transition-all">
                <Facebook size={20} />
              </a>
              <a href="https://www.instagram.com/grupocte/" target="_blank" rel="noopener noreferrer" className="bg-white/5 hover:bg-orange-600 p-3 rounded-xl transition-all">
                <Instagram size={20} />
              </a>
            </div>
            <a href="/links-uteis" className="text-xs text-gray-500 hover:text-orange-600 transition-colors font-bold uppercase tracking-widest">
              Portal do Colaborador
            </a>
          </div>
        </div>
        
        <div className="border-t border-white/10 pt-8 text-center text-gray-500 text-sm font-medium">
          <p>&copy; {new Date().getFullYear()} Grupo CTE. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
