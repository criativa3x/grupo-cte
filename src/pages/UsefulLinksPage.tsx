import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import UsefulLinksGrid from '../components/UsefulLinksGrid';
import { motion } from 'motion/react';

export default function UsefulLinksPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-black text-blue-950 mb-4">Central de Sistemas</h1>
          <p className="text-gray-500 font-medium max-w-2xl mx-auto">
            Acesso rápido e seguro aos sistemas e ferramentas utilizados pela equipe do Grupo CTE.
          </p>
        </motion.div>

        <UsefulLinksGrid />
      </main>

      <Footer />
    </div>
  );
}
