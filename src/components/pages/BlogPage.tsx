import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Search, Clock, MessageSquare, Tag, ArrowRight, ArrowLeft, Send, User, Calendar, Eye, Heart, Bookmark, Share2 } from 'lucide-react';

export const BlogPage: React.FC = () => {
  const {
    t,
    articles,
    selectedArticleSlug,
    setSelectedArticleSlug,
    activeTab,
    setActiveTab,
    addArticleComment,
    navigateToArticle
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [commentInput, setCommentInput] = useState('');
  const [showComments, setShowComments] = useState(true);

  const selectedArticle = articles.find(a => a.slug === selectedArticleSlug);

  const categories = ['all', 'Technologie', 'Carrière', 'Leadership', 'Portraits', 'Témoignages'];

  const filteredArticles = articles.filter(art => {
    const matchSearch = art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.summary.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCat = selectedCategory === 'all' || art.category === selectedCategory;
    return matchSearch && matchCat;
  });

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
  };

  const hasActiveFilters = searchQuery !== '' || selectedCategory !== 'all';

  // Vue article complet
  if (activeTab === 'blog-detail' && selectedArticle) {
    return (
      <div className="min-h-screen bg-white pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* Retour */}
          <button
            onClick={() => setActiveTab('blog')}
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-rose-600 transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Retour à tous les articles</span>
          </button>

          {/* En-tête article */}
          <div className="space-y-6 mb-8">
            <div className="flex flex-wrap items-center gap-3">
              <span className="px-3 py-1.5 rounded-full bg-rose-50 text-rose-600 font-bold text-xs uppercase">
                {selectedArticle.category}
              </span>
              <span className="text-xs text-gray-400 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                {selectedArticle.readTime}
              </span>
              <span className="text-xs text-gray-400 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                {selectedArticle.createdAt}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
              {selectedArticle.title}
            </h1>

            {/* Auteur */}
            <div className="flex items-center gap-4 pt-2 border-b border-gray-100 pb-6">
              <img
                src={selectedArticle.authorAvatar}
                alt={selectedArticle.authorName}
                className="w-12 h-12 rounded-full object-cover border-2 border-rose-100"
              />
              <div>
                <div className="font-bold text-gray-900">{selectedArticle.authorName}</div>
                <div className="text-sm text-gray-500">{selectedArticle.authorRole}</div>
              </div>
            </div>
          </div>

          {/* Image de couverture */}
          <div className="rounded-2xl overflow-hidden mb-8 border border-gray-100">
            <img
              src={selectedArticle.cover}
              alt={selectedArticle.title}
              className="w-full h-80 sm:h-96 object-cover"
            />
          </div>

          {/* Contenu */}
          <div className="prose prose-rose max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap font-sans text-base">
            {selectedArticle.content}
          </div>

          {/* Tags */}
          <div className="flex flex-wrap items-center gap-2 pt-6 mt-6 border-t border-gray-100">
            <Tag className="w-4 h-4 text-rose-600" />
            {selectedArticle.tags.map((tag, i) => (
              <span key={i} className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                #{tag}
              </span>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4 pt-6 mt-4 border-t border-gray-100">
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-600 text-sm font-medium transition-colors">
              <Heart className="w-4 h-4" />
              <span>J'aime</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-600 text-sm font-medium transition-colors">
              <Bookmark className="w-4 h-4" />
              <span>Enregistrer</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-600 text-sm font-medium transition-colors">
              <Share2 className="w-4 h-4" />
              <span>Partager</span>
            </button>
          </div>

          {/* Commentaires */}
          <div className="mt-8 bg-gray-50 rounded-2xl border border-gray-200 p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-rose-600" />
                <span>Commentaires ({selectedArticle.comments.length})</span>
              </h3>
              <button
                onClick={() => setShowComments(!showComments)}
                className="text-sm font-medium text-rose-600 hover:text-rose-700 transition-colors"
              >
                {showComments ? 'Masquer' : 'Afficher'}
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (commentInput.trim()) {
                  addArticleComment(selectedArticle.slug, commentInput);
                  setCommentInput('');
                }
              }}
              className="flex gap-3"
            >
              <input
                type="text"
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                placeholder="Écrire un commentaire..."
                className="flex-1 px-4 py-3 bg-white rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-shadow"
              />
              <button
                type="submit"
                disabled={!commentInput.trim()}
                className="px-5 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>Envoyer</span>
              </button>
            </form>

            {showComments && (
              <div className="space-y-3">
                {selectedArticle.comments.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-4">
                    Aucun commentaire pour le moment. Soyez la première à réagir !
                  </p>
                ) : (
                  selectedArticle.comments.map(c => (
                    <div key={c.id} className="bg-white p-4 rounded-xl border border-gray-100 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center font-bold text-sm">
                            {c.userName.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-bold text-sm text-gray-900">{c.userName}</span>
                        </div>
                        <span className="text-xs text-gray-400">{c.date}</span>
                      </div>
                      <p className="text-sm text-gray-700 ml-10">{c.text}</p>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

        </div>
      </div>
    );
  }

  // Vue liste des articles
  return (
    <div className="min-h-screen bg-white pb-16">
      
      {/* Header */}
      <header className="bg-rose-50 border-b border-rose-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-rose-200 text-rose-600 text-xs font-bold uppercase tracking-wider mb-4">
            <MessageSquare className="w-3.5 h-3.5" />
            Ressources & Publications
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 tracking-tight">
            {t.blog.title}
          </h1>
          <p className="text-base text-gray-600 max-w-2xl mx-auto mt-3 leading-relaxed">
            {t.blog.subtitle}
          </p>
        </div>
      </header>

      {/* Filtres et recherche */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 sm:p-6">
          
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.blog.searchPlaceholder}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-shadow"
              />
            </div>

            <div className="flex items-center gap-3">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent bg-white min-w-[140px]"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat === 'all' ? 'Toutes les catégories' : cat}
                  </option>
                ))}
              </select>

              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="px-4 py-3 rounded-xl border border-gray-200 text-sm font-medium text-rose-600 hover:bg-rose-50 transition-colors flex items-center gap-1.5"
                >
                  <span>Effacer</span>
                </button>
              )}
            </div>
          </div>

          {/* Pills catégories */}
          <div className="mt-4 pt-4 border-t border-gray-100 overflow-x-auto">
            <div className="flex gap-2 pb-1">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                    selectedCategory === cat
                      ? 'bg-rose-600 text-white shadow-sm'
                      : 'bg-gray-50 border border-gray-200 text-gray-600 hover:bg-rose-50 hover:text-rose-600'
                  }`}
                >
                  {cat === 'all' ? 'Tous' : cat}
                </button>
              ))}
            </div>
          </div>

          {/* Résultats */}
          <div className="mt-4 text-sm text-gray-500">
            {filteredArticles.length} article{filteredArticles.length > 1 ? 's' : ''} trouvé{filteredArticles.length > 1 ? 's' : ''}
          </div>

        </div>
      </section>

      {/* Grille des articles */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {filteredArticles.length === 0 ? (
          <div className="bg-white rounded-3xl border border-gray-200 p-12 text-center">
            <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-800">Aucun article trouvé</h3>
            <p className="text-sm text-gray-500 mt-2 max-w-md mx-auto">
              Aucun article ne correspond à vos critères de recherche.
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
            {filteredArticles.map(art => (
              <article
                key={art.id}
                onClick={() => navigateToArticle(art.slug)}
                className="group bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-xl transition-all hover:-translate-y-2 overflow-hidden cursor-pointer flex flex-col"
              >
                <div className="relative h-48 overflow-hidden bg-gray-100">
                  <img
                    src={art.cover}
                    alt={art.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-3 py-1 rounded-full bg-white/90 text-rose-600 font-bold text-xs uppercase shadow-sm">
                      {art.category}
                    </span>
                  </div>
                  <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full bg-gray-900/80 text-white text-xs font-medium flex items-center gap-1.5">
                    <Clock className="w-3 h-3" />
                    {art.readTime}
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-rose-600 transition-colors line-clamp-2 mb-2">
                    {art.title}
                  </h3>

                  <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                    {art.summary}
                  </p>

                  <div className="flex items-center gap-3 pt-3 mt-auto border-t border-gray-100">
                    <img
                      src={art.authorAvatar}
                      alt={art.authorName}
                      className="w-8 h-8 rounded-full object-cover border border-gray-200"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-900 truncate">
                        {art.authorName}
                      </div>
                      <div className="text-xs text-gray-400">
                        {art.createdAt}
                      </div>
                    </div>
                    <span className="text-rose-600 group-hover:translate-x-1 transition-transform">
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Newsletter */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="bg-gray-50 rounded-3xl border border-gray-200 p-8 sm:p-12 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Restez informée
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto mt-2 text-sm leading-relaxed">
            Recevez nos derniers articles et actualités directement dans votre boîte mail.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto mt-6">
            <input
              type="email"
              placeholder="Votre adresse email"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
            />
            <button className="w-full sm:w-auto px-6 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm transition-colors whitespace-nowrap">
              S'abonner
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};