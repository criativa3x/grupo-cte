import React from 'react';
import { motion } from 'motion/react';
import { Database, Mail, Globe, FileText, Monitor, ExternalLink } from 'lucide-react';

export default function UsefulLinksGrid() {
  const links = [
    {
      title: 'Sponte',
      subtitle: 'Sistema de Gestão',
      url: 'https://www.sponteeducacional.net.br/',
      icon: <Database className="w-8 h-8" />,
      color: 'bg-blue-50 text-blue-600',
      hoverColor: 'hover:border-blue-200 hover:shadow-blue-100'
    },
    {
      title: 'Outlook',
      subtitle: 'E-mail Corporativo',
      url: 'https://login.live.com/login.srf?wa=wsignin1.0&rpsnv=13&ct=1600796810&rver=7.0.6737.0&wp=MBI_SSL&wreply=https%3a%2f%2foutlook.live.com%2fmail%2f0%2finbox%2fid%2fAQQkADAwATNiZmYAZC0xODgAYi1hNTk3LTAwAi0wMAoAEAD%2fd%2bJTg6XLRrSJdEBPLxR%2b%3fnlp%3d1%26RpsCsrfState%3df9e8dde1-bdbb-c5aa-76ce-57904f74547f&id=292841&aadredir=1&CBCXT=out&lw=1&fl=dob%2cflname%2cwld&cobrandid=90015',
      icon: <Mail className="w-8 h-8" />,
      color: 'bg-sky-50 text-sky-600',
      hoverColor: 'hover:border-sky-200 hover:shadow-sky-100'
    },
    {
      title: 'Webmail',
      subtitle: 'Acesso Webmail',
      url: 'https://grupocte.com.br:2096/',
      icon: <Globe className="w-8 h-8" />,
      color: 'bg-indigo-50 text-indigo-600',
      hoverColor: 'hover:border-indigo-200 hover:shadow-indigo-100'
    },
    {
      title: 'Gerador de Contratos',
      subtitle: 'Gestão de Documentos',
      url: 'https://contrato.grupocte.com.br',
      icon: <FileText className="w-8 h-8" />,
      color: 'bg-orange-50 text-orange-600',
      hoverColor: 'hover:border-orange-200 hover:shadow-orange-100'
    },
    {
      title: 'Sistema SIG',
      subtitle: 'Gestão Interna',
      url: 'https://sig.grupocte.com.br',
      icon: <Monitor className="w-8 h-8" />,
      color: 'bg-purple-50 text-purple-600',
      hoverColor: 'hover:border-purple-200 hover:shadow-purple-100'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {links.map((link, idx) => (
        <motion.a
          key={idx}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.1 }}
          className={`bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm transition-all flex flex-col items-center text-center group ${link.hoverColor} hover:shadow-xl hover:-translate-y-1`}
        >
          <div className={`w-20 h-20 ${link.color} rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
            {link.icon}
          </div>
          <h3 className="text-xl font-black text-blue-950 mb-2">{link.title}</h3>
          <p className="text-gray-400 font-bold text-xs uppercase tracking-widest mb-6">{link.subtitle}</p>
          <div className="mt-auto flex items-center text-orange-600 font-black text-sm group-hover:translate-x-1 transition-transform">
            <span>Acessar Sistema</span>
            <ExternalLink size={16} className="ml-2" />
          </div>
        </motion.a>
      ))}
    </div>
  );
}
