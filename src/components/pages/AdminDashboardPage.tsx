import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Shield, Users, BookOpen, Calendar, FileText, Plus, Award, Trash2, Ban, UserPlus,
  Handshake, Search, ChevronRight, ExternalLink, Upload, Video,
  LayoutDashboard, Settings, Menu, X, Megaphone, LogOut, Youtube, Link, Film
} from 'lucide-react';
import { Course, Event, Article, User, UserRole } from '../../types';

// Config Cloudinary (upload direct côté client, non-signé)
const CLOUDINARY_CLOUD_NAME = (import.meta as any).env.VITE_CLOUDINARY_CLOUD_NAME as string;
const CLOUDINARY_UPLOAD_PRESET = (import.meta as any).env.VITE_CLOUDINARY_UPLOAD_PRESET as string;
const CLOUDINARY_VIDEO_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/video/upload`;

// ------------------------------------------------------------------
// Composants d'UI déclarés en dehors de AdminDashboardPage.
// IMPORTANT : les définir à l'intérieur du composant recréait une
// nouvelle "identité" de composant à CHAQUE frappe clavier (chaque
// re-render), ce qui forçait React à démonter/remonter les <input>
// et faisait perdre le focus après chaque lettre tapée.
// ------------------------------------------------------------------

const Modal = ({ isOpen, onClose, title, onSubmit, children }: any) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
        <h3 className="text-xl font-bold text-gray-900">{title}</h3>
        <form onSubmit={onSubmit} className="space-y-4">
          {children}
          <div className="flex justify-end gap-3 pt-4 border-t border-rose-100">
            <button type="button" onClick={onClose} className="px-6 py-2.5 rounded-xl text-sm font-bold text-gray-500 hover:bg-rose-50 transition-colors">Annuler</button>
            <button type="submit" className="px-6 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-sm font-bold transition-colors">Confirmer</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const InputField = React.memo(({ label, type = 'text', value, onChange, required = true, rows = 1, placeholder = '', icon: Icon }: any) => (
  <div className="space-y-1.5">
    <label className="block text-sm font-bold text-gray-700">{label}</label>
    <div className="relative">
      {Icon && (
        <div className="absolute left-3 top-3 text-gray-400">
          <Icon className="w-4 h-4" />
        </div>
      )}
      {rows > 1 ? (
        <textarea
          rows={rows}
          required={required}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full p-3 rounded-xl border border-rose-200 text-sm focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100 transition-all ${Icon ? 'pl-10' : ''}`}
        />
      ) : (
        <input
          type={type}
          required={required}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full p-3 rounded-xl border border-rose-200 text-sm focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100 transition-all ${Icon ? 'pl-10' : ''}`}
        />
      )}
    </div>
  </div>
));
InputField.displayName = 'InputField';

const ImageUpload = React.memo(({ label, value, onChange, onUpload }: any) => (
  <div className="space-y-1.5">
    <label className="block text-sm font-bold text-gray-700">{label}</label>
    <div className="flex items-center gap-4">
      {value && <img src={value} alt="Aperçu" className="w-16 h-12 rounded-lg object-cover border-2 border-rose-200" />}
      <label className="flex-1 flex items-center justify-center gap-3 p-3 rounded-xl bg-rose-50 hover:bg-rose-100 border-2 border-dashed border-rose-200 hover:border-rose-300 text-sm font-bold text-gray-700 cursor-pointer transition-all">
        <Upload className="w-4 h-4 text-rose-400" />
        <span>Importer une image</span>
        <input type="file" accept="image/*" onChange={e => onUpload(e, onChange)} className="hidden" />
      </label>
    </div>
  </div>
));
ImageUpload.displayName = 'ImageUpload';

export const AdminDashboardPage: React.FC = () => {
  const {
    currentUser, allUsers, courses, events, articles, certificates,
    partnerInquiries, announcementBanner, setAnnouncementBanner,
    updateUserRoleAdmin, toggleUserStatusAdmin, deleteUserAdmin, addUserAdmin,
    addCourseAdmin, deleteCourseAdmin, addEventAdmin, deleteEventAdmin,
    addArticleAdmin, deleteArticleAdmin,
    updatePartnerInquiryStatusAdmin, deletePartnerInquiryAdmin, showToast
  } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'courses' | 'events' | 'blog' | 'partners' | 'settings'>('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('all');
  const [modals, setModals] = useState({ user: false, course: false, event: false, article: false });

  // Type de source vidéo pour les cours
  const [videoSourceType, setVideoSourceType] = useState<'none' | 'youtube' | 'cursa' | 'local'>('none');
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);
  const [videoUploadProgress, setVideoUploadProgress] = useState(0);

  const [newUser, setNewUser] = useState({
    firstName: '', lastName: '', email: '', role: 'member' as UserRole,
    country: "Côte d'Ivoire", technicalLevel: 'Débutant' as any,
    domainInterest: 'Développement Web',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80'
  });

  const [newCourse, setNewCourse] = useState({
    title: '', description: '', fullDescription: '', category: 'dev' as any,
    categoryLabel: 'Développement Web', level: 'Débutant' as any,
    duration: '8 semaines (40h)',
    thumbnail: '',
    videoUrl: '',
    videoFile: null as File | null,
    videoFileName: '',
    instructorName: "Aïcha Diallo", instructorRole: 'Lead Engineer',
    instructorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    skills: 'React, TypeScript, Node.js'
  });

  const [newEvent, setNewEvent] = useState({
    title: '', description: '', type: 'bootcamp' as any,
    typeLabel: 'Bootcamp Pratique', date: '15 Novembre 2026',
    time: '14:00 - 17:00 (GMT)', location: 'Google Meet', maxCapacity: 100,
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80'
  });

  const [newArticle, setNewArticle] = useState({
    title: '', summary: '', content: '', category: 'Leadership' as any,
    authorName: "Équipe Éditoriale IT-LeadHER",
    cover: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80',
    readTime: '5 min'
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, callback: (url: string) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 8 * 1024 * 1024) return showToast('Image trop volumineuse (max 8 Mo)');
    const reader = new FileReader();
    reader.onloadend = () => reader.result && callback(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Vérifier le type de fichier
    if (!file.type.startsWith('video/')) {
      showToast('Veuillez sélectionner un fichier vidéo.', 'error');
      return;
    }

    // Vérifier la taille (max 150 Mo, largement suffisant pour des leçons de ~3 min)
    if (file.size > 150 * 1024 * 1024) {
      showToast('La vidéo est trop volumineuse (max 150 Mo). Privilégiez des leçons courtes (~3 min).', 'error');
      return;
    }

    if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
      showToast('Configuration Cloudinary manquante (variables VITE_CLOUDINARY_...).', 'error');
      return;
    }

    // Aperçu local instantané pendant l'upload
    setNewCourse(prev => ({
      ...prev,
      videoFile: file,
      videoFileName: file.name,
      videoUrl: URL.createObjectURL(file)
    }));
    setVideoSourceType('local');
    setIsUploadingVideo(true);
    setVideoUploadProgress(0);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    formData.append('resource_type', 'video');

    const xhr = new XMLHttpRequest();
    xhr.open('POST', CLOUDINARY_VIDEO_UPLOAD_URL, true);

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        setVideoUploadProgress(Math.round((event.loaded / event.total) * 100));
      }
    };

    xhr.onload = () => {
      setIsUploadingVideo(false);
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const data = JSON.parse(xhr.responseText);
          setNewCourse(prev => ({
            ...prev,
            videoFile: file,
            videoFileName: file.name,
            videoUrl: data.secure_url as string
          }));
          showToast(`Vidéo "${file.name}" envoyée avec succès !`);
        } catch {
          showToast("Erreur lors de la lecture de la réponse Cloudinary.", 'error');
        }
      } else {
        showToast("Échec de l'envoi de la vidéo. Vérifiez votre upload preset Cloudinary.", 'error');
      }
    };

    xhr.onerror = () => {
      setIsUploadingVideo(false);
      showToast("Erreur réseau pendant l'envoi de la vidéo.", 'error');
    };

    xhr.send(formData);
  };

  const extractYouTubeId = (url: string): string | null => {
    const patterns = [
      /(?:youtube\.com\/watch\?v=)([^&]+)/,
      /(?:youtu\.be\/)([^?]+)/,
      /(?:youtube\.com\/embed\/)([^?]+)/
    ];
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    return null;
  };

  const isCursaUrl = (url: string): boolean => {
    return url.includes('cursa.app') || url.includes('cursa');
  };

  const createUser = (e: React.FormEvent) => {
    e.preventDefault();
    addUserAdmin({
      id: `user-${Date.now()}`,
      ...newUser,
      status: 'active',
      createdAt: new Date().toISOString().split('T')[0]
    } as User);
    setModals(prev => ({ ...prev, user: false }));
    setNewUser({
      firstName: '', lastName: '', email: '', role: 'member' as UserRole,
      country: "Côte d'Ivoire", technicalLevel: 'Débutant' as any,
      domainInterest: 'Développement Web',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80'
    });
  };

  const createCourse = (e: React.FormEvent) => {
    e.preventDefault();

    if (isUploadingVideo) {
      showToast("Patiente, la vidéo est encore en cours d'envoi...", 'error');
      return;
    }

    const courseId = `course-${Date.now()}`;

    let thumbnail = newCourse.thumbnail;
    const videoUrl = newCourse.videoUrl;

    // Si c'est YouTube, générer la miniature
    if (videoSourceType === 'youtube' && newCourse.videoUrl) {
      const videoId = extractYouTubeId(newCourse.videoUrl);
      if (videoId) {
        thumbnail = `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
      }
    }

    // On exclut les champs internes à l'UI (File brut, nom de fichier, string skills)
    // qui ne doivent JAMAIS être envoyés tels quels à Firestore : un objet File
    // n'est pas sérialisable et fait planter setDoc(), ce qui bloquait le bouton
    // "Confirmer" sans message d'erreur visible.
    const { videoFile, videoFileName, skills, ...courseFields } = newCourse;

    addCourseAdmin({
      id: courseId,
      ...courseFields,
      thumbnail: thumbnail || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80',
      videoUrl: videoUrl || '',
      videoSource: videoSourceType,
      modulesCount: 5,
      rating: 5.0,
      enrolledCount: 1,
      skillsAcquired: skills.split(',').map(s => s.trim()),
      lessons: [{
        id: `l-${Date.now()}-1`,
        courseId,
        title: 'Introduction',
        duration: '30 min',
        videoUrl: videoUrl || '',
        videoSource: videoSourceType,
        content: 'Bienvenue dans ce cours.',
        order: 1
      }]
    } as unknown as Course);

    setModals(prev => ({ ...prev, course: false }));
    setNewCourse({
      title: '', description: '', fullDescription: '', category: 'dev' as any,
      categoryLabel: 'Développement Web', level: 'Débutant' as any,
      duration: '8 semaines (40h)',
      thumbnail: '',
      videoUrl: '',
      videoFile: null,
      videoFileName: '',
      instructorName: "Aïcha Diallo", instructorRole: 'Lead Engineer',
      instructorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
      skills: 'React, TypeScript, Node.js'
    });
    setVideoSourceType('none');
    setVideoUploadProgress(0);
    showToast('Formation créée avec succès !');
  };

  const createEvent = (e: React.FormEvent) => {
    e.preventDefault();
    addEventAdmin({
      id: `event-${Date.now()}`,
      ...newEvent,
      isOnline: true,
      registeredCount: 0,
      speakers: [{ name: 'Comité IT-LeadHER', role: 'Organisatrices', company: 'IT-LeadHER', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80' }]
    } as Event);
    setModals(prev => ({ ...prev, event: false }));
    setNewEvent({
      title: '', description: '', type: 'bootcamp' as any,
      typeLabel: 'Bootcamp Pratique', date: '15 Novembre 2026',
      time: '14:00 - 17:00 (GMT)', location: 'Google Meet', maxCapacity: 100,
      image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80'
    });
  };

  const createArticle = (e: React.FormEvent) => {
    e.preventDefault();
    addArticleAdmin({
      id: `art-${Date.now()}`,
      ...newArticle,
      slug: newArticle.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      authorRole: 'Direction éditoriale',
      authorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
      createdAt: new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }),
      tags: ['IT-LeadHER', newArticle.category, 'Tech'],
      comments: []
    } as Article);
    setModals(prev => ({ ...prev, article: false }));
    setNewArticle({
      title: '', summary: '', content: '', category: 'Leadership' as any,
      authorName: "Équipe Éditoriale IT-LeadHER",
      cover: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80',
      readTime: '5 min'
    });
  };

  const filteredUsers = allUsers.filter(u => {
    const search = userSearch.toLowerCase();
    return (u.firstName.toLowerCase().includes(search) ||
            u.lastName.toLowerCase().includes(search) ||
            u.email.toLowerCase().includes(search) ||
            u.country.toLowerCase().includes(search)) &&
           (userRoleFilter === 'all' || u.role === userRoleFilter);
  });

  const pendingPartners = partnerInquiries.filter(p => p.status === 'new').length;

  const navItems = [
    { id: 'overview', label: 'Vue d\'ensemble', icon: LayoutDashboard },
    { id: 'users', label: 'Utilisatrices', icon: Users, badge: allUsers.length },
    { id: 'courses', label: 'Formations', icon: BookOpen, badge: courses.length },
    { id: 'events', label: 'Événements', icon: Calendar, badge: events.length },
    { id: 'blog', label: 'Blog', icon: FileText, badge: articles.length },
    { id: 'partners', label: 'Partenaires', icon: Handshake, badge: pendingPartners },
    { id: 'settings', label: 'Paramètres', icon: Settings }
  ];

  const renderOverview = () => (
    <div className="space-y-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Membres', value: allUsers.length, icon: Users },
          { label: 'Formations', value: courses.length, icon: BookOpen },
          { label: 'Événements', value: events.length, icon: Calendar },
          { label: 'Diplômes Certifiés', value: certificates.length , icon: Award }
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-rose-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase tracking-wider text-rose-400">{stat.label}</span>
              <div className="p-3 rounded-2xl bg-rose-50 text-rose-400"><stat.icon className="w-5 h-5" /></div>
            </div>
            <div className="text-3xl font-black text-gray-900 mt-3">{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="bg-white p-6 rounded-3xl border border-rose-100 shadow-sm">
        <div className="flex items-center justify-between border-b border-rose-100 pb-4 mb-4">
          <span className="font-black text-base text-gray-900">Partenariats récents ({partnerInquiries.length})</span>
          <button onClick={() => setActiveTab('partners')} className="text-sm font-bold text-rose-500 hover:text-rose-600 transition-colors">Tout voir →</button>
        </div>
        <div className="space-y-3">
          {partnerInquiries.slice(0, 3).map((item: any) => (
            <div key={item.id} className="p-4 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-between">
              <div>
                <div className="text-sm font-bold text-gray-900">{item.companyName}</div>
                <div className="text-xs text-gray-500">{item.partnerType}</div>
              </div>
              <button onClick={() => updatePartnerInquiryStatusAdmin(item.id, 'approved')} className="px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold transition-colors">Valider</button>
              <button onClick={() => deletePartnerInquiryAdmin(item.id)} className="px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold transition-colors">Supprimer</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderUsers = () => (
    <div className="bg-white p-8 rounded-3xl border border-rose-100 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-rose-400 absolute left-3 top-3.5" />
          <input type="text" value={userSearch} onChange={e => setUserSearch(e.target.value)} placeholder="Rechercher..." className="w-full pl-10 pr-4 py-3 rounded-xl border border-rose-200 text-sm bg-rose-50 focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100 transition-all" />
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select value={userRoleFilter} onChange={e => setUserRoleFilter(e.target.value)} className="px-4 py-3 rounded-xl border border-rose-200 text-sm font-bold bg-rose-50 focus:outline-none focus:border-rose-400">
            <option value="all">Tous les rôles ({allUsers.length})</option>
            {['member', 'mentor', 'partner', 'admin'].map(role => <option key={role} value={role}>{role.charAt(0).toUpperCase() + role.slice(1)}s</option>)}
          </select>
          <button onClick={() => setModals(prev => ({ ...prev, user: true }))} className="px-5 py-3 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-sm font-bold flex items-center gap-2 transition-colors">
            <UserPlus className="w-4 h-4" /> Nouvel Utilisateur
          </button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-rose-200">
        <table className="w-full text-left text-sm">
          <thead className="bg-rose-50 text-rose-600 uppercase text-xs font-extrabold tracking-wider">
            <tr><th className="p-4">Utilisatrice</th><th className="p-4">E-mail</th><th className="p-4">Rôle</th><th className="p-4">Pays</th><th className="p-4">Niveau</th><th className="p-4">Statut</th><th className="p-4 text-right">Actions</th></tr>
          </thead>
          <tbody className="divide-y divide-rose-100">
            {filteredUsers.map(u => (
              <tr key={u.id} className="hover:bg-rose-50 transition-colors">
                <td className="p-4"><div className="flex items-center gap-3"><img src={u.avatar} alt={u.firstName} className="w-10 h-10 rounded-full object-cover border-2 border-rose-200" /><div className="font-bold text-gray-900">{u.firstName} {u.lastName}</div></div></td>
                <td className="p-4 text-gray-600 font-mono text-xs">{u.email}</td>
                <td className="p-4">
                  <select value={u.role} onChange={e => updateUserRoleAdmin(u.id, e.target.value as UserRole)} className="px-3 py-1.5 rounded-lg text-xs font-bold border bg-rose-50 text-rose-700 border-rose-200 focus:outline-none focus:border-rose-400">
                    {['member', 'mentor', 'partner', 'admin'].map(role => <option key={role} value={role}>{role.charAt(0).toUpperCase() + role.slice(1)}</option>)}
                  </select>
                </td>
                <td className="p-4 text-gray-700">{u.country}</td>
                <td className="p-4 text-gray-700 font-semibold">{u.technicalLevel}</td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${u.status === 'blocked' ? 'bg-rose-100 text-rose-700' : 'bg-rose-50 text-rose-600'}`}>
                    {u.status === 'blocked' ? '⚠️ Suspendu' : '✓ Actif'}
                  </span>
                </td>
                <td className="p-4 text-right space-x-2">
                  <button onClick={() => toggleUserStatusAdmin(u.id, u.status === 'blocked' ? 'active' : 'blocked')} className="p-2 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors"><Ban className="w-4 h-4" /></button>
                  <button onClick={() => deleteUserAdmin(u.id)} className="p-2 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors"><Trash2 className="w-4 h-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderCourses = () => (
    <div className="bg-white p-8 rounded-3xl border border-rose-100 shadow-sm space-y-6">
      <div className="flex items-center justify-between">
        <span className="text-sm font-bold text-rose-600">Formations de l'Académie ({courses.length})</span>
        <button onClick={() => setModals(prev => ({ ...prev, course: true }))} className="px-5 py-3 bg-rose-500 hover:bg-rose-600 text-white text-sm font-bold rounded-xl flex items-center gap-2 transition-colors">
          <Plus className="w-4 h-4" /> Publier un Cours
        </button>
      </div>
      <div className="overflow-x-auto rounded-2xl border border-rose-200">
        <table className="w-full text-left text-sm">
          <thead className="bg-rose-50 text-rose-600 uppercase text-xs font-extrabold tracking-wider">
            <tr><th className="p-4">Intitulé</th><th className="p-4">Catégorie</th><th className="p-4">Source</th><th className="p-4">Inscrites</th><th className="p-4 text-right">Actions</th></tr>
          </thead>
          <tbody className="divide-y divide-rose-100">
            {courses.map(c => (
              <tr key={c.id} className="hover:bg-rose-50 transition-colors">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <img src={c.thumbnail} alt={c.title} className="w-12 h-12 rounded-lg object-cover border border-rose-200" />
                    <div className="font-bold text-gray-900">{c.title}</div>
                  </div>
                </td>
                <td className="p-4 text-rose-500 font-bold">{c.categoryLabel}</td>
                <td className="p-4">
                  {c.videoSource === 'youtube' && <Youtube className="w-5 h-5 text-red-500" />}
                  {c.videoSource === 'local' && <Film className="w-5 h-5 text-green-500" />}
                  {(!c.videoSource || c.videoSource === 'none') && <span className="text-gray-400 text-xs">Non définie</span>}
                </td>
                <td className="p-4 font-bold text-gray-900">{c.enrolledCount}</td>
                <td className="p-4 text-right">
                  <button onClick={() => deleteCourseAdmin(c.id)} className="p-2 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderEvents = () => (
    <div className="bg-white p-8 rounded-3xl border border-rose-100 shadow-sm space-y-6">
      <div className="flex items-center justify-between">
        <span className="text-sm font-bold text-rose-600">Programme des événements ({events.length})</span>
        <button onClick={() => setModals(prev => ({ ...prev, event: true }))} className="px-5 py-3 bg-rose-500 hover:bg-rose-600 text-white text-sm font-bold rounded-xl flex items-center gap-2 transition-colors">
          <Plus className="w-4 h-4" /> Créer un Événement
        </button>
      </div>
      {events.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <Calendar className="w-12 h-12 mx-auto text-rose-200 mb-3" />
          <p className="text-sm">Aucun événement pour le moment</p>
          <p className="text-xs text-gray-400">Créez votre premier événement avec le bouton ci-dessus</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-rose-200">
          <table className="w-full text-left text-sm">
            <thead className="bg-rose-50 text-rose-600 uppercase text-xs font-extrabold tracking-wider">
              <tr><th className="p-4">Titre</th><th className="p-4">Format</th><th className="p-4">Date</th><th className="p-4">Inscriptions</th><th className="p-4 text-right">Actions</th></tr>
            </thead>
            <tbody className="divide-y divide-rose-100">
              {events.map(e => (
                <tr key={e.id} className="hover:bg-rose-50 transition-colors">
                  <td className="p-4"><div className="flex items-center gap-3"><img src={e.image} alt={e.title} className="w-12 h-12 rounded-lg object-cover border border-rose-200" /><div className="font-bold text-gray-900">{e.title}</div></div></td>
                  <td className="p-4"><span className="px-3 py-1 bg-rose-50 text-rose-600 rounded-lg text-xs font-extrabold">{e.typeLabel}</span></td>
                  <td className="p-4 text-gray-700">{e.date}</td>
                  <td className="p-4 font-bold text-gray-900">{e.registeredCount} / {e.maxCapacity}</td>
                  <td className="p-4 text-right"><button onClick={() => deleteEventAdmin(e.id)} className="p-2 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors"><Trash2 className="w-4 h-4" /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  const renderBlog = () => (
    <div className="bg-white p-8 rounded-3xl border border-rose-100 shadow-sm space-y-6">
      <div className="flex items-center justify-between">
        <span className="text-sm font-bold text-rose-600">Articles et ressources ({articles.length})</span>
        <button onClick={() => setModals(prev => ({ ...prev, article: true }))} className="px-5 py-3 bg-rose-500 hover:bg-rose-600 text-white text-sm font-bold rounded-xl flex items-center gap-2 transition-colors">
          <Plus className="w-4 h-4" /> Publier un Article
        </button>
      </div>
      {articles.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <FileText className="w-12 h-12 mx-auto text-rose-200 mb-3" />
          <p className="text-sm">Aucun article publié</p>
          <p className="text-xs text-gray-400">Commencez par rédiger votre premier article</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-rose-200">
          <table className="w-full text-left text-sm">
            <thead className="bg-rose-50 text-rose-600 uppercase text-xs font-extrabold tracking-wider">
              <tr><th className="p-4">Article</th><th className="p-4">Thématique</th><th className="p-4">Auteure</th><th className="p-4">Commentaires</th><th className="p-4 text-right">Actions</th></tr>
            </thead>
            <tbody className="divide-y divide-rose-100">
              {articles.map(a => (
                <tr key={a.id} className="hover:bg-rose-50 transition-colors">
                  <td className="p-4"><div className="flex items-center gap-3"><img src={a.cover} alt={a.title} className="w-12 h-12 rounded-lg object-cover border border-rose-200" /><div className="font-bold text-gray-900 max-w-xs truncate">{a.title}</div></div></td>
                  <td className="p-4 text-rose-500 font-bold">{a.category}</td>
                  <td className="p-4 text-gray-700">{a.authorName}</td>
                  <td className="p-4 text-gray-700 font-bold">{a.comments.length}</td>
                  <td className="p-4 text-right"><button onClick={() => deleteArticleAdmin(a.id)} className="p-2 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors"><Trash2 className="w-4 h-4" /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  const renderPartners = () => (
    <div className="bg-white p-8 rounded-3xl border border-rose-100 shadow-sm">
      <div className="overflow-x-auto rounded-2xl border border-rose-200">
        <table className="w-full text-left text-sm">
          <thead className="bg-rose-50 text-rose-600 uppercase text-xs font-extrabold tracking-wider">
            <tr><th className="p-4">Entreprise</th><th className="p-4">Contact</th><th className="p-4">Type</th><th className="p-4">Message</th><th className="p-4">Statut</th><th className="p-4 text-right">Actions</th></tr>
          </thead>
          <tbody className="divide-y divide-rose-100">
            {partnerInquiries.map(p => (
              <tr key={p.id} className="hover:bg-rose-50 transition-colors">
                <td className="p-4 font-bold text-gray-900">{p.companyName}</td>
                <td className="p-4"><div className="font-medium text-gray-900">{p.contactName}</div><div className="text-xs text-gray-500 font-mono">{p.email}</div></td>
                <td className="p-4 text-rose-500 font-bold">{p.partnerType}</td>
                <td className="p-4 text-gray-600 max-w-xs truncate">{p.message}</td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-extrabold ${p.status === 'approved' ? 'bg-rose-100 text-rose-700' : p.status === 'contacted' ? 'bg-rose-50 text-rose-600' : 'bg-rose-50 text-rose-500'}`}>
                    {p.status === 'approved' ? '✓ Validé' : p.status === 'contacted' ? '💬 Contacté' : '🆕 Nouveau'}
                  </span>
                </td>
                <td className="p-4 text-right space-x-2">
                  <button onClick={() => updatePartnerInquiryStatusAdmin(p.id, 'contacted')} className="px-4 py-2 bg-rose-100 hover:bg-rose-200 text-rose-700 rounded-xl text-xs font-bold transition-colors">Contacté</button>
                  <button onClick={() => updatePartnerInquiryStatusAdmin(p.id, 'approved')} className="px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-xs font-bold transition-colors">Valider</button>
                  <button onClick={() => deletePartnerInquiryAdmin(p.id)} className="px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-xs font-bold transition-colors">Supprimer</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="bg-white p-8 rounded-3xl border border-rose-100 shadow-sm max-w-2xl">
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-black text-gray-900 flex items-center gap-3">
            <Megaphone className="w-5 h-5 text-rose-500" />
            Bannière d'Annonce
          </h3>
          <p className="text-sm text-gray-500 mt-1">Modifier le message d'annonce affiché tout en haut du site</p>
        </div>
        <input type="text" value={announcementBanner} onChange={e => setAnnouncementBanner(e.target.value)} placeholder="Saisissez votre message..." className="w-full p-4 rounded-xl border-2 border-rose-200 text-sm font-bold focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100 transition-all" />
        <button onClick={() => showToast('Bannière mise à jour avec succès !')} className="px-6 py-3 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-sm transition-colors">Enregistrer</button>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'overview': return renderOverview();
      case 'users': return renderUsers();
      case 'courses': return renderCourses();
      case 'events': return renderEvents();
      case 'blog': return renderBlog();
      case 'partners': return renderPartners();
      case 'settings': return renderSettings();
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-rose-50/30 flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden bg-white text-gray-900 px-4 py-4 flex items-center justify-between border-b border-rose-200">
        <div className="flex items-center gap-3 font-black">
          <div className="w-10 h-10 rounded-xl bg-rose-500 flex items-center justify-center text-white">
                                        <img src="/assets/ai.jpeg" alt="IT-LeadHER" className="w-14 h-15 object-contain rounded-4xl" />
          </div>
          <span className="text-base">Admin</span>
        </div>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 transition-colors">
          {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`fixed md:sticky top-0 left-0 z-40 w-64 bg-white text-gray-700 h-screen flex flex-col justify-between border-r border-rose-200 transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="p-6 space-y-6 overflow-y-auto">
          <div className="flex items-center gap-3 pb-6 border-b border-rose-200">
            <div className="w-10 h-10 rounded-xl bg-rose-500 flex items-center justify-center text-white">
                <img src="/assets/logo.jpeg" alt="IT-LeadHER" className="w-10 h-10 object-contain" />
            </div>
            <div>
              <div className="text-sm font-black text-gray-900">IT-LeadHER</div>
              <div className="text-[10px] text-rose-400 font-bold uppercase tracking-wider">Admin</div>
            </div>
          </div>

          <nav className="space-y-1">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => { setActiveTab(item.id as any); setIsSidebarOpen(false); }}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all ${isActive ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'text-gray-500 hover:text-rose-600 hover:bg-rose-50'}`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-5 h-5 ${isActive ? 'text-rose-500' : 'text-gray-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== null && item.badge !== undefined && (
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${isActive ? 'bg-rose-100 text-rose-700' : 'bg-rose-50 text-rose-500'}`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-rose-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={currentUser?.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80'} alt="Admin" className="w-8 h-8 rounded-full object-cover border border-rose-200" />
            <div>
              <div className="text-xs font-bold text-gray-900 truncate">{currentUser?.firstName || 'Admin'}</div>
              <div className="text-[10px] text-rose-400 font-medium">Super Admin</div>
            </div>
          </div>
          <button onClick={() => window.location.href = '/'} className="p-2 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-500 hover:text-rose-600 transition-colors">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {isSidebarOpen && <div onClick={() => setIsSidebarOpen(false)} className="fixed inset-0 bg-black/40 z-30 md:hidden" />}

      <main className="flex-1 p-6 sm:p-8 lg:p-10 space-y-8 overflow-x-hidden">
        <div className="bg-white p-6 rounded-3xl border border-rose-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-sm font-bold text-rose-400">
              <span>Administration</span><ChevronRight className="w-4 h-4" /><span className="text-gray-800">{navItems.find(i => i.id === activeTab)?.label}</span>
            </div>
            <h1 className="text-2xl font-black text-gray-900 mt-1">{navItems.find(i => i.id === activeTab)?.label}</h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="px-4 py-2 rounded-xl bg-rose-50 text-rose-600 text-xs font-extrabold flex items-center gap-2">
              <Users className="w-4 h-4" /> {allUsers.length} Membres
            </span>
            <span className="px-4 py-2 rounded-xl bg-rose-50 text-rose-600 text-xs font-extrabold flex items-center gap-2">
              <BookOpen className="w-4 h-4" /> {courses.length} Cours
            </span>
          </div>
        </div>

        {renderContent()}
      </main>

      {/* MODAL: Créer une formation avec plusieurs sources vidéo */}
      <Modal isOpen={modals.course} onClose={() => setModals(prev => ({ ...prev, course: false }))} title="Créer une formation" onSubmit={createCourse}>
        <InputField label="Titre du cours" value={newCourse.title} onChange={(e: any) => setNewCourse({ ...newCourse, title: e.target.value })} />
        <InputField label="Description courte" value={newCourse.description} onChange={(e: any) => setNewCourse({ ...newCourse, description: e.target.value, fullDescription: e.target.value })} />
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-sm font-bold text-gray-700">Catégorie</label>
            <select value={newCourse.category} onChange={e => setNewCourse({ ...newCourse, category: e.target.value as any, categoryLabel: e.target.options[e.target.selectedIndex].text })} className="w-full p-3 rounded-xl border border-rose-200 text-sm focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100 transition-all">
              {['dev', 'data', 'ai', 'cyber', 'design', 'leadership'].map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
            </select>
          </div>
          <InputField label="Instructeur" value={newCourse.instructorName} onChange={(e: any) => setNewCourse({ ...newCourse, instructorName: e.target.value })} />
        </div>

        {/* Sélection de la source vidéo */}
        <div className="space-y-2">
          <label className="block text-sm font-bold text-gray-700">Source de la vidéo</label>
          <div className="flex gap-3 flex-wrap">
            <button
              type="button"
              onClick={() => setVideoSourceType('youtube')}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors flex items-center gap-2 ${
                videoSourceType === 'youtube' ? 'bg-rose-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Youtube className="w-4 h-4" />
              YouTube
            </button>
            <button
              type="button"
              onClick={() => setVideoSourceType('cursa')}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors flex items-center gap-2 ${
                videoSourceType === 'cursa' ? 'bg-rose-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Link className="w-4 h-4" />
              Cursa.app
            </button>
            <button
              type="button"
              onClick={() => setVideoSourceType('local')}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors flex items-center gap-2 ${
                videoSourceType === 'local' ? 'bg-rose-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Film className="w-4 h-4" />
              Téléphone
            </button>
            <button
              type="button"
              onClick={() => setVideoSourceType('none')}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors ${
                videoSourceType === 'none' ? 'bg-rose-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Aucune
            </button>
          </div>
        </div>

        {/* Champ selon la source */}
        {videoSourceType === 'youtube' && (
          <InputField 
            label="URL YouTube (ex: https://www.youtube.com/watch?v=XXXXX)" 
            value={newCourse.videoUrl} 
            onChange={(e: any) => {
              const url = e.target.value;
              setNewCourse({ ...newCourse, videoUrl: url });
              const videoId = extractYouTubeId(url);
              if (videoId) {
                setNewCourse(prev => ({ ...prev, thumbnail: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg` }));
              }
            }}
            placeholder="https://www.youtube.com/watch?v=..."
            icon={Youtube}
          />
        )}

        {videoSourceType === 'cursa' && (
          <InputField 
            label="Lien Cursa.app" 
            value={newCourse.videoUrl} 
            onChange={(e: any) => setNewCourse({ ...newCourse, videoUrl: e.target.value })}
            placeholder="https://cursa.app/video/..."
            icon={Link}
          />
        )}

        {videoSourceType === 'local' && (
          <div className="space-y-2">
            <label className="block text-sm font-bold text-gray-700">Choisir une vidéo depuis votre appareil</label>
            <div className="flex items-center gap-4">
              <label className={`flex-1 flex items-center justify-center gap-3 p-4 rounded-xl bg-rose-50 hover:bg-rose-100 border-2 border-dashed border-rose-200 hover:border-rose-300 text-sm font-bold text-gray-700 transition-all ${isUploadingVideo ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}>
                <Upload className="w-5 h-5 text-rose-400" />
                <span>{newCourse.videoFileName || 'Choisir une vidéo (MP4, WebM — leçons courtes ~3 min)'}</span>
                <input type="file" accept="video/*" onChange={handleVideoUpload} disabled={isUploadingVideo} className="hidden" />
              </label>
              {newCourse.videoFileName && !isUploadingVideo && (
                <button
                  type="button"
                  onClick={() => {
                    setNewCourse({ ...newCourse, videoFile: null, videoFileName: '', videoUrl: '' });
                    setVideoSourceType('none');
                    setVideoUploadProgress(0);
                  }}
                  className="px-3 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 text-sm font-bold transition-colors"
                >
                  ✕ Supprimer
                </button>
              )}
            </div>

            {isUploadingVideo && (
              <div className="bg-rose-50 p-3 rounded-xl border border-rose-200 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-rose-600">
                  <span>Envoi vers Cloudinary...</span>
                  <span>{videoUploadProgress}%</span>
                </div>
                <div className="w-full h-2 bg-rose-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-rose-500 rounded-full transition-all duration-200"
                    style={{ width: `${videoUploadProgress}%` }}
                  />
                </div>
              </div>
            )}

            {!isUploadingVideo && newCourse.videoFile && newCourse.videoUrl && !newCourse.videoUrl.startsWith('blob:') && (
              <div className="bg-green-50 p-3 rounded-xl border border-green-200">
                <p className="text-xs text-green-700">
                  ✅ Vidéo envoyée : <span className="font-bold">{newCourse.videoFileName}</span>
                  <br />
                  Taille : {(newCourse.videoFile.size / (1024 * 1024)).toFixed(2)} Mo — hébergée sur Cloudinary
                </p>
              </div>
            )}
          </div>
        )}

        {/* Aperçu miniature */}
        {newCourse.thumbnail && newCourse.videoUrl && videoSourceType !== 'local' && (
          <div className="bg-rose-50 p-3 rounded-xl border border-rose-200">
            <p className="text-xs font-bold text-rose-600 mb-2">Aperçu de la miniature :</p>
            <img src={newCourse.thumbnail} alt="Miniature" className="w-40 h-24 object-cover rounded-lg border border-rose-200" />
          </div>
        )}

        {videoSourceType === 'local' && newCourse.videoFile && (
          <div className="bg-rose-50 p-3 rounded-xl border border-rose-200">
            <p className="text-xs font-bold text-rose-600 mb-2">Aperçu vidéo :</p>
            <video controls className="w-full max-h-48 rounded-lg border border-rose-200">
              <source src={newCourse.videoUrl} type={newCourse.videoFile?.type} />
              Votre navigateur ne supporte pas la lecture vidéo.
            </video>
          </div>
        )}

        <ImageUpload label="Image de couverture (optionnel)" value={newCourse.thumbnail} onChange={(url: any) => setNewCourse({ ...newCourse, thumbnail: url })} onUpload={handleImageUpload} />
        <ImageUpload label="Photo de l'instructeur" value={newCourse.instructorAvatar} onChange={(url: any) => setNewCourse({ ...newCourse, instructorAvatar: url })} onUpload={handleImageUpload} />
        
        <InputField label="Compétences (séparées par des virgules)" value={newCourse.skills} onChange={(e: any) => setNewCourse({ ...newCourse, skills: e.target.value })} />
      </Modal>

      <Modal isOpen={modals.user} onClose={() => setModals(prev => ({ ...prev, user: false }))} title="Ajouter un Utilisateur" onSubmit={createUser}>
        <div className="grid grid-cols-2 gap-4">
          <InputField label="Prénom" value={newUser.firstName} onChange={(e: any) => setNewUser({ ...newUser, firstName: e.target.value })} />
          <InputField label="Nom" value={newUser.lastName} onChange={(e: any) => setNewUser({ ...newUser, lastName: e.target.value })} />
        </div>
        <InputField label="E-mail" type="email" value={newUser.email} onChange={(e: any) => setNewUser({ ...newUser, email: e.target.value })} />
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-sm font-bold text-gray-700">Rôle</label>
            <select value={newUser.role} onChange={e => setNewUser({ ...newUser, role: e.target.value as UserRole })} className="w-full p-3 rounded-xl border border-rose-200 text-sm focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100 transition-all">
              {['member', 'mentor', 'partner', 'admin'].map(r => <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>)}
            </select>
          </div>
          <InputField label="Pays" value={newUser.country} onChange={(e: any) => setNewUser({ ...newUser, country: e.target.value })} />
        </div>
        <ImageUpload label="Photo de profil" value={newUser.avatar} onChange={(url: any) => setNewUser({ ...newUser, avatar: url })} onUpload={handleImageUpload} />
      </Modal>

      <Modal isOpen={modals.event} onClose={() => setModals(prev => ({ ...prev, event: false }))} title="Créer un Événement" onSubmit={createEvent}>
        <InputField label="Titre" value={newEvent.title} onChange={(e: any) => setNewEvent({ ...newEvent, title: e.target.value })} />
        <InputField label="Description" rows={3} value={newEvent.description} onChange={(e: any) => setNewEvent({ ...newEvent, description: e.target.value })} />
        <div className="grid grid-cols-2 gap-4">
          <InputField label="Date" value={newEvent.date} onChange={(e: any) => setNewEvent({ ...newEvent, date: e.target.value })} />
          <InputField label="Capacité" type="number" value={newEvent.maxCapacity} onChange={(e: any) => setNewEvent({ ...newEvent, maxCapacity: parseInt(e.target.value) || 100 })} />
        </div>
        <ImageUpload label="Image" value={newEvent.image} onChange={(url: any) => setNewEvent({ ...newEvent, image: url })} onUpload={handleImageUpload} />
      </Modal>

      <Modal isOpen={modals.article} onClose={() => setModals(prev => ({ ...prev, article: false }))} title="Rédiger un Article" onSubmit={createArticle}>
        <InputField label="Titre" value={newArticle.title} onChange={(e: any) => setNewArticle({ ...newArticle, title: e.target.value })} />
        <InputField label="Résumé" value={newArticle.summary} onChange={(e: any) => setNewArticle({ ...newArticle, summary: e.target.value })} />
        <InputField label="Contenu" rows={5} value={newArticle.content} onChange={(e: any) => setNewArticle({ ...newArticle, content: e.target.value })} />
        <ImageUpload label="Image" value={newArticle.cover} onChange={(url: any) => setNewArticle({ ...newArticle, cover: url })} onUpload={handleImageUpload} />
      </Modal>
    </div>
  );
};