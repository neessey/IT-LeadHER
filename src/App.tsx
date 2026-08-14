import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { AiCareerAssistantModal } from './components/layout/AiCareerAssistantModal';
import { FloatingAiButton } from './components/common/FloatingAiButton';
import { CertificateModal } from './components/common/CertificateModal';
import { Toast } from './components/common/Toast';

import { HomePage } from './components/pages/HomePage';
import { AboutPage } from './components/pages/AboutPage';
import { AcademyPage } from './components/pages/AcademyPage';
import { CourseDetailPage } from './components/pages/CourseDetailPage';
import { EventsPage } from './components/pages/EventsPage';
import { BlogPage } from './components/pages/BlogPage';
import { PartnersPage } from './components/pages/PartnersPage';
import { ContactPage } from './components/pages/ContactPage';
import { AuthPage } from './components/pages/AuthPage';
import { DashboardPage } from './components/pages/DashboardPage';
import { AdminDashboardPage } from './components/pages/AdminDashboardPage';
import { PrivacyPolicyPage } from './components/pages/PrivacyPolicyPage';
import CGU from './components/pages/CGUPage';


const AppContent: React.FC = () => {
  const { activeTab } = useApp();

  const renderView = () => {
    switch (activeTab) {
      case 'home':
        return <HomePage />;
      case 'about':
        return <AboutPage />;
      case 'programs':
      case 'community':
      case 'academy':
        return <AcademyPage />;
      case 'course-detail':
        return <CourseDetailPage />;
      case 'events':
        return <EventsPage />;
      case 'blog':
      case 'blog-detail':
        return <BlogPage />;
      case 'partners':
        return <PartnersPage />;
      case 'contact':
        return <ContactPage />;
      case 'login':
        return <AuthPage />;
      case 'dashboard':
        return <DashboardPage />;
      case 'admin':
        return <AdminDashboardPage />;
          case 'privacy':
            return <PrivacyPolicyPage />;
          case 'terms':
            return <CGU />;
      default:
        return <HomePage />;
    }
  };

return (
  <div className="min-h-screen flex flex-col bg-slate-50 text-gray-900 font-sans selection:bg-rose-100 selection:text-[#B72430]">
    {activeTab !== "admin" && <Navbar />}

    <main className="flex-1">
      {renderView()}
    </main>

    {activeTab !== "admin" && <Footer />}

    <FloatingAiButton />
    <AiCareerAssistantModal />
    <CertificateModal />
    <Toast />
  </div>
);
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
