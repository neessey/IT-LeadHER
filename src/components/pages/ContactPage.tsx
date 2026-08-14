import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Mail, Phone, MapPin, ChevronDown, ChevronUp, Send, User, MessageSquare, Clock, Globe, Building2, HelpCircle, Loader2 } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const { t, showToast, language } = useApp();
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Numéro WhatsApp de l'équipe IT-LeadHER (format international sans le +)
  // Remplace par le vrai numéro de l'admin
  const WHATSAPP_NUMBER = '2250504272827'; // Exemple: +225 01 40 58 62 80

  const faqs = [
    {
      q: "Comment rejoindre la communauté IT-LeadHER ?",
      a: "L'inscription est simple et gratuite ! Cliquez sur le bouton 'Rejoindre IT-LeadHER', renseignez vos informations et vous aurez accès instantanément à l'académie e-learning et au réseau de membres."
    },
    {
      q: "Les formations sont-elles gratuites ?",
      a: "La majorité de nos parcours fondamentaux et événements communautaires sont 100% gratuits grâce au soutien de nos partenaires. Certains bootcamps spécialisés intensifs proposent des bourses complètes sur critères d'admission."
    },
    {
      q: "Comment obtenir un certificat de participation ?",
      a: "Pour obtenir votre certificat IT-LeadHER, vous devez compléter 100% des leçons et valider les quiz associés d'un cours e-learning. Un certificat  est alors automatiquement généré sur votre espace personnel."
    },
    {
      q: "Comment devenir mentor pour la communauté ?",
      a: "Si vous êtes une professionnelle de la tech avec plus de 3 ans d'expérience, nous serions honorées de vous accueillir ! Remplissez le formulaire de contact svp."
    },
    {
      q: "Quels sont les horaires d'ouverture ?",
      a: "Notre équipe est disponible du lundi au vendredi de 9h à 18h GMT. Pour les événements et bootcamps, les horaires sont indiqués sur chaque page d'événement."
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Construire le message formaté pour WhatsApp
    const message = ` *Nouveau message de contact IT-LeadHER*

 *Nom :* ${form.name}
 *Email :* ${form.email}
 *Sujet :* ${form.subject}
 *Message :* ${form.message}

 Envoyé le ${new Date().toLocaleString('fr-FR')}`;

    // Encoder le message pour l'URL
    const encodedMessage = encodeURIComponent(message);
    
    // Créer le lien WhatsApp
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;

    // Ouvrir WhatsApp dans un nouvel onglet
    window.open(whatsappUrl, '_blank');

    // Simuler l'envoi pour l'UI
    setTimeout(() => {
      showToast(language === 'fr' ? '✅ Message préparé pour WhatsApp !' : '✅ Message prepared for WhatsApp!');
      setForm({ name: '', email: '', subject: '', message: '' });
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
            <Mail className="w-3.5 h-3.5" />
            À votre écoute
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 tracking-tight">
            {t.contact.title}
          </h1>
          <p className="text-base text-gray-600 max-w-2xl mx-auto mt-3 leading-relaxed">
            {t.contact.subtitle}
          </p>
          <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-200 rounded-xl text-sm text-green-700">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            Réponse rapide via WhatsApp
          </div>
        </div>
      </header>

      {/* Contact Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Informations de contact */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-6">
              <h3 className="text-lg font-bold text-gray-900">Coordonnées</h3>

              <div className="space-y-4">
                <div className="flex items-start gap-4 p-3 rounded-xl bg-gray-50 hover:bg-rose-50 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-gray-900">E-mail</div>
                    <a href="mailto:contact@it-leadher.org" className="text-sm text-black  transition-colors">
                      contact.itleadher@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-3 rounded-xl bg-gray-50 hover:bg-green-50 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-green-100 text-green-600 flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-gray-900">WhatsApp</div>
                    <a 
                      href={`https://wa.me/${WHATSAPP_NUMBER}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-black transition-colors flex items-center gap-1"
                    >
                      +225 01 40 58 62 80
                      <span className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full">Rapide</span>
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-3 rounded-xl bg-gray-50 hover:bg-amber-50 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-gray-900">Adresse</div>
                    <div className="text-sm text-gray-600">Abidjan, Côte d'Ivoire</div>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-3 rounded-xl bg-gray-50 hover:bg-emerald-50 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-gray-900">Horaires</div>
                    <div className="text-sm text-gray-600">Lun - Ven : 9h - 18h GMT</div>
                  </div>
                </div>
              </div>
            </div>

           
          </div>

          {/* Formulaire */}
          <div className="lg:col-span-8 bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8">
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-2xl font-bold text-gray-900">Envoyer un message</h3>
                
              </div>
              <p className="text-sm text-gray-500">
                Votre message sera envoyé directement sur WhatsApp. Réponse rapide garantie !
              </p>
            </div>

            {isSuccess && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mb-6 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-sm font-bold text-emerald-800">Message prêt pour WhatsApp !</div>
                  <div className="text-xs text-emerald-700">Votre message a été préparé, WhatsApp va s'ouvrir.</div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">
                    {t.contact.nameLabel} *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Votre nom"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-shadow"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">
                    {t.contact.emailLabel} *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="votre@email.com"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-shadow"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">
                  {t.contact.subjectLabel} *
                </label>
                <div className="relative">
                  <MessageSquare className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    required
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    placeholder="Sujet de votre message"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-shadow"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">
                  {t.contact.messageLabel} *
                </label>
                <div className="relative">
                  <textarea
                    rows={5}
                    required
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Votre message..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-shadow resize-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold text-sm shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Préparation...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Envoyer via WhatsApp</span>
                  </>
                )}
              </button>

              <p className="text-[11px] text-gray-400 text-center">
                En cliquant sur "Envoyer", vous serez redirigé vers WhatsApp pour finaliser l'envoi.
              </p>
            </form>
          </div>

        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="w-1 h-6 bg-rose-600 rounded-full" />
            <span className="text-sm font-bold uppercase tracking-wider text-rose-600">Questions fréquentes</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">
            {t.contact.faqTitle}
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div 
              key={idx} 
              className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden hover:border-rose-200 transition-colors"
            >
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full p-5 text-left flex items-center justify-between gap-4 hover:bg-rose-50/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <HelpCircle className="w-5 h-5 text-rose-600 shrink-0" />
                  <span className="text-sm font-bold text-gray-900">{faq.q}</span>
                </div>
                <div className="shrink-0">
                  {openFaq === idx ? (
                    <ChevronUp className="w-5 h-5 text-rose-600" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </div>
              </button>
              
              {openFaq === idx && (
                <div className="px-5 pb-5 pt-2 text-sm text-gray-600 leading-relaxed border-t border-gray-100">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* CTA final */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="bg-gray-50 rounded-3xl border border-gray-200 p-8 sm:p-12 text-center">
          <Building2 className="w-12 h-12 text-rose-600 mx-auto mb-4" />
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Devenir partenaire ?
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto mt-2 text-sm leading-relaxed">
            Rejoignez notre écosystème et participez à la transformation numérique en Afrique.
          </p>
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Bonjour, je souhaite devenir partenaire de IT-LeadHER.')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm transition-colors"
          >
            Nous contacter sur WhatsApp
          </a>
        </div>
      </section>

    </div>
  );
};