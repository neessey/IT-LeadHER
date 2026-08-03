import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Calendar, MapPin, Clock, Users, Link as LinkIcon, CheckCircle, ArrowRight, Filter, X, Search } from 'lucide-react';

export const EventsPage: React.FC = () => {
  const { t, events, registerForEvent } = useApp();
  const [selectedType, setSelectedType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const eventTypes = [
    { id: 'all', label: t.events.allTypes },
    { id: 'conference', label: t.events.conference },
    { id: 'bootcamp', label: t.events.bootcamp },
    { id: 'hackathon', label: t.events.hackathon },
    { id: 'webinar', label: t.events.webinar }
  ];

  // Filtrer les événements
  const filteredEvents = events.filter(e => {
    const matchType = selectedType === 'all' || e.type === selectedType;
    const matchSearch = searchQuery === '' || 
      e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchType && matchSearch;
  });

  const clearFilters = () => {
    setSelectedType('all');
    setSearchQuery('');
  };

  const hasActiveFilters = selectedType !== 'all' || searchQuery !== '';

  // Trier les événements par date (les plus récents d'abord)
  const sortedEvents = [...filteredEvents].sort((a, b) => {
    // Extraction simple de la date pour trier (à adapter selon format)
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  return (
    <div className="min-h-screen bg-white pb-16">
      
      {/* Header */}
      <header className="bg-rose-50 border-b border-rose-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-rose-200 text-rose-600 text-xs font-bold uppercase tracking-wider mb-4">
            <Calendar className="w-3.5 h-3.5" />
            Calendrier communautaire
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 tracking-tight">
            {t.events.title}
          </h1>
          <p className="text-base text-gray-600 max-w-2xl mx-auto mt-3 leading-relaxed">
            {t.events.subtitle}
          </p>
        </div>
      </header>

      {/* Filtres et recherche */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 sm:p-6">
          
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Recherche */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher un événement..."
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-shadow"
              />
            </div>

            {/* Filtres bureau */}
            <div className="hidden sm:flex items-center gap-3">
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-4 py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent bg-white min-w-[160px]"
              >
                {eventTypes.map(type => (
                  <option key={type.id} value={type.id}>{type.label}</option>
                ))}
              </select>

              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="px-4 py-3 rounded-xl border border-gray-200 text-sm font-medium text-rose-600 hover:bg-rose-50 transition-colors flex items-center gap-1.5"
                >
                  <X className="w-4 h-4" />
                  <span>Effacer</span>
                </button>
              )}
            </div>

            {/* Filtres mobile */}
            <div className="flex gap-3 sm:hidden">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex-1 px-4 py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 flex items-center justify-center gap-2"
              >
                <Filter className="w-4 h-4" />
                <span>Filtres</span>
              </button>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="px-4 py-3 rounded-xl border border-gray-200 text-sm font-medium text-rose-600 flex items-center gap-1"
                >
                  <X className="w-4 h-4" />
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
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-rose-500 bg-white"
                >
                  {eventTypes.map(type => (
                    <option key={type.id} value={type.id}>{type.label}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Pills catégories */}
          <div className="mt-4 pt-4 border-t border-gray-100 overflow-x-auto">
            <div className="flex gap-2 pb-1">
              {eventTypes.map(type => (
                <button
                  key={type.id}
                  onClick={() => setSelectedType(type.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                    selectedType === type.id
                      ? 'bg-rose-600 text-white shadow-sm'
                      : 'bg-gray-50 border border-gray-200 text-gray-600 hover:bg-rose-50 hover:text-rose-600'
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          {/* Résultats */}
          <div className="mt-4 text-sm text-gray-500">
            {sortedEvents.length} événement{sortedEvents.length > 1 ? 's' : ''} trouvé{sortedEvents.length > 1 ? 's' : ''}
          </div>

        </div>
      </section>

      {/* Grille des événements */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {sortedEvents.length === 0 ? (
          <div className="bg-white rounded-3xl border border-gray-200 p-12 text-center">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-800">Aucun événement trouvé</h3>
            <p className="text-sm text-gray-500 mt-2 max-w-md mx-auto">
              Aucun événement ne correspond à vos critères. Essayez de modifier vos filtres.
            </p>
            <button
              onClick={clearFilters}
              className="mt-6 px-6 py-3 rounded-xl bg-rose-50 text-rose-600 font-bold text-sm hover:bg-rose-100 transition-colors"
            >
              Réinitialiser les filtres
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedEvents.map(evt => (
              <article
                key={evt.id}
                className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-xl transition-all hover:-translate-y-2 overflow-hidden flex flex-col"
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden bg-gray-100">
                  <img
                    src={evt.image || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80'}
                    alt={evt.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80';
                    }}
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-3 py-1 rounded-full bg-white/90 text-rose-600 font-bold text-xs uppercase shadow-sm">
                      {evt.typeLabel}
                    </span>
                  </div>
                  {evt.registeredCount !== undefined && (
                    <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-gray-900/80 text-white font-semibold text-xs">
                      <Users className="w-3 h-3 inline mr-1" />
                      {evt.registeredCount} inscrits
                    </div>
                  )}
                </div>

                {/* Contenu */}
                <div className="p-6 flex-1 flex flex-col">
                  {/* Date et heure */}
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-rose-600" />
                      {evt.date}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-rose-600" />
                      {evt.time}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                    {evt.title}
                  </h3>

                  <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                    {evt.description}
                  </p>

                  {/* Lieu */}
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                    <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
                    <span className="truncate">{evt.location}</span>
                  </div>

                  {/* Speakers */}
                  {evt.speakers && evt.speakers.length > 0 && (
                    <div className="pt-3 border-t border-gray-100 mb-4">
                      <span className="text-xs font-bold uppercase text-gray-400 block mb-2">
                        Intervenant{evt.speakers.length > 1 ? 's' : ''}
                      </span>
                      <div className="flex flex-wrap items-center gap-3">
                        {evt.speakers.map((spk, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <span className="text-xs font-medium text-gray-700">{spk.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Bouton */}
                  <button
                    onClick={() => registerForEvent(evt.id)}
                    disabled={evt.isRegistered}
                    className={`w-full py-3 rounded-xl text-sm font-bold transition-all mt-auto ${
                      evt.isRegistered
                        ? 'bg-emerald-50 text-emerald-700 border-2 border-emerald-200 cursor-default'
                        : 'bg-rose-600 hover:bg-rose-700 text-white shadow-sm'
                    }`}
                  >
                    {evt.isRegistered ? (
                      <span className="flex items-center justify-center gap-2">
                        <CheckCircle className="w-4 h-4" />
                        Vous êtes inscrit(e)
                      </span>
                    ) : (
                      t.events.register
                    )}
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="bg-gray-50 rounded-3xl border border-gray-200 p-8 sm:p-12 text-center">
          <Users className="w-12 h-12 text-rose-600 mx-auto mb-4" />
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Vous souhaitez organiser un événement ?
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto mt-2 text-sm leading-relaxed">
            Proposez un atelier, un bootcamp ou une conférence pour la communauté IT-LeadHER.
          </p>
          <button className="mt-6 px-8 py-3.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm transition-colors inline-flex items-center gap-2">
            <span>Proposer un événement</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

    </div>
  );
};