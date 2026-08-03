import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Building2, Handshake, Globe, CheckCircle2, Mail, User, MessageSquare, Send, ExternalLink, Users, Briefcase, GraduationCap, Award } from 'lucide-react';

export const PartnersPage: React.FC = () => {
  const { t, partners, submitPartnerInquiry, language } = useApp();
  const [formData, setFormData] = useState({
    companyName: '',
    contactName: '',
    email: '',
    partnerType: 'Tech',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const partnerTypes = [
    { id: 'Tech', label: 'Entreprise Tech / Bourses', icon: Building2 },
    { id: 'Institutionnel', label: 'Institution / Bailleurs', icon: Globe },
    { id: 'Éducation', label: 'Université / École', icon: GraduationCap },
    { id: 'Recrutement', label: 'Partenaire Recrutement', icon: Users }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    setTimeout(() => {
      submitPartnerInquiry(formData);
      setFormData({ companyName: '', contactName: '', email: '', partnerType: 'Tech', message: '' });
      setIsSubmitting(false);
      setIsSuccess(true);
      
      setTimeout(() => setIsSuccess(false), 5000);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-white pb-16">
      
      {/* Header */}
      <header className="bg-rose-50 border-b border-rose-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-rose-200 text-rose-600 text-xs font-bold uppercase tracking-wider mb-4">
            <Handshake className="w-3.5 h-3.5" />
            Écosystème & Synergies
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 tracking-tight">
            {t.partners.title}
          </h1>
          <p className="text-base text-gray-600 max-w-2xl mx-auto mt-3 leading-relaxed">
            {t.partners.subtitle}
          </p>
        </div>
      </header>

      {/* Partenaires */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-1 h-6 bg-rose-600 rounded-full" />
            <span className="text-sm font-bold uppercase tracking-wider text-rose-600">
              Nos Partenaires ({partners.length})
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {partners.map(p => (
              <div 
                key={p.id} 
                className="group bg-gray-50 rounded-2xl p-6 border border-gray-100 hover:border-rose-200 hover:shadow-lg transition-all hover:-translate-y-1"
              >
                <div className="text-2xl font-black text-gray-900 mb-3">
                  {p.logo}
                </div>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase ${
                  p.tier === 'Grand Partenaire' ? 'bg-amber-100 text-amber-800' :
                  p.tier === 'Partenaire Majeur' ? 'bg-gray-200 text-gray-700' :
                  'bg-rose-50 text-rose-600'
                }`}>
                  {p.tier}
                </span>
                <p className="text-sm text-gray-600 mt-3 leading-relaxed">
                  {p.description}
                </p>
                <a 
                  href={p.website} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-rose-600 hover:text-rose-700 mt-3 transition-colors"
                >
                  <span>Visiter</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pourquoi nous rejoindre */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="bg-gray-50 rounded-2xl border border-gray-200 p-8">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
            Pourquoi devenir partenaire ?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: Users, title: 'Visibilité', desc: 'Exposez votre marque à une communauté de femmes tech engagées.' },
              { icon: Award, title: 'Impact', desc: 'Contribuez activement à la réduction de la fracture numérique.' },
              { icon: Handshake, title: 'Talents', desc: 'Accédez à un vivier de talents qualifiés et diversifiés.' }
            ].map((item, idx) => (
              <div key={idx} className="bg-white p-6 rounded-xl border border-gray-100 text-center">
                <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-3">
                  <item.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">{item.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Formulaire Devenir Partenaire */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="bg-white rounded-2xl border-2 border-rose-100 shadow-sm p-8 sm:p-12">
          
          <div className="text-center space-y-3 mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-50 text-rose-600 text-xs font-bold uppercase tracking-wider">
              <Handshake className="w-3.5 h-3.5" />
              Rejoignez le mouvement
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              {t.partners.becomePartner}
            </h2>
            <p className="text-sm text-gray-500 max-w-xl mx-auto">
              {t.partners.becomePartnerDesc}
            </p>
          </div>

          {isSuccess && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mb-6 flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <div>
                <div className="text-sm font-bold text-emerald-800">Demande envoyée !</div>
                <div className="text-xs text-emerald-700">Nous vous répondrons dans les plus brefs délais.</div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">
                  Organisation / Entreprise *
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    required
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    placeholder="Nom de votre organisation"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-shadow"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">
                  Nom du contact *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    required
                    value={formData.contactName}
                    onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                    placeholder="Prénom et nom"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-shadow"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">
                  E-mail professionnel *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="contact@entreprise.com"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-shadow"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">
                  Type de partenariat *
                </label>
                <div className="relative">
                  <Briefcase className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                  <select
                    value={formData.partnerType}
                    onChange={(e) => setFormData({ ...formData, partnerType: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-shadow bg-white appearance-none"
                  >
                    {partnerTypes.map(type => (
                      <option key={type.id} value={type.id}>{type.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">
                Votre projet ou message *
              </label>
              <div className="relative">
                <MessageSquare className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                <textarea
                  rows={4}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Décrivez comment vous souhaitez collaborer avec IT-LeadHER..."
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-shadow resize-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Envoi en cours...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Envoyer la demande</span>
                </>
              )}
            </button>
          </form>

          <p className="text-xs text-gray-400 text-center mt-4">
            En soumettant ce formulaire, vous acceptez que vos données soient traitées par IT-LeadHER.
          </p>
        </div>
      </section>

    </div>
  );
};