import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Target,
  Eye,
  ShieldCheck,
  Heart,
  Sparkles,
  Linkedin,
  Award,
  Users,
  Globe,
  BookOpen,
  ChevronRight,
  ArrowRight,
  Quote,
  Crown,
  Lightbulb,
  Users2,
  Star,
  Handshake,
  GraduationCap,
  MapPin,
  Calendar,
  CheckCircle2
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  const { t, team } = useApp();

  const valuesList = [
    {
      key: 'inclusion',
      title: t.about.values.inclusion.title,
      desc: t.about.values.inclusion.desc,
      icon: '🤝',
      color: 'rose'
    },
    {
      key: 'leadership',
      title: t.about.values.leadership.title,
      desc: t.about.values.leadership.desc,
      icon: '👑',
      color: 'purple'
    },
    {
      key: 'innovation',
      title: t.about.values.innovation.title,
      desc: t.about.values.innovation.desc,
      icon: '💡',
      color: 'amber'
    },
    {
      key: 'collaboration',
      title: t.about.values.collaboration.title,
      desc: t.about.values.collaboration.desc,
      icon: '👭',
      color: 'emerald'
    },
    {
      key: 'excellence',
      title: t.about.values.excellence.title,
      desc: t.about.values.excellence.desc,
      icon: '⭐',
      color: 'blue'
    }
  ];

  const stats = [
    { label: 'Femmes formées', value: '+30', icon: Users, color: 'rose' },
    { label: 'Formations certifiantes', value: '+20', icon: BookOpen, color: 'amber' },
    { label: 'Mentors expertes', value: '+10', icon: Award, color: 'emerald' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-rose-50/20 to-white">
      
      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-20 pb-16">
        {/* Background décoratif */}
        <div className="absolute inset-0 bg-gradient-to-br from-rose-50/60 via-white to-purple-50/30" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-rose-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl" />
        
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-rose-200 shadow-sm">
            <Sparkles className="w-4 h-4 text-rose-500" />
            <span className="text-xs font-bold text-rose-600 uppercase tracking-wider">
              À Propos d'IT-LeadHER
            </span>
          </div>
          
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1]">
            <span className="text-gray-900">Notre mission</span>
            <span className="block bg-rose-600 bg-clip-text text-transparent">
              {t.about.title}
            </span>
          </h1>
          
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            {t.about.subtitle}
          </p>

          
        </div>
      </section>

    

      {/* HISTOIRE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8 order-2 lg:order-1">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-1 h-8 bg-rose-500 rounded-full" />
                <span className="text-sm font-bold uppercase tracking-wider text-rose-500">
                  Notre Histoire
                </span>
              </div>
              <h2 className="text-4xl font-extrabold text-gray-900 leading-tight">
                Un mouvement né de l'ambition d'égalité dans la tech
              </h2>
            </div>
            
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p className="text-base">{t.about.historyText}</p>
              <p className="text-base">
Aujourd'hui, IT-LeadHER rassemble les étudiantes de l'IUA autour d'une même ambition :
apprendre, progresser, partager et développer leur potentiel dans les
domaines du numérique, de l'innovation et du leadership.              </p>
            </div>

            <div className="flex flex-wrap gap-6 pt-4">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                <span className="text-sm font-medium text-gray-700">Communauté active</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                <span className="text-sm font-medium text-gray-700">Programmes certifiants</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                <span className="text-sm font-medium text-gray-700">Impact mesurable</span>
              </div>
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <div className="relative">
              <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
                <img
                  src="/assets/about.jpg"
                  alt="Atelier collaboratif IT-LeadHER"
                  className="w-full h-96 object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl shadow-xl p-5 border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-purple-500 text-white flex items-center justify-center">
                    <Calendar className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 font-medium">Création</div>
                    <div className="text-lg font-extrabold text-gray-900">2026</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
{/* PARTENAIRES & INSTITUTIONS */}
<section className="relative py-16 overflow-hidden bg-gradient-to-br from-white via-rose-50/30 to-white border-y border-rose-100/50">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    
    {/* En-tête avec titre et badge */}
    <div className="flex flex-col items-center text-center mb-10">
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-50 border border-rose-200/50 mb-3">
        <Handshake className="w-4 h-4 text-rose-500" />
        <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-rose-600">
          Nos Institutions & Partenaires
        </span>
      </div>
      <h3 className="text-2xl font-bold text-gray-800">
        Ils nous font confiance
      </h3>
      <p className="text-sm text-gray-500 mt-1">
        Des partenaires engagés pour l'insertion des femmes dans la tech
      </p>
    </div>

    {/* Bande défilante avec pause au survol */}
    <div className="relative overflow-hidden">
   
      {/* Conteneur de la bande */}
      <div className="flex overflow-hidden group">
        <div className="flex animate-marquee group-hover:animate-marquee-pause items-center gap-16 py-6">
          
          {/* ITEMS - 1ère série */}
          <div className="flex items-center gap-16 shrink-0">
            {/* Logo IUA */}
            <div className="flex flex-col items-center gap-2 transition-all duration-300 hover:scale-110">
              <div className="w-24 h-24 rounded-2xl bg-white shadow-md border border-gray-100 flex items-center justify-center p-4 hover:shadow-xl transition-shadow duration-300">
                <img
                  src="/assets/iua.jpeg"
                  alt="Institut Universitaire d'Abidjan"
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">IUA</span>
            </div>

            {/* Logo REDIS */}
            <div className="flex flex-col items-center gap-2 transition-all duration-300 hover:scale-110">
              <div className="w-24 h-24 rounded-2xl bg-black shadow-md border border-gray-100 flex items-center justify-center p-4 hover:shadow-xl transition-shadow duration-300">
                <img
                  src="/assets/redis.jpeg"
                  alt="REDIS"
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">REDIS</span>
            </div>


             {/* Logo IUA */}
            <div className="flex flex-col items-center gap-2 transition-all duration-300 hover:scale-110">
              <div className="w-24 h-24 rounded-2xl bg-white shadow-md border border-gray-100 flex items-center justify-center p-4 hover:shadow-xl transition-shadow duration-300">
                <img
                  src="/assets/iua.jpeg"
                  alt="Institut Universitaire d'Abidjan"
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">IUA</span>
            </div>

            {/* Logo REDIS */}
            <div className="flex flex-col items-center gap-2 transition-all duration-300 hover:scale-110">
              <div className="w-24 h-24 rounded-2xl bg-black shadow-md border border-gray-100 flex items-center justify-center p-4 hover:shadow-xl transition-shadow duration-300">
                <img
                  src="/assets/redis.jpeg"
                  alt="REDIS"
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">REDIS</span>
            </div>

          </div>

          {/* DUPLICATION pour effet infini - 2ème série */}
          <div className="flex items-center gap-16 shrink-0">
            <div className="flex flex-col items-center gap-2 transition-all duration-300 hover:scale-110">
              <div className="w-24 h-24 rounded-2xl bg-white shadow-md border border-gray-100 flex items-center justify-center p-4 hover:shadow-xl transition-shadow duration-300">
                <img
                  src="/assets/iua.jpeg"
                  alt="Institut Universitaire d'Abidjan"
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">IUA</span>
            </div>

            <div className="flex flex-col items-center gap-2 transition-all duration-300 hover:scale-110">
              <div className="w-24 h-24 rounded-2xl bg-black shadow-md border border-gray-100 flex items-center justify-center p-4 hover:shadow-xl transition-shadow duration-300">
                <img
                  src="/assets/redis.jpeg"
                  alt="REDIS"
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">REDIS</span>
            </div>

            

           {/* Logo IUA */}
            <div className="flex flex-col items-center gap-2 transition-all duration-300 hover:scale-110">
              <div className="w-24 h-24 rounded-2xl bg-white shadow-md border border-gray-100 flex items-center justify-center p-4 hover:shadow-xl transition-shadow duration-300">
                <img
                  src="/assets/iua.jpeg"
                  alt="Institut Universitaire d'Abidjan"
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">IUA</span>
            </div>

            {/* Logo REDIS */}
            <div className="flex flex-col items-center gap-2 transition-all duration-300 hover:scale-110">
              <div className="w-24 h-24 rounded-2xl bg-black shadow-md border border-gray-100 flex items-center justify-center p-4 hover:shadow-xl transition-shadow duration-300">
                <img
                  src="/assets/redis.jpeg"
                  alt="REDIS"
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">REDIS</span>
            </div>

          </div>

        </div>
      </div>
    </div>

 
  </div>
</section>

      {/* MISSION & VISION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="group bg-white p-8 rounded-3xl border-2 border-rose-100 shadow-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 hover:border-rose-200">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-rose-50 to-rose-100 text-rose-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Target className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              {t.about.missionTitle}
            </h3>
            <p className="text-gray-600 leading-relaxed text-base">
              {t.about.missionText}
            </p>
            <div className="mt-6 flex items-center gap-2 text-rose-600 font-bold text-sm">
              <span>Notre engagement</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>

          <div className="group bg-white p-8 rounded-3xl border-2 border-purple-100 shadow-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 hover:border-purple-200">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100 text-purple-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Eye className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              {t.about.visionTitle}
            </h3>
            <p className="text-gray-600 leading-relaxed text-base">
              {t.about.visionText}
            </p>
            <div className="mt-6 flex items-center gap-2 text-purple-600 font-bold text-sm">
              <span>Notre ambition</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      </section>

     

      {/* ÉQUIPE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="w-1 h-8 bg-rose-500 rounded-full" />
            <span className="text-sm font-bold uppercase tracking-wider text-rose-500">
              Gouvernance
            </span>
          </div>
          <h2 className="text-4xl font-extrabold text-gray-900">
            {t.about.teamTitle}
          </h2>
          <p className="text-gray-600 mt-3">
            Des étudiantes engagées qui contribuent au développement d'IT-LeadHER au sein de l'IUA
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {team.map((member, index) => (
            <div
              key={member.id}
              className="group bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-3 overflow-hidden"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div className="relative h-64 overflow-hidden">
                <img
                  src={member.photo}
                  alt={member.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <div className="inline-block px-3 py-1 rounded-full bg-rose-500/80 backdrop-blur-sm text-xs font-bold uppercase tracking-wider">
                    Membre fondatrice
                  </div> 
                </div>
              </div>

              <div className="p-6 text-center space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-rose-600 transition-colors">
                    {member.name}
                  </h3>
                  <p className="text-sm font-bold text-rose-500">
                    {member.role}
                  </p>
                </div>

                <p className="text-sm text-gray-600 leading-relaxed">
                  {member.bio}
                </p>

                <div className="pt-4 border-t border-gray-100">
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-600 font-bold text-sm transition-all"
                  >
                    <Linkedin className="w-4 h-4" />
                    <span>LinkedIn</span>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="relative rounded-3xl bg-rose-700 p-12 overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
          
          <div className="relative z-10 max-w-2xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm text-white">
              <Heart className="w-4 h-4 text-rose-200" />
              <span className="text-xs font-bold uppercase tracking-wider">
                Rejoignez le mouvement
              </span>
            </div>
            
            <h2 className="text-4xl font-extrabold text-white leading-tight">
              Ensemble, construisons l'avenir numérique
            </h2>
            
            <p className="text-rose-100 text-base leading-relaxed">
             Rejoignez IT-LeadHER et participez à la vie associative de l'IUA.
Développez vos compétences, partagez vos connaissances et construisez
votre réseau avec d'autres étudiantes passionnées.
            </p>
            
            
          </div>
        </div>
      </section>

    </div>
  );
};