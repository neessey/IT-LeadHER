import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Search, BookOpen, Star, Clock, Award, CheckCircle2, ArrowRight, X, ChevronDown } from 'lucide-react';

export const AcademyPage: React.FC = () => {
  const { t, courses, enrollments, currentUser, navigateToCourse, enrollInCourse } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  const WHATSAPP_NUMBER = '2250504272827'; // Remplace par le vrai numéro de l'admin
  const categories = [
    { id: 'all', label: t.academy.allCategories },
    { id: 'dev', label: 'Développement Web' },
    { id: 'data', label: 'Data & Analytics' },
    { id: 'ai', label: 'Intelligence Artificielle' },
    { id: 'cyber', label: 'Cybersécurité' },
    { id: 'design', label: 'UI/UX Design' },
    { id: 'leadership', label: 'Leadership & Soft Skills' }
  ];

  const levels = [
    { id: 'all', label: t.academy.allLevels },
    { id: 'Débutant', label: 'Débutant' },
    { id: 'Intermédiaire', label: 'Intermédiaire' },
    { id: 'Avancé', label: 'Avancé' }
  ];

  const filteredCourses = courses.filter(course => {
    const search = searchQuery.toLowerCase();
    const matchSearch = course.title.toLowerCase().includes(search) ||
      course.description.toLowerCase().includes(search) ||
      course.skillsAcquired.some(s => s.toLowerCase().includes(search));
    const matchCategory = selectedCategory === 'all' || course.category === selectedCategory;
    const matchLevel = selectedLevel === 'all' || course.level === selectedLevel;
    return matchSearch && matchCategory && matchLevel;
  });

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedLevel('all');
  };

  const hasActiveFilters = searchQuery || selectedCategory !== 'all' || selectedLevel !== 'all';

  return (
    <div className="min-h-screen bg-white pb-16">
      
      {/* Header */}
      <header className="bg-rose-50 border-b border-rose-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-rose-200 text-rose-600 text-xs font-bold uppercase tracking-wider mb-4">
            <BookOpen className="w-3.5 h-3.5" />
            Espace E-Learning
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 tracking-tight">
            {t.academy.title}
          </h1>
          <p className="text-base text-gray-600 max-w-2xl mx-auto mt-3 leading-relaxed">
            {t.academy.subtitle}
          </p>
        </div>
      </header>

      {/* Filtres */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 sm:p-6">
          
          {/* Barre de recherche et filtres principaux */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.academy.searchPlaceholder}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-shadow"
              />
            </div>

            <div className="flex gap-3 sm:hidden">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex-1 px-4 py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 flex items-center justify-center gap-2"
              >
                <span>Filtres</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </button>
              {hasActiveFilters && (
                <button
                  onClick={resetFilters}
                  className="px-4 py-3 rounded-xl border border-gray-200 text-sm font-medium text-rose-600 flex items-center gap-1"
                >
                  <X className="w-4 h-4" />
                  <span>Réinitialiser</span>
                </button>
              )}
            </div>

            <div className="hidden sm:flex gap-3">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent bg-white min-w-[160px]"
              >
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.label}</option>
                ))}
              </select>

              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="px-4 py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent bg-white min-w-[140px]"
              >
                {levels.map(l => (
                  <option key={l.id} value={l.id}>{l.label}</option>
                ))}
              </select>

              {hasActiveFilters && (
                <button
                  onClick={resetFilters}
                  className="px-4 py-3 rounded-xl border border-gray-200 text-sm font-medium text-rose-600 hover:bg-rose-50 transition-colors flex items-center gap-1"
                >
                  <X className="w-4 h-4" />
                  <span>Réinitialiser</span>
                </button>
              )}
            </div>
          </div>

          {/* Filtres mobiles */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-100 sm:hidden space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Catégorie</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-rose-500 bg-white"
                >
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Niveau</label>
                <select
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-rose-500 bg-white"
                >
                  {levels.map(l => (
                    <option key={l.id} value={l.id}>{l.label}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Pills catégories */}
          <div className="mt-4 pt-4 border-t border-gray-100 overflow-x-auto">
            <div className="flex gap-2 pb-1">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
                    selectedCategory === cat.id
                      ? 'bg-rose-600 text-white shadow-sm'
                      : 'bg-gray-50 border border-gray-200 text-gray-600 hover:bg-rose-50 hover:text-rose-600'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Résultats */}
          <div className="mt-4 text-sm text-gray-500">
            {filteredCourses.length} cours trouvés
          </div>
        </div>
      </section>

      {/* Grille des cours */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {filteredCourses.length === 0 ? (
          <div className="bg-white rounded-3xl border border-gray-200 p-12 text-center">
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-800">Aucun cours trouvé</h3>
            <p className="text-sm text-gray-500 mt-2 max-w-md mx-auto">
              Aucun cours ne correspond à vos critères de recherche. Essayez de modifier vos filtres.
            </p>
            <button
              onClick={resetFilters}
              className="mt-6 px-6 py-3 rounded-xl bg-rose-50 text-rose-600 font-bold text-sm hover:bg-rose-100 transition-colors cursor-pointer"
            >
              Réinitialiser les filtres
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map(course => {
              const enrollment = currentUser
                ? enrollments.find(e => e.userId === currentUser.id && e.courseId === course.id)
                : null;

              return (
                <article
                  key={course.id}
                  className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col"
                >
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden bg-gray-100">
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 flex gap-2">
                      <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm text-rose-600 font-bold text-[10px] uppercase tracking-wide shadow-sm">
                        {course.categoryLabel}
                      </span>
                    </div>
                    <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-gray-900/80 text-white font-semibold text-[10px]">
                      {course.level}
                    </div>
                    {enrollment && (
                      <div className="absolute bottom-0 left-0 right-0 bg-rose-600/90 backdrop-blur-sm px-4 py-2">
                        <div className="flex items-center justify-between text-white text-xs font-bold">
                          <span>Progression {enrollment.progress}%</span>
                          <div className="w-24 h-1.5 bg-white/30 rounded-full overflow-hidden">
                            <div className="h-full bg-white rounded-full" style={{ width: `${enrollment.progress}%` }} />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Contenu */}
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {course.duration}
                      </span>
                      <span className="flex items-center gap-1 text-amber-500 font-bold">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        {course.rating} ({course.enrolledCount})
                      </span>
                    </div>

                    <h3
                      onClick={() => navigateToCourse(course.id)}
                      className="text-lg font-bold text-gray-900 hover:text-rose-600 transition-colors cursor-pointer line-clamp-2 mb-2"
                    >
                      {course.title}
                    </h3>

                    <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                      {course.description}
                    </p>

                    {/* Instructeur */}
                    <div className="flex items-center gap-3 pt-3 border-t border-gray-100 mb-3">
                      <img
                        src={course.instructorAvatar}
                        alt={course.instructorName}
                        className="w-8 h-8 rounded-full object-cover border border-gray-200"
                      />
                      <div>
                        <div className="text-xs font-bold text-gray-800">{course.instructorName}</div>
                        <div className="text-[10px] text-gray-400 truncate max-w-[150px]">
                          {course.instructorRole}
                        </div>
                      </div>
                    </div>

                    {/* Compétences */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {course.skillsAcquired.slice(0, 3).map((skill, idx) => (
                        <span key={idx} className="px-2.5 py-0.5 bg-gray-100 text-gray-600 rounded-lg text-[10px] font-medium">
                          {skill}
                        </span>
                      ))}
                      {course.skillsAcquired.length > 3 && (
                        <span className="px-2.5 py-0.5 text-gray-400 text-[10px] font-medium">
                          +{course.skillsAcquired.length - 3}
                        </span>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 mt-auto">
                      <button
                        onClick={() => navigateToCourse(course.id)}
                        className="flex-1 py-2.5 rounded-xl border-2 border-rose-200 text-rose-600 hover:bg-rose-50 text-sm font-bold transition-colors cursor-pointer"
                      >
                        {enrollment ? 'Continuer' : 'Voir le programme'}
                      </button>
                      {!enrollment && (
                        <button
                          onClick={() => enrollInCourse(course.id)}
                          className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-sm font-bold shadow-sm transition-colors cursor-pointer"
                        >
                          {t.academy.enrollBtn}
                        </button>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="bg-rose-50 rounded-3xl border border-rose-200 p-8 sm:p-12 text-center">
          <Award className="w-12 h-12 text-rose-600 mx-auto mb-4" />
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Vous souhaitez devenir formatrice ?
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto mt-2 text-sm leading-relaxed">
            Rejoignez notre réseau d'experts et partagez votre expertise avec la communauté IT-LeadHER.
          </p>
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Bonjour, je souhaite devenir formateur/trice de IT-LeadHER.')}`}
            target="_blank"
            rel="noopener noreferrer"
           className="mt-6 px-8 py-3.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm transition-colors inline-flex items-center gap-2"
          >
  <span>Devenir Formateur/trice</span>
            <ArrowRight className="w-4 h-4" />         
             </a>
          
        </div>
      </section>

    </div>
  );
};