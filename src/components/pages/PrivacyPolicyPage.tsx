import React from 'react';
import {
  ShieldCheck,
  Lock,
  UserCheck,
  Database,
  Mail,
  FileText,
  Clock,
  Eye,
  Trash2
} from 'lucide-react';

export const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-rose-50/20 to-white">

      {/* HERO */}
      <section className="relative overflow-hidden pt-20 pb-16">
        <div className="absolute inset-0 bg-gradient-to-br from-rose-50/60 via-white to-purple-50/30" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-rose-200/20 rounded-full blur-3xl" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-rose-200 shadow-sm mb-6">
            <ShieldCheck className="w-4 h-4 text-rose-500" />
            <span className="text-xs font-bold text-rose-600 uppercase tracking-wider">
              Confidentialité
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight">
            Politique de confidentialité
          </h1>

          <p className="mt-5 text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            IT-LeadHER accorde une importance particulière à la protection
            des données personnelles de ses membres, étudiantes et visiteurs.
          </p>

          <p className="mt-4 text-sm text-gray-500">
            Dernière mise à jour : 15 août 2026
          </p>
        </div>
      </section>

      {/* CONTENT */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-10 space-y-10">

          {/* INTRO */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <ShieldCheck className="w-6 h-6 text-rose-500" />
              <h2 className="text-2xl font-bold text-gray-900">
                Notre engagement
              </h2>
            </div>

            <p className="text-gray-600 leading-8">
              IT-LeadHER, association étudiante de l'Institut Universitaire
              d'Abidjan (IUA), respecte la vie privée des personnes qui
              utilisent son site et ses services numériques.
            </p>

            <p className="mt-4 text-gray-600 leading-8">
              Cette politique explique quelles données peuvent être
              collectées, pourquoi elles sont utilisées, comment elles sont
              protégées et quels droits vous pouvez exercer concernant vos
              données personnelles.
            </p>

            <p className="mt-4 text-sm text-gray-500">
              Cette politique est notamment établie en tenant compte de la
              législation ivoirienne applicable en matière de protection des
              données à caractère personnel, notamment la loi n° 2013-450
              du 19 juin 2013.
            </p>
          </section>

          {/* RESPONSABLE */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <UserCheck className="w-6 h-6 text-rose-500" />
              <h2 className="text-2xl font-bold text-gray-900">
                1. Responsable du traitement
              </h2>
            </div>

            <div className="bg-gray-50 rounded-2xl p-5 space-y-2 text-gray-600">
              <p>
                <strong className="text-gray-900">Association :</strong>{' '}
                IT-LeadHER
              </p>

              <p>
                <strong className="text-gray-900">Institution :</strong>{' '}
                Institut Universitaire d'Abidjan (IUA)
              </p>

              <p>
                <strong className="text-gray-900">Adresse :</strong>{' '}
                La Corniche, Abidjan, Côte d'Ivoire
              </p>

              <p>
                <strong className="text-gray-900">Email :</strong>{' '}
                contact-itleadher@gmail.com
              </p>
            </div>
          </section>

          {/* DATA */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <Database className="w-6 h-6 text-rose-500" />
              <h2 className="text-2xl font-bold text-gray-900">
                2. Données que nous pouvons collecter
              </h2>
            </div>

            <p className="text-gray-600 leading-8 mb-4">
              Selon les fonctionnalités utilisées sur le site, IT-LeadHER
              peut être amenée à collecter certaines informations nécessaires
              au fonctionnement de ses services.
            </p>

            <ul className="space-y-3 text-gray-600">
              <li className="flex gap-3">
                <span className="text-rose-500">•</span>
                Nom et prénom
              </li>

              <li className="flex gap-3">
                <span className="text-rose-500">•</span>
                Adresse e-mail
              </li>

              <li className="flex gap-3">
                <span className="text-rose-500">•</span>
                Informations relatives au profil étudiant
              </li>

              <li className="flex gap-3">
                <span className="text-rose-500">•</span>
                Informations relatives aux inscriptions à des activités,
                formations ou événements
              </li>

              <li className="flex gap-3">
                <span className="text-rose-500">•</span>
                Informations techniques nécessaires au fonctionnement du site
              </li>
            </ul>

            <p className="mt-5 text-sm text-gray-500">
              IT-LeadHER ne cherche pas à collecter de données personnelles
              qui ne sont pas nécessaires aux finalités présentées sur le
              site.
            </p>
          </section>

          {/* PURPOSE */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <Eye className="w-6 h-6 text-rose-500" />
              <h2 className="text-2xl font-bold text-gray-900">
                3. Utilisation des données
              </h2>
            </div>

            <p className="text-gray-600 leading-8 mb-4">
              Les données collectées peuvent notamment être utilisées pour :
            </p>

            <ul className="space-y-3 text-gray-600">
              <li>• créer et gérer un compte utilisateur ;</li>
              <li>• gérer l'adhésion ou la participation aux activités ;</li>
              <li>• inscrire les membres aux formations et événements ;</li>
              <li>• communiquer des informations relatives à IT-LeadHER ;</li>
              <li>• assurer le fonctionnement et la sécurité de la plateforme ;</li>
              <li>• améliorer les services et l'expérience utilisateur ;</li>
              <li>• établir des statistiques générales sur l'utilisation du site.</li>
            </ul>
          </section>

          {/* LEGAL BASIS */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <FileText className="w-6 h-6 text-rose-500" />
              <h2 className="text-2xl font-bold text-gray-900">
                4. Base du traitement
              </h2>
            </div>

            <p className="text-gray-600 leading-8">
              Selon la nature du traitement, les données peuvent être
              traitées notamment sur la base du consentement de la personne
              concernée, de la nécessité de fournir un service demandé,
              d'une obligation légale applicable ou d'un autre fondement
              autorisé par la législation en vigueur.
            </p>
          </section>

          {/* SHARING */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <Lock className="w-6 h-6 text-rose-500" />
              <h2 className="text-2xl font-bold text-gray-900">
                5. Partage des données
              </h2>
            </div>

            <p className="text-gray-600 leading-8">
              Les données personnelles ne sont pas vendues ou louées à des
              fins commerciales.
            </p>

            <p className="mt-4 text-gray-600 leading-8">
              Elles peuvent être accessibles uniquement aux personnes ou
              prestataires autorisés lorsque cela est nécessaire au
              fonctionnement de la plateforme, à l'organisation des activités
              ou au respect d'une obligation légale.
            </p>
          </section>

          {/* RETENTION */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <Clock className="w-6 h-6 text-rose-500" />
              <h2 className="text-2xl font-bold text-gray-900">
                6. Durée de conservation
              </h2>
            </div>

            <p className="text-gray-600 leading-8">
              Les données personnelles sont conservées pendant une durée
              proportionnée à leur finalité et conformément aux obligations
              légales applicables.
            </p>

            <p className="mt-4 text-gray-600 leading-8">
              Lorsqu'une donnée n'est plus nécessaire et qu'aucune obligation
              légale ne justifie sa conservation, elle peut être supprimée
              ou anonymisée.
            </p>
          </section>

          {/* SECURITY */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <Lock className="w-6 h-6 text-rose-500" />
              <h2 className="text-2xl font-bold text-gray-900">
                7. Sécurité
              </h2>
            </div>

            <p className="text-gray-600 leading-8">
              IT-LeadHER met en œuvre des mesures techniques et
              organisationnelles raisonnables destinées à protéger les
              données personnelles contre l'accès non autorisé, la perte,
              l'altération, la divulgation ou toute utilisation illicite.
            </p>
          </section>

          {/* RIGHTS */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <UserCheck className="w-6 h-6 text-rose-500" />
              <h2 className="text-2xl font-bold text-gray-900">
                8. Vos droits
              </h2>
            </div>

            <p className="text-gray-600 leading-8 mb-4">
              Conformément à la réglementation ivoirienne applicable, vous
              pouvez notamment disposer de droits concernant vos données
              personnelles, dans les conditions prévues par la loi :
            </p>

            <ul className="space-y-3 text-gray-600">
              <li>• droit à l'information ;</li>
              <li>• droit d'accès à vos données ;</li>
              <li>• droit de rectification ;</li>
              <li>• droit d'opposition lorsque les conditions légales sont réunies ;</li>
              <li>• droit à l'effacement ou à l'oubli dans les conditions prévues par la loi ;</li>
              <li>• droit de retirer votre consentement lorsque le traitement repose sur celui-ci ;</li>
              <li>• droit à la portabilité lorsque les conditions prévues par la loi sont réunies.</li>
            </ul>

            <p className="mt-5 text-gray-600 leading-8">
              Pour exercer vos droits, contactez-nous à l'adresse :
            </p>

            <div className="mt-4 inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-rose-50 text-rose-700 font-medium">
              <Mail className="w-4 h-4" />
                              contact-itleadher@gmail.com

            </div>
          </section>

          {/* COOKIES */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <Database className="w-6 h-6 text-rose-500" />
              <h2 className="text-2xl font-bold text-gray-900">
                9. Cookies et technologies similaires
              </h2>
            </div>

            <p className="text-gray-600 leading-8">
              Le site peut utiliser des cookies ou technologies similaires
              nécessaires à son fonctionnement, à la sécurité, à la
              mémorisation de certaines préférences ou à la mesure de son
              utilisation.
            </p>

            <p className="mt-4 text-gray-600 leading-8">
              Lorsque certains cookies nécessitent votre consentement,
              celui-ci sera recueilli conformément aux règles applicables.
            </p>
          </section>

          {/* CHANGES */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <FileText className="w-6 h-6 text-rose-500" />
              <h2 className="text-2xl font-bold text-gray-900">
                10. Modification de cette politique
              </h2>
            </div>

            <p className="text-gray-600 leading-8">
              IT-LeadHER peut mettre à jour cette politique afin de tenir
              compte de l'évolution du site, de ses services ou de la
              réglementation applicable.
            </p>

            <p className="mt-4 text-gray-600 leading-8">
              La date de dernière mise à jour affichée en haut de cette page
              permet d'identifier la version actuellement applicable.
            </p>
          </section>

          {/* CONTACT */}
          <section className="border-t border-gray-100 pt-8">
            <div className="flex items-center gap-3 mb-4">
              <Mail className="w-6 h-6 text-rose-500" />
              <h2 className="text-2xl font-bold text-gray-900">
                11. Contact
              </h2>
            </div>

            <p className="text-gray-600 leading-8">
              Pour toute question concernant cette politique ou le traitement
              de vos données personnelles, vous pouvez contacter IT-LeadHER :
            </p>

            <div className="mt-4 bg-gray-50 rounded-2xl p-5 text-gray-600 space-y-2">
              <p>
                <strong className="text-gray-900">IT-LeadHER</strong>
              </p>
              <p>Institut Universitaire d'Abidjan (IUA)</p>
              <p>La Corniche, Abidjan, Côte d'Ivoire</p>
              <p>contact-itleadher@gmail.com</p>
            </div>
          </section>

        </div>
      </main>
    </div>
  );
};