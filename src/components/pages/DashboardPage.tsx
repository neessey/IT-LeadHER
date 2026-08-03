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
  Loader2
} from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
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
    t
  } = useApp();

  const [activeTabSection, setActiveTabSection] = useState<'overview' | 'settings'>('overview');
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
  const [downloadingCertId, setDownloadingCertId] = useState<string | null>(null);

  // Référence pour le certificat à télécharger
  const certRef = useRef<HTMLDivElement>(null);

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
const [isDownloading, setIsDownloading] = useState<string | null>(null);

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
  

  return (
    <div className="min-h-screen bg-white pb-16 pt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

        {/* Navigation tabs */}
        <div className="flex items-center gap-2 border-b border-gray-200 pb-3">
          <button
            onClick={() => setActiveTabSection('overview')}
            className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-colors cursor-pointer flex items-center gap-2 ${
              activeTabSection === 'overview'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Mes Formations</span>
          </button>
          <button
            onClick={() => setActiveTabSection('settings')}
            className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-colors cursor-pointer flex items-center gap-2 ${
              activeTabSection === 'settings'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Mon Profil</span>
          </button>
        </div>

        {activeTabSection === 'overview' ? (
          /* OVERVIEW */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Colonne principale */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Formations */}
              <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-rose-600" />
                    <span>Mes formations ({myEnrollments.length})</span>
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
                    {myEnrollments.slice(0, 3).map(enr => {
                      const course = courses.find(c => c.id === enr.courseId);
                      if (!course) return null;

                      return (
                        <div key={enr.id} className="p-4 rounded-2xl border border-gray-100 bg-gray-50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-rose-200 transition-colors">
                          <div className="flex items-center gap-4">
                            <img src={course.thumbnail} alt={course.title} className="w-16 h-16 rounded-xl object-cover shrink-0" />
                            <div>
                              <div className="text-sm font-bold text-gray-900">{course.title}</div>
                              <div className="text-xs text-gray-500 mt-0.5">
                                {enr.completedLessonIds.length}/{course.lessons.length} leçons
                              </div>
                              <div className="w-32 h-1.5 bg-gray-200 rounded-full mt-2 overflow-hidden">
                                <div className="h-full bg-rose-600 rounded-full" style={{ width: `${enr.progress}%` }} />
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={() => navigateToCourse(course.id)}
                            className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-sm font-bold transition-colors shrink-0"
                          >
                            Continuer ({enr.progress}%)
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Événements */}
              <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-4">
                  <Calendar className="w-5 h-5 text-amber-600" />
                  <span>Mes événements ({myEvents.length})</span>
                </h2>

                {myEvents.length === 0 ? (
                  <p className="text-sm text-gray-500 py-4">Aucun événement à venir.</p>
                ) : (
                  <div className="space-y-3">
                    {myEvents.slice(0, 3).map(evt => (
                      <div key={evt.id} className="p-4 rounded-2xl border border-gray-100 bg-gray-50 flex items-center justify-between text-sm">
                        <div>
                          <div className="font-bold text-gray-900">{evt.title}</div>
                          <div className="text-xs text-gray-500">{evt.date} • {evt.location}</div>
                        </div>
                        <span className="px-3 py-1 bg-emerald-50 text-emerald-700 font-bold rounded-lg text-xs">✓ Inscrit</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>

            {/* Colonne latérale */}
            <div className="space-y-8">
              
              {/* Certificats - avec téléchargement direct */}
              <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-4">
                  <Award className="w-5 h-5 text-amber-500" />
                  <span>Certificats ({myCertificates.length})</span>
                </h2>

                {myCertificates.length === 0 ? (
                  <p className="text-sm text-gray-500 leading-relaxed">
                    Terminez un cours à 100% pour obtenir votre premier certificat.
                  </p>
                ) : (
                 <div className="space-y-3">
  {myCertificates.slice(0, 2).map(cert => (
    <div key={cert.id} className="p-4 rounded-2xl bg-rose-50 border border-rose-100 space-y-2">
      <div className="text-sm font-bold text-rose-700">{cert.courseTitle}</div>
      <div className="text-xs text-gray-500">{cert.issueDate}</div>
      <button
        onClick={() => handleDownloadCertificate(cert)}
        disabled={isDownloading === cert.id}
        className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-sm font-bold flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isDownloading === cert.id ? (
          <>
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <span>Téléchargement...</span>
          </>
        ) : (
          <>
            <Download className="w-4 h-4" />
            <span>Télécharger</span>
          </>
        )}
     
    </button>
  </div>
))}
                  </div>
                )}
              </div>

              {/* Statistiques */}
              <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-4">
                  <BarChart3 className="w-5 h-5 text-blue-600" />
                  <span>Statistiques</span>
                </h2>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Formations suivies</span>
                    <span className="font-bold text-gray-900">{myEnrollments.length}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Certificats obtenus</span>
                    <span className="font-bold text-gray-900">{myCertificates.length}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Événements</span>
                    <span className="font-bold text-gray-900">{myEvents.length}</span>
                  </div>
                </div>
              </div>

            </div>

          </div>
        ) : (
          /* SETTINGS */
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