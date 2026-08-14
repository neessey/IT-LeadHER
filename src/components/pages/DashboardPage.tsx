import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import {
  BookOpen,
  Award,
  Calendar,
  CheckCircle2,
  Clock,
  Sparkles,
  Download,
  ArrowRight,
  Settings,
  Camera,
  Upload,
  Lock,
  Eye,
  EyeOff,
  Save,
  Mail,
  Linkedin,
  User,
  BarChart3,
  Target,
  ChevronRight,
  Loader2,
  Trophy,
  GraduationCap,
  Star,
  TrendingUp,
  FileText,
  ExternalLink,
  ZoomIn
} from 'lucide-react';
import { downloadCertificate } from '../../utils/CertificateGenerator';

const DEFAULT_AVATAR = 'https://www.hs-coburg.de/wp-content/uploads/2024/03/person-silhouette-2.jpg';

export const DashboardPage: React.FC = () => {
  const {
    currentUser,
    enrollments,
    courses,
    certificates,
    events,
    setSelectedCertificate,
    navigateToCourse,
    setActiveTab,
    updateUserProfile,
    showToast,
    t,
    getCourseProgress
  } = useApp();

  const [activeTabSection, setActiveTabSection] = useState<'overview' | 'certificates' | 'settings'>('overview');
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    country: "Côte d'Ivoire",
    technicalLevel: 'Débutant' as 'Débutant' | 'Intermédiaire' | 'Avancé',
    domainInterest: 'Développement Web & React',
    bio: '',
    linkedin: '',
    avatar: ''
  });

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isDownloading, setIsDownloading] = useState<string | null>(null);
  const [selectedCertForView, setSelectedCertForView] = useState<any | null>(null);

  useEffect(() => {
    if (currentUser) {
      setProfileData({
        firstName: currentUser.firstName || '',
        lastName: currentUser.lastName || '',
        email: currentUser.email || '',
        country: currentUser.country || "Côte d'Ivoire",
        technicalLevel: (currentUser.technicalLevel as any) || 'Débutant',
        domainInterest: currentUser.domainInterest || 'Développement Web & React',
        bio: currentUser.bio || '',
        linkedin: currentUser.linkedin || '',
        avatar: currentUser.avatar || DEFAULT_AVATAR
      });
    }
  }, [currentUser]);

  if (!currentUser) return null;

  const myEnrollments = enrollments.filter(e => e.userId === currentUser.id);
  const myCertificates = certificates.filter(c => c.userId === currentUser.id);
  const myEvents = events.filter(e => e.isRegistered);

  // Calculer les statistiques avancées
  const totalLessonsCompleted = myEnrollments.reduce((acc, e) => acc + e.completedLessonIds.length, 0);
  const totalLessons = myEnrollments.reduce((acc, e) => {
    const course = courses.find(c => c.id === e.courseId);
    return acc + (course?.lessons.length || 0);
  }, 0);
  const overallProgress = totalLessons > 0 ? Math.round((totalLessonsCompleted / totalLessons) * 100) : 0;

  // Certificats avec plus d'informations
  const enrichedCertificates = myCertificates.map(cert => {
    const course = courses.find(c => c.id === cert.courseId);
    const enrollment = myEnrollments.find(e => e.courseId === cert.courseId);
    return {
      ...cert,
      course,
      score: enrollment?.overallScore || 0,
      progress: enrollment?.progress || 0
    };
  });

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      showToast("L'image sélectionnée dépasse 5 Mo.", 'error');
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        setProfileData(prev => ({ ...prev, avatar: reader.result as string }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword && newPassword !== confirmPassword) {
      setPasswordError('Les mots de passe ne correspondent pas.');
      return;
    }
    if (newPassword && newPassword.length < 6) {
      setPasswordError('Le mot de passe doit comporter au moins 6 caractères.');
      return;
    }

    setPasswordError('');
    setIsSaving(true);

    try {
      await updateUserProfile(currentUser.id, profileData, newPassword || undefined);
      setNewPassword('');
      setConfirmPassword('');
      showToast('Profil mis à jour avec succès !', 'success');
    } catch (err: any) {
      showToast(err.message || 'Erreur lors de la sauvegarde.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDownloadCertificate = async (cert: any) => {
    if (isDownloading) return;
    setIsDownloading(cert.id);
    
    try {
      const success = await downloadCertificate(cert);
      if (success) {
        showToast('Certificat téléchargé avec succès !', 'success');
      } else {
        showToast('Erreur lors du téléchargement.', 'error');
      }
    } catch (error) {
      showToast('Erreur lors du téléchargement.', 'error');
    } finally {
      setIsDownloading(null);
    }
  };

  const handleViewCertificate = (cert: any) => {
    setSelectedCertForView(cert);
    setSelectedCertificate(cert);
    setActiveTab('certificate');
  };

  // Composant pour afficher une carte de certificat
  const CertificateCard = ({ cert }: { cert: any }) => (
    <div className="group bg-gradient-to-br from-rose-50 to-white border border-rose-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:border-rose-200">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Award className="w-5 h-5 text-rose-500" />
            <span className="text-xs font-bold text-rose-500 uppercase tracking-wider">Certificat</span>
            {cert.score >= 95 && (
              <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-[10px] font-bold rounded-full">
                Excellence
              </span>
            )}
          </div>
          <h3 className="font-bold text-gray-900 text-base">{cert.courseTitle}</h3>
          <p className="text-sm text-gray-500 mt-1">{cert.userName}</p>
          <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
            <span>Délivré le {cert.issueDate}</span>
            <span className="flex items-center gap-1">
              <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
              {cert.score}%
            </span>
            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-bold">
              ✓ Validé
            </span>
          </div>
        </div>
        <div className="flex flex-col gap-2 ml-4">
          <button
            onClick={() => handleViewCertificate(cert)}
            className="p-2 rounded-xl bg-rose-100 hover:bg-rose-200 text-rose-600 transition-colors"
            title="Voir le certificat"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDownloadCertificate(cert)}
            disabled={isDownloading === cert.id}
            className="p-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white transition-colors disabled:opacity-50"
            title="Télécharger"
          >
            {isDownloading === cert.id ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
      {/* Barre de progression du score */}
      <div className="mt-4">
        <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
          <span>Score</span>
          <span className="font-bold text-gray-700">{cert.score}%</span>
        </div>
        <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-rose-400  rounded-full transition-all duration-500"
            style={{ width: `${cert.score}%` }}
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50/50 pb-16 pt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

        {/* En-tête avec bienvenue */}
        <div className="bg-rose-500 rounded-3xl p-8 text-white shadow-lg">
          <div className="flex items-center gap-4">
            <img
              src={profileData.avatar || DEFAULT_AVATAR}
              alt={currentUser.firstName}
              className="w-20 h-20 rounded-full object-cover border-4 border-white/30"
            />
            <div>
              <h1 className="text-2xl font-bold">
                Bonjour, {currentUser.firstName} ! 👋
              </h1>
              <p className="text-rose-100 text-sm mt-1">
                {currentUser.role === 'admin' ? 'Administratrice' : 'Membre'} • {currentUser.email}
              </p>
              <div className="flex items-center gap-3 mt-2 text-xs text-rose-100">
                <span className="flex items-center gap-1">
                  <BookOpen className="w-3 h-3" />
                  {myEnrollments.length} formation{myEnrollments.length > 1 ? 's' : ''}
                </span>
                <span className="flex items-center gap-1">
                  <Award className="w-3 h-3" />
                  {myCertificates.length} certificat{myCertificates.length > 1 ? 's' : ''}
                </span>
                <span className="flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  {overallProgress}% de progression globale
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation tabs */}
        <div className="flex flex-wrap items-center gap-2 bg-white rounded-2xl p-1.5 shadow-sm border border-gray-100">
          <button
            onClick={() => setActiveTabSection('overview')}
            className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-colors flex items-center gap-2 ${
              activeTabSection === 'overview'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Mes Formations</span>
          </button>
          <button
            onClick={() => setActiveTabSection('certificates')}
            className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-colors flex items-center gap-2 ${
              activeTabSection === 'certificates'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Mes Certificats</span>
            {myCertificates.length > 0 && (
              <span className="px-2 py-0.5 bg-rose-100 text-rose-600 rounded-full text-xs">
                {myCertificates.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTabSection('settings')}
            className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-colors flex items-center gap-2 ${
              activeTabSection === 'settings'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Mon Profil</span>
          </button>
        </div>

        {activeTabSection === 'overview' && (
          /* OVERVIEW */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Colonne principale */}
            <div className="lg:col-span-2 space-y-8">
              
        

              {/* Formations en cours */}
              <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-rose-600" />
                    <span>Mes formations en cours</span>
                  </h2>
                  <button
                    onClick={() => setActiveTab('academy')}
                    className="text-sm font-medium text-rose-600 hover:text-rose-700 flex items-center gap-1"
                  >
                    Voir tout
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                {myEnrollments.length === 0 ? (
                  <div className="text-center py-8 text-gray-500 space-y-4">
                    <BookOpen className="w-12 h-12 text-gray-300 mx-auto" />
                    <p className="text-sm">Vous n'êtes pas encore inscrite à une formation.</p>
                    <button
                      onClick={() => setActiveTab('academy')}
                      className="px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold text-sm transition-colors"
                    >
                      Découvrir le catalogue
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {myEnrollments.map(enr => {
                      const course = courses.find(c => c.id === enr.courseId);
                      if (!course) return null;
                      const progress = enr.progress || 0;

                      return (
                        <div key={enr.id} className="p-4 rounded-2xl border border-gray-100 bg-gray-50 hover:border-rose-200 hover:bg-rose-50/30 transition-all duration-200">
                          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div className="flex items-center gap-4 w-full sm:w-auto">
                              <img src={course.thumbnail} alt={course.title} className="w-16 h-16 rounded-xl object-cover shrink-0" />
                              <div className="flex-1 min-w-0">
                                <div className="text-sm font-bold text-gray-900 truncate">{course.title}</div>
                                <div className="text-xs text-gray-500 mt-0.5">
                                  {enr.completedLessonIds.length}/{course.lessons.length} leçons
                                </div>
                                <div className="w-full sm:w-48 h-1.5 bg-gray-200 rounded-full mt-2 overflow-hidden">
                                  <div 
                                    className="h-full bg-rose-600 rounded-full transition-all duration-500"
                                    style={{ width: `${progress}%` }}
                                  />
                                </div>
                              </div>
                            </div>
                            <button
                              onClick={() => navigateToCourse(course.id)}
                              className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-sm font-bold transition-colors shrink-0 w-full sm:w-auto flex items-center justify-center gap-2"
                            >
                              <span>Continuer</span>
                              <ArrowRight className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Colonne latérale */}
            <div className="space-y-8">
              
              {/* Derniers certificats */}
              <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-4">
                  <Award className="w-5 h-5 text-amber-500" />
                  <span>Derniers certificats</span>
                </h2>

                {myCertificates.length === 0 ? (
                  <div className="text-center py-6">
                    <GraduationCap className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">
                      Terminez une formation pour obtenir votre premier certificat.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {myCertificates.slice(0, 2).map(cert => {
                      const course = courses.find(c => c.id === cert.courseId);
                      return (
                        <div key={cert.id} className="p-4 rounded-2xl bg-gradient-to-br from-amber-50 to-white border border-amber-100">
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="text-sm font-bold text-gray-900">{cert.courseTitle}</div>
                              <div className="text-xs text-gray-500 mt-0.5">{cert.issueDate}</div>
                              {course && (
                                <div className="text-xs text-emerald-600 font-medium mt-1">
                                  ✓ Formation terminée
                                </div>
                              )}
                            </div>
                            <button
                              onClick={() => handleViewCertificate(cert)}
                              className="p-2 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-700 transition-colors"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                    {myCertificates.length > 2 && (
                      <button
                        onClick={() => setActiveTabSection('certificates')}
                        className="text-sm font-medium text-rose-600 hover:text-rose-700 flex items-center justify-center gap-1 w-full py-2"
                      >
                        Voir tous les certificats
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Événements */}
              <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-4">
                  <Calendar className="w-5 h-5 text-amber-600" />
                  <span>Événements</span>
                </h2>

                {myEvents.length === 0 ? (
                  <p className="text-sm text-gray-500 py-4">Aucun événement à venir.</p>
                ) : (
                  <div className="space-y-3">
                    {myEvents.slice(0, 3).map(evt => (
                      <div key={evt.id} className="p-4 rounded-2xl border border-gray-100 bg-gray-50">
                        <div className="font-bold text-gray-900 text-sm">{evt.title}</div>
                        <div className="text-xs text-gray-500 mt-1">{evt.date}</div>
                        <span className="inline-block mt-2 px-3 py-1 bg-emerald-50 text-emerald-700 font-bold rounded-lg text-xs">
                          ✓ Inscrit
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>

          </div>
        )}

        {activeTabSection === 'certificates' && (
          /* SECTION CERTIFICATS */
          <div className="space-y-8">
            {/* En-tête des certificats */}
            <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                    <Award className="w-7 h-7 text-amber-500" />
                    <span>Mes Certificats</span>
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    {myCertificates.length} certificat{myCertificates.length > 1 ? 's' : ''} obtenu{myCertificates.length > 1 ? 's' : ''}
                  </p>
                </div>
                <div className="px-4 py-2 bg-amber-50 rounded-xl text-sm font-bold text-amber-700">
                   Score moyen : {myCertificates.length > 0 
                    ? Math.round(myCertificates.reduce((acc, c) => {
                        const enrollment = myEnrollments.find(e => e.courseId === c.courseId);
                        return acc + (enrollment?.overallScore || 0);
                      }, 0) / myCertificates.length)
                    : 0}%
                </div>
              </div>
            </div>

            {/* Liste des certificats */}
            {myCertificates.length === 0 ? (
              <div className="bg-white rounded-3xl border border-gray-100 p-16 text-center shadow-sm">
                <GraduationCap className="w-20 h-20 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-700 mb-2">Aucun certificat pour le moment</h3>
                <p className="text-gray-500 max-w-md mx-auto">
                  Terminez une formation avec au moins 90% de réussite pour obtenir votre certificat.
                </p>
                <button
                  onClick={() => setActiveTab('academy')}
                  className="mt-6 px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold text-sm transition-colors"
                >
                  Explorer les formations
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {enrichedCertificates.map(cert => (
                  <CertificateCard key={cert.id} cert={cert} />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTabSection === 'settings' && (
          /* SETTINGS - inchangé mais conservé */
          <div className="bg-white rounded-3xl border border-gray-200 p-8 shadow-sm max-w-3xl mx-auto">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <Settings className="w-6 h-6 text-rose-600" />
                <span>Paramètres du compte</span>
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Modifiez vos informations personnelles et votre photo de profil.
              </p>
            </div>

            <form onSubmit={handleSaveSettings} className="space-y-8">
              
              {/* Avatar */}
              <div className="border-b border-gray-200 pb-6">
                <label className="block text-sm font-bold text-gray-700 mb-3">
                  Photo de profil
                </label>
                <div className="flex items-center gap-6">
                  <div className="relative group shrink-0">
                    <img
                      src={profileData.avatar || DEFAULT_AVATAR}
                      alt="Avatar"
                      className="w-24 h-24 rounded-full object-cover border-4 border-gray-200 bg-gray-100"
                    />
                    <label className="absolute bottom-0 right-0 bg-rose-600 hover:bg-rose-700 text-white p-2 rounded-full cursor-pointer shadow-md transition-transform hover:scale-110">
                      <Camera className="w-4 h-4" />
                      <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
                    </label>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">JPG, PNG ou WEBP (max 5 Mo)</p>
                    {profileData.avatar && profileData.avatar !== DEFAULT_AVATAR && (
                      <button
                        type="button"
                        onClick={() => setProfileData(prev => ({ ...prev, avatar: DEFAULT_AVATAR }))}
                        className="mt-2 text-sm text-red-600 hover:text-red-700 font-medium"
                      >
                        Supprimer la photo
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Informations */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider">Informations générales</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Prénom *</label>
                    <input
                      type="text"
                      required
                      value={profileData.firstName}
                      onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nom *</label>
                    <input
                      type="text"
                      required
                      value={profileData.lastName}
                      onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                      <input
                        type="email"
                        readOnly
                        value={profileData.email}
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 text-sm bg-gray-50 text-gray-500 cursor-not-allowed"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Pays</label>
                    <select
                      value={profileData.country}
                      onChange={(e) => setProfileData({ ...profileData, country: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                    >
                      {["Côte d'Ivoire", 'Sénégal', 'Cameroun', 'Mali', 'Burkina Faso', 'Togo', 'Bénin', 'Guinée', 'France', 'Canada', 'Autre'].map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Profil technique */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider">Parcours technique</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Niveau technique</label>
                    <select
                      value={profileData.technicalLevel}
                      onChange={(e) => setProfileData({ ...profileData, technicalLevel: e.target.value as any })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                    >
                      <option value="Débutant">Débutant</option>
                      <option value="Intermédiaire">Intermédiaire</option>
                      <option value="Avancé">Avancé</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Domaine d'intérêt</label>
                    <select
                      value={profileData.domainInterest}
                      onChange={(e) => setProfileData({ ...profileData, domainInterest: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                    >
                      <option value="Développement Web & React">Développement Web & React</option>
                      <option value="Data Science & IA Générative">Data Science & IA</option>
                      <option value="Cybersécurité & Cloud">Cybersécurité & Cloud</option>
                      <option value="UI/UX Design & Product">UI/UX Design & Product</option>
                      <option value="Leadership & Management Tech">Leadership & Management</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn</label>
                  <div className="relative">
                    <Linkedin className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                    <input
                      type="url"
                      value={profileData.linkedin}
                      onChange={(e) => setProfileData({ ...profileData, linkedin: e.target.value })}
                      placeholder="https://linkedin.com/in/monprofil"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Biographie</label>
                  <textarea
                    rows={3}
                    value={profileData.bio}
                    onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                    placeholder="Présentez-vous..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>
              </div>

              {/* Mot de passe */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider">Changer le mot de passe</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nouveau mot de passe</label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-10 pr-10 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-3.5 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Confirmer</label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                      />
                    </div>
                  </div>
                </div>
                {passwordError && (
                  <p className="text-sm text-red-600 font-medium bg-red-50 p-3 rounded-xl">{passwordError}</p>
                )}
              </div>

              {/* Submit */}
              <div className="pt-4 border-t border-gray-200 flex justify-end">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-8 py-3.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm shadow-sm transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSaving ? 'Enregistrement...' : 'Enregistrer'}</span>
                </button>
              </div>

            </form>
          </div>
        )}

      </div>
    </div>
  );
};