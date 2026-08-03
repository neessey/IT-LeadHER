import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Users,
  Award,
  Calendar,
  Building2,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  GraduationCap,
  Star,
  Clock,
  MapPin,
  ChevronRight,
  Zap,
  BookOpen,
  Rocket,
  Linkedin,
  Twitter,
  Instagram,
  PlayCircle
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const {
    t,
    courses,
    events,
    testimonials,
    partners,
    setActiveTab,
    navigateToCourse,
    enrollInCourse,
    registerForEvent,
    setIsAiModalOpen
  } = useApp();

  const featuredCourses = courses.filter(c => c.isFeatured).slice(0, 3);
  const upcomingEvents = events.slice(0, 3);

  const stats = [
    { icon: Users, value: '+500', label: t.hero.stat1, color: 'rose' },
    { icon: Award, value: '+30', label: t.hero.stat2, color: 'purple' },
    { icon: Calendar, value: '+20', label: t.hero.stat3, color: 'amber' },
    { icon: Building2, value: '+10', label: t.hero.stat4, color: 'emerald' }
  ];

  const getStatColors = (color: string) => ({
    rose: 'bg-rose-50 text-rose-600',
    purple: 'bg-purple-50 text-purple-600',
    amber: 'bg-amber-50 text-amber-600',
    emerald: 'bg-emerald-50 text-emerald-600'
  }[color] || 'bg-gray-50 text-gray-600');

  return (
    <div className="min-h-screen bg-white">
      
      {/* HERO SECTION */}
      <section className="relative pt-16 pb-20 overflow-hidden bg-rose-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            {/* Left Content */}
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-rose-200 shadow-sm">
                <Sparkles className="w-4 h-4 text-rose-600" />
                <span className="text-xs font-bold text-rose-600 uppercase tracking-wider">
                  {t.hero.tagline}
                </span>
              </div>

              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-[1.1] tracking-tight">
                <span className="text-gray-900">Former aujourd'hui les</span>
                <span className="block text-rose-600">
                  Femmes leaders numériques
                </span>
                <span className="text-gray-900">de demain.</span>
              </h1>

              <p className="text-lg text-gray-600 leading-relaxed max-w-xl">
                {t.hero.subtitle}
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={() => setActiveTab('login')}
                  className="group px-8 py-4 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold shadow-lg shadow-rose-500/25 transition-all hover:-translate-y-1 flex items-center gap-3"
                >
                  <span>Commencer l'aventure</span>
                  <Rocket className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={() => setActiveTab('academy')}
                  className="px-8 py-4 rounded-2xl bg-white hover:bg-gray-50 text-gray-700 font-bold border-2 border-gray-200 hover:border-rose-200 transition-all"
                >
                  Découvrir les formations
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-6 pt-4">
                {[
                  { icon: CheckCircle2, label: 'Certificats Reconnus' },
                  { icon: CheckCircle2, label: 'Mentorat 1-on-1' },
                  { icon: CheckCircle2, label: 'Projets Réels' }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <div className="p-1 rounded-full bg-emerald-50">
                      <item.icon className="w-4 h-4 text-emerald-500" />
                    </div>
                    <span className="text-sm font-medium text-gray-600">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Visual */}
            <div className="relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="/assets/hero.jpg"
                  alt="Femmes leaders dans la tech"
                  className="w-full h-[500px] object-cover"
                />
                <div className="absolute inset-0 bg-black/50" />
                
               
                <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-2xl p-5 flex items-center gap-4 border border-gray-100">
                  <div className="w-14 h-14 rounded-xl bg-rose-600 text-white flex items-center justify-center">
                    <GraduationCap className="w-7 h-7" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 font-medium">Taux d'insertion</div>
                    <div className="text-xl font-extrabold text-gray-900">89% sous 6 mois</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Statistics */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div 
                key={index}
                className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all border border-gray-100 hover:border-rose-200 hover:-translate-y-1"
              >
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl ${getStatColors(stat.color)} group-hover:scale-110 transition-transform`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-2xl font-black text-gray-900">{stat.value}</div>
                    <div className="text-xs font-medium text-gray-500">{stat.label}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED COURSES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-1 h-6 bg-rose-600 rounded-full" />
              <span className="text-sm font-bold uppercase tracking-wider text-rose-600">Académie E-learning</span>
            </div>
            <h2 className="text-4xl font-extrabold text-gray-900">
              Formations Tech à Fort Impact
            </h2>
          </div>
          <button
            onClick={() => setActiveTab('academy')}
            className="group inline-flex items-center gap-2 text-sm font-bold text-rose-600 hover:text-rose-700 transition-colors"
          >
            <span>Voir tout le catalogue</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredCourses.map((course) => (
            <div
              key={course.id}
              className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-2xl transition-all hover:-translate-y-2 overflow-hidden"
            >
              <div className="relative h-52 overflow-hidden">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 rounded-full bg-white/90 text-rose-600 font-bold text-xs uppercase shadow-sm">
                    {course.categoryLabel}
                  </span>
                </div>
                <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-gray-900/80 text-white font-semibold text-xs">
                  {course.level}
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {course.duration}
                  </span>
                  <span className="flex items-center gap-1 text-amber-500 font-bold">
                    ★ {course.rating}
                    <span className="text-gray-400 font-normal">({course.enrolledCount})</span>
                  </span>
                </div>

                <h3 className="text-lg font-bold text-gray-900 group-hover:text-rose-600 transition-colors line-clamp-2">
                  {course.title}
                </h3>

                <p className="text-sm text-gray-600 line-clamp-2">
                  {course.description}
                </p>

                <div className="flex items-center gap-3 pt-2 border-t border-gray-100">
                  <img
                    src={course.instructorAvatar}
                    alt={course.instructorName}
                    className="w-8 h-8 rounded-full object-cover border-2 border-rose-100"
                  />
                  <span className="text-sm font-medium text-gray-700">{course.instructorName}</span>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => navigateToCourse(course.id)}
                    className="flex-1 py-2.5 rounded-xl border-2 border-rose-200 text-rose-600 hover:bg-rose-50 text-sm font-bold transition-all"
                  >
                    Voir les leçons
                  </button>
                  <button
                    onClick={() => enrollInCourse(course.id)}
                    className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-sm font-bold shadow-sm transition-all"
                  >
                    S'inscrire
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* MENTORSHIP BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-rose-600 rounded-3xl p-12 overflow-hidden shadow-xl">
          <div className="max-w-2xl space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 text-white">
              <Zap className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">Accompagnement Sur-Mesure</span>
            </div>
            
            <h2 className="text-4xl font-extrabold text-white leading-tight">
              Bénéficiez du mentorat d'une leader du numérique.
            </h2>
            
            <p className="text-rose-100 text-base leading-relaxed">
              Un réseau de plus de 30 professionnelles prêtes à vous guider à chaque étape de votre carrière.
            </p>
            
            <div className="flex flex-wrap gap-4 pt-4">
              <button
                onClick={() => setActiveTab('academy')}
                className="px-8 py-4 rounded-xl bg-white text-rose-600 hover:bg-rose-50 font-bold shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
              >
                Explorer nos Formations
              </button>
              <button
                onClick={() => setIsAiModalOpen(true)}
                className="px-8 py-4 rounded-xl bg-white/20 hover:bg-white/30 text-white font-bold border border-white/30 flex items-center gap-3 transition-all"
              >
                <Sparkles className="w-5 h-5 text-amber-300" />
                <span>Consulter l'Assistant IA</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* UPCOMING EVENTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-1 h-6 bg-rose-600 rounded-full" />
              <span className="text-sm font-bold uppercase tracking-wider text-rose-600">Événements & Meetups</span>
            </div>
            <h2 className="text-4xl font-extrabold text-gray-900">
              Participez à nos prochains rendez-vous
            </h2>
          </div>
          <button
            onClick={() => setActiveTab('events')}
            className="group inline-flex items-center gap-2 text-sm font-bold text-rose-600 hover:text-rose-700 transition-colors"
          >
            <span>Voir le calendrier complet</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {upcomingEvents.map(evt => (
            <div 
              key={evt.id} 
              className="group bg-white rounded-2xl border border-gray-100 p-8 shadow-sm hover:shadow-2xl transition-all hover:-translate-y-2 space-y-4"
            >
              <div className="flex items-center justify-between">
                <span className="px-3 py-1.5 rounded-lg bg-rose-50 text-rose-600 font-bold text-xs uppercase">
                  {evt.typeLabel}
                </span>
                <span className="text-sm font-medium text-gray-500">{evt.date}</span>
              </div>

              <h3 className="text-xl font-bold text-gray-900 group-hover:text-rose-600 transition-colors">
                {evt.title}
              </h3>
              
              <p className="text-sm text-gray-600 line-clamp-2">{evt.description}</p>

              <div className="space-y-2 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>{evt.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{evt.time}</span>
                </div>
              </div>

              <button
                onClick={() => registerForEvent(evt.id)}
                disabled={evt.isRegistered}
                className={`w-full py-3 rounded-xl text-sm font-bold transition-all ${
                  evt.isRegistered
                    ? 'bg-emerald-50 text-emerald-700 border-2 border-emerald-200'
                    : 'bg-rose-600 hover:bg-rose-700 text-white shadow-sm'
                }`}
              >
                {evt.isRegistered ? (
                  <span className="flex items-center justify-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    Inscrit(e)
                  </span>
                ) : (
                  "S'inscrire à l'événement"
                )}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="bg-gray-50 py-20 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="flex items-center justify-center gap-2 mb-3">
              <div className="w-1 h-6 bg-rose-600 rounded-full" />
              <span className="text-sm font-bold uppercase tracking-wider text-rose-600">Témoignages & Impact</span>
            </div>
            <h2 className="text-4xl font-extrabold text-gray-900">
              Elles ont transformé leur carrière
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map(t => (
              <div 
                key={t.id} 
                className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-2xl transition-all hover:-translate-y-2 flex flex-col"
              >
                <div className="flex-1 space-y-4">
                  <div className="flex text-amber-400 gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-current" />
                    ))}
                  </div>
                  <blockquote className="text-gray-700 italic leading-relaxed">
                    "{t.quote}"
                  </blockquote>
                </div>

                <div className="flex items-center gap-4 pt-6 mt-6 border-t border-gray-100">
                  <img 
                    src={t.photo} 
                    alt={t.name} 
                    className="w-12 h-12 rounded-full object-cover border-2 border-rose-200" 
                  />
                  <div>
                    <div className="font-bold text-gray-900">{t.name}</div>
                    <div className="text-sm text-gray-500">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PARTNERS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="space-y-8">
          <div className="flex items-center justify-center gap-2">
            <div className="w-1 h-6 bg-rose-600 rounded-full" />
            <span className="text-sm font-bold uppercase tracking-wider text-gray-400">
              Ils soutiennent l'initiative IT-LeadHER
            </span>
          </div>
          
          <div className="flex flex-wrap items-center justify-center gap-12 md:gap-16">
            {partners.map(p => (
              <div 
                key={p.id} 
                className="text-lg font-bold text-gray-400 hover:text-rose-600 transition-all cursor-pointer hover:scale-110"
              >
                {p.logo}
              </div>
            ))}
          </div>
        </div>
      </section>

     

    </div>
  );
};