import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Logo } from '../common/Logo';
import {
  Menu,
  X,
  User as UserIcon,
  Globe,
  LogOut,
  LayoutDashboard,
  ShieldAlert,
  ChevronDown,
  BookOpen,
  Sparkles,
  ArrowRight,
  Home,
  Info,
  GraduationCap,
  Calendar,
  FileText,
  Handshake,
  Mail
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    language,
    setLanguage,
    t,
    currentUser,
    logout,
    activeTab,
    setActiveTab
  } = useApp();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  const navItems = [
    { id: 'home', label: t.nav.home, icon: Home },
    { id: 'about', label: t.nav.about, icon: Info },
    { id: 'academy', label: t.nav.academy, icon: BookOpen },
    { id: 'events', label: t.nav.events, icon: Calendar },
    { id: 'blog', label: t.nav.blog, icon: FileText },
    { id: 'partners', label: t.nav.partners, icon: Handshake },
    { id: 'contact', label: t.nav.contact, icon: Mail }
  ];

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    setIsMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            {/* Logo */}
            <div onClick={() => handleNavClick('home')} className="cursor-pointer scale-110">
              <Logo variant="full" size="lg" />
            </div>

            {/* Right Action Tools: Language, Profile/Auth, & Burger Menu Trigger */}
            <div className="flex items-center gap-3">
              
             

              {/* User Profile or Auth Buttons */}
              {currentUser ? (
                <div className="relative">
                  <button
                    onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                    className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.firstName}
                      className="w-8 h-8 rounded-full object-cover border border-[#E63946]"
                    />
                    <div className="text-left text-xs hidden sm:block">
                      <div className="font-bold text-gray-900 leading-none">{currentUser.firstName}</div>
                      <div className="text-[10px] text-rose-600 font-semibold capitalize mt-0.5">{currentUser.role}</div>
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-gray-400 ml-1" />
                  </button>

                  {/* Profile Dropdown */}
                  {isProfileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-xs font-bold text-gray-900">{currentUser.firstName} {currentUser.lastName}</p>
                        <p className="text-[11px] text-gray-500 truncate">{currentUser.email}</p>
                      </div>

                      <button
                        onClick={() => {
                          setActiveTab('dashboard');
                          setIsProfileDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-xs font-medium text-gray-700 hover:bg-rose-50 hover:text-[#B72430] flex items-center gap-2 transition-colors cursor-pointer"
                      >
                        <LayoutDashboard className="w-4 h-4 text-[#E63946]" />
                        <span>{t.nav.dashboard}</span>
                      </button>

                      {currentUser.role === 'admin' && (
                        <button
                          onClick={() => {
                            setActiveTab('admin');
                            setIsProfileDropdownOpen(false);
                          }}
                          className="w-full text-left px-4 py-2 text-xs font-medium text-purple-700 hover:bg-purple-50 flex items-center gap-2 transition-colors cursor-pointer"
                        >
                          <ShieldAlert className="w-4 h-4 text-purple-600" />
                          <span>{t.nav.admin}</span>
                        </button>
                      )}

                      <div className="border-t border-gray-100 my-1" />

                      <button
                        onClick={() => {
                          logout();
                          setIsProfileDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-xs font-medium text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Déconnexion</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleNavClick('login')}
                    className="px-3.5 py-2 rounded-xl bg-[#E63946] hover:bg-[#B72430] text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
                  >
                    {t.nav.login}
                  </button>
                </div>
              )}

              {/* Universal Burger Menu Button (for ALL screen sizes) */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-gray-800 transition-colors cursor-pointer border border-gray-200"
                aria-label="Menu principal"
              >
                {isMenuOpen ? <X className="w-6 h-6 text-[#E63946]" /> : <Menu className="w-6 h-6 text-gray-800" />}
                
              </button>

            </div>

          </div>
        </div>
      </header>

      {/* Slide-over Full Drawer Menu (Opens on Desktop and Mobile) */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
          {/* Backdrop overlay click to close */}
          <div className="absolute inset-0" onClick={() => setIsMenuOpen(false)} />

          {/* Drawer content */}
          <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between overflow-y-auto z-10 animate-in slide-in-from-right duration-300">
            
            <div className="p-6 space-y-6">
              
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <Logo variant="full" size="sm" />
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 cursor-pointer transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* User badge inside drawer */}
              {currentUser ? (
                <div className="p-4 rounded-2xl bg-rose-50/60 border border-rose-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.firstName}
                      className="w-10 h-10 rounded-full object-cover border-2 border-[#E63946]"
                    />
                    <div>
                      <p className="text-xs font-black text-gray-900">{currentUser.firstName} {currentUser.lastName}</p>
                      <p className="text-[10px] text-[#B72430] font-bold">{currentUser.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setActiveTab('dashboard');
                      setIsMenuOpen(false);
                    }}
                    className="p-2 rounded-xl bg-[#E63946] text-white text-xs font-bold hover:bg-[#B72430] transition-colors cursor-pointer"
                  >
                    Espace
                  </button>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-gradient-to-r from-rose-50 to-pink-50 border border-rose-100 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-extrabold text-gray-900">Bienvenue sur IT-LeadHER</p>
                    <p className="text-[10px] text-gray-500">Rejoignez la communauté de leaders tech.</p>
                  </div>
                  <button
                    onClick={() => {
                      setActiveTab('login');
                      setIsMenuOpen(false);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-[#E63946] text-white text-xs font-bold hover:bg-[#B72430] transition-colors cursor-pointer"
                  >
                    Se connecter
                  </button>
                </div>
              )}

              {/* Navigation Items */}
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-3 mb-2">
                  Navigation
                </p>

                {navItems.map(item => {
                  const IconComp = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavClick(item.id)}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                        isActive
                          ? 'bg-[#E63946] text-white shadow-md'
                          : 'text-gray-700 hover:bg-rose-50 hover:text-[#B72430]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <IconComp className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#E63946]'}`} />
                        <span>{item.label}</span>
                      </div>
                      <ArrowRight className={`w-3.5 h-3.5 opacity-60 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                    </button>
                  );
                })}
              </div>

            </div>

            {/* Drawer Footer */}
            <div className="p-6 bg-slate-50 border-t border-gray-100 space-y-4">
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>Langue de la plateforme</span>
                <button
                  onClick={() => setLanguage(language === 'fr' ? 'en' : 'fr')}
                  className="font-bold text-[#E63946] underline cursor-pointer"
                >
                  {language === 'fr' ? 'Switch to English' : 'Passer en Français'}
                </button>
              </div>

              {currentUser && (
                <button
                  onClick={() => {
                    logout();
                    setIsMenuOpen(false);
                  }}
                  className="w-full py-3 rounded-xl bg-red-50 text-red-600 font-bold text-xs flex items-center justify-center gap-2 hover:bg-red-100 transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Se Déconnecter</span>
                </button>
              )}

              <p className="text-[10px] text-center text-gray-400">
                © 2026 IT-LeadHER • Tous droits réservés.
              </p>
            </div>

          </div>
        </div>
      )}
    </>
  );
};
