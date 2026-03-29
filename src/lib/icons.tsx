import React from 'react';
import { Briefcase, Headset, UtensilsCrossed } from 'lucide-react';

export const getAreaIcon = (area: string, size: string = "h-10 w-10") => {
  const a = (area || '').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  
  if (a.includes('alimentacao')) {
    return <UtensilsCrossed className={`${size} text-white`} />;
  }
  
  if (a.includes('administracao') || a.includes('administrativo')) {
    return <Briefcase className={`${size} text-white`} />;
  }
  
  if (a.includes('atendimento')) {
    return <Headset className={`${size} text-white`} />;
  }
  
  return <Briefcase className={`${size} text-white`} />;
};
