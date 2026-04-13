/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import AboutUs from './pages/AboutUs';
import VagasPage from './pages/VagasPage';
import CourseDetails from './pages/CourseDetails';
import CategoryDetails from './pages/CategoryDetails';
import ForStudents from './pages/ForStudents';
import ForCompanies from './pages/ForCompanies';
import StudentRegistration from './pages/StudentRegistration';
import UsefulLinksPage from './pages/UsefulLinksPage';
import AdminPanel from './pages/AdminPanel';
import LoginPage from './pages/LoginPage';
import { Toaster } from 'sonner';
import { supabase } from './lib/supabase';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="w-12 h-12 border-4 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

export default function App() {
  return (
    <Router>
      <Toaster position="top-right" richColors />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/quem-somos" element={<AboutUs />} />
        <Route path="/vagas" element={<VagasPage />} />
        <Route path="/cursos/:slug" element={<CourseDetails />} />
        <Route path="/categorias/:id" element={<CategoryDetails />} />
        <Route path="/quero-estagiar" element={<ForStudents />} />
        <Route path="/para-empresas" element={<ForCompanies />} />
        <Route path="/cadastro-estagiario" element={<StudentRegistration />} />
        <Route path="/links-uteis" element={<UsefulLinksPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route 
          path="/admin/*" 
          element={
            <ProtectedRoute>
              <AdminPanel />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  );
}
