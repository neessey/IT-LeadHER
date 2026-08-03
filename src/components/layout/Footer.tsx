import React from 'react';
import { useApp } from '../../context/AppContext';
import { Logo } from '../common/Logo';
import { Mail, Phone, MapPin, Linkedin, Twitter, Youtube, Heart, Globe, ArrowRight } from 'lucide-react';

export const Footer: React.FC = () => {
  const { t, setActiveTab, language } = useApp();

  const handleNav = (tab: string) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#212B36] text-white pt-16 pb-8 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-gray-800">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Logo variant="full" size="lg" className="text-white [&_span]:text-white" />
            <p className="text-gray-300 text-sm leading-relaxed max-w-sm">
              {t.hero.subtitle}
            </p>
            <div className="pt-2 flex items-center gap-3">
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-xl bg-gray-800 hover:bg-[#E63946] flex items-center justify-center text-gray-300 hover:text-white transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-xl bg-gray-800 hover:bg-[#E63946] flex items-center justify-center text-gray-300 hover:text-white transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-xl bg-gray-800 hover:bg-[#E63946] flex items-center justify-center text-gray-300 hover:text-white transition-colors">
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Programs & Academy */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-[#F2848F]">Formations & Offres</h4>
            <ul className="space-y-2 text-xs text-gray-300">
              <li><button onClick={() => handleNav('academy')} className="hover:text-white hover:underline cursor-pointer">Catalogue Formations</button></li>
              <li><button onClick={() => handleNav('academy')} className="hover:text-white hover:underline cursor-pointer">Certifications Tech</button></li>
              <li><button onClick={() => handleNav('events')} className="hover:text-white hover:underline cursor-pointer">Ateliers & Bootcamps</button></li>
              <li><button onClick={() => handleNav('partners')} className="hover:text-white hover:underline cursor-pointer">Réseau d'Entreprises</button></li>
              <li><button onClick={() => handleNav('events')} className="hover:text-white hover:underline cursor-pointer">Hackathons & Événements</button></li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-[#F2848F]">Plateforme</h4>
            <ul className="space-y-2 text-xs text-gray-300">
              <li><button onClick={() => handleNav('about')} className="hover:text-white hover:underline cursor-pointer">À propos d'IT-LeadHER</button></li>
              <li><button onClick={() => handleNav('academy')} className="hover:text-white hover:underline cursor-pointer">Académie E-Learning</button></li>
              <li><button onClick={() => handleNav('blog')} className="hover:text-white hover:underline cursor-pointer">Blog & Publications</button></li>
              <li><button onClick={() => handleNav('partners')} className="hover:text-white hover:underline cursor-pointer">Devenir Partenaire</button></li>
              <li><button onClick={() => handleNav('contact')} className="hover:text-white hover:underline cursor-pointer">FAQ & Contact</button></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-[#F2848F]">Newsletter</h4>
            <p className="text-xs text-gray-400">Rejoignez 5,000+ passionnées et recevez les meilleures opportunités tech.</p>
            <form onSubmit={(e) => { e.preventDefault(); alert(language === 'fr' ? 'Merci pour votre inscription !' : 'Thank you for subscribing!'); }} className="space-y-2">
              <input
                type="email"
                placeholder="Votre e-mail professionnel"
                required
                className="w-full px-3 py-2 rounded-xl bg-gray-800 border border-gray-700 text-xs text-white placeholder-gray-400 focus:outline-none focus:border-[#E63946]"
              />
              <button
                type="submit"
                className="w-full py-2 px-3 rounded-xl bg-[#E63946] hover:bg-[#B72430] text-xs font-bold text-white flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <span>S'abonner</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400">
          <p>© {new Date().getFullYear()} IT-LeadHER Organization. Tous droits réservés.</p>
          <div className="flex items-center gap-4">
            <a href="/privacy" className="hover:text-white hover:underline">Politique de Confidentialité</a>
            <a href="/terms" className="hover:text-white hover:underline">Conditions d'Utilisation</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
    