import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  Language,
  User,
  Course,
  Enrollment,
  Certificate,
  Event,
  Mentor,
  Article,
  Partner,
  Testimonial,
  TeamMember,
  MentorshipRequest,
  PartnerInquiry
} from '../types';
import {
  initialCourses,
  initialMentors,
  initialEvents,
  initialArticles,
  initialPartners,
  initialTestimonials,
  initialTeam,
  demoUsers
} from '../data/initialData';
import { translations } from '../data/translations';
import { auth, googleProvider, db } from '../firebase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  updatePassword
} from 'firebase/auth';
import {
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot
} from 'firebase/firestore';

interface Toast {
  type: 'success' | 'info' | 'error';
  message: string;
}

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: typeof translations['fr'];
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  allUsers: User[];
  courses: Course[];
  enrollments: Enrollment[];
  certificates: Certificate[];
  events: Event[];
  mentors: Mentor[];
  articles: Article[];
  partners: Partner[];
  testimonials: Testimonial[];
  team: TeamMember[];
  mentorshipRequests: MentorshipRequest[];
  partnerInquiries: PartnerInquiry[];
  announcementBanner: string;
  setAnnouncementBanner: (banner: string) => void;

  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedCourseId: string | null;
  setSelectedCourseId: (id: string | null) => void;
  selectedArticleSlug: string | null;
  setSelectedArticleSlug: (slug: string | null) => void;
  selectedCertificate: Certificate | null;
  setSelectedCertificate: (cert: Certificate | null) => void;
  isAiModalOpen: boolean;
  setIsAiModalOpen: (open: boolean) => void;
  toast: Toast | null;
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
  
  // Actions
  login: (email: string, password?: string) => Promise<boolean> | boolean;
  loginWithGoogle: () => Promise<boolean>;
  logout: () => Promise<void> | void;
  registerUser: (userData: Partial<User>, password?: string) => Promise<void> | void;
  updateUserProfile: (userId: string, data: Partial<User>, newPassword?: string) => Promise<void> | void;
  enrollInCourse: (courseId: string) => void;
  completeLesson: (courseId: string, lessonId: string) => void;
  registerForEvent: (eventId: string) => void;
  requestMentorship: (mentorId: string, message: string) => void;
  addArticleComment: (articleSlug: string, text: string) => void;
  submitPartnerInquiry: (inquiry: Omit<PartnerInquiry, 'id' | 'createdAt' | 'status'>) => void;

  // Admin Actions
  updateUserRoleAdmin: (userId: string, newRole: User['role']) => void;
  toggleUserStatusAdmin: (userId: string, status: 'active' | 'blocked') => void;
  deleteUserAdmin: (userId: string) => void;
  addUserAdmin: (user: User) => void;

  addCourseAdmin: (newCourse: Course) => void;
  updateCourseAdmin: (course: Course) => void;
  deleteCourseAdmin: (courseId: string) => void;

  addEventAdmin: (newEvent: Event) => void;
  updateEventAdmin: (event: Event) => void;
  deleteEventAdmin: (eventId: string) => void;

  addArticleAdmin: (newArticle: Article) => void;
  deleteArticleAdmin: (articleId: string) => void;

  updateMentorshipStatusAdmin: (requestId: string, status: MentorshipRequest['status'], mentorName?: string) => void;
  updatePartnerInquiryStatusAdmin: (inquiryId: string, status: PartnerInquiry['status']) => void;
  deletePartnerInquiryAdmin: (inquiryId: string) => void;

  navigateToCourse: (courseId: string) => void;
  navigateToArticle: (slug: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('fr');
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [mentors] = useState<Mentor[]>(initialMentors);
  const [articles, setArticles] = useState<Article[]>([]);
  const [partners] = useState<Partner[]>(initialPartners);
  const [testimonials] = useState<Testimonial[]>(initialTestimonials);
  const [team] = useState<TeamMember[]>(initialTeam);

  const [mentorshipRequests, setMentorshipRequests] = useState<MentorshipRequest[]>([]);
  const [partnerInquiries, setPartnerInquiries] = useState<PartnerInquiry[]>([]);

  const [announcementBanner, setAnnouncementBannerState] = useState<string>(
    '🚀 Cohorte IA & Développement Web 2026 : Les inscriptions sont officiellement ouvertes !'
  );

  const [activeTab, setActiveTab] = useState<string>('home');
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [selectedArticleSlug, setSelectedArticleSlug] = useState<string | null>(null);
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);
  const [isAiModalOpen, setIsAiModalOpen] = useState<boolean>(false);
  const [toast, setToast] = useState<Toast | null>(null);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const t = translations[language];

  // ----------------------------------------------------
  // FIREBASE FIRESTORE LISTENERS & DATA INITIALIZATION
  // ----------------------------------------------------
  useEffect(() => {
    // 1. Users Listener
    const unsubUsers = onSnapshot(collection(db, 'users'), (snapshot) => {
      if (snapshot.empty) {
        // Seed default initial users if collection is empty
        demoUsers.forEach(u => setDoc(doc(db, 'users', u.id), u));
      } else {
        const list: User[] = [];
        snapshot.forEach(doc => list.push(doc.data() as User));
        setAllUsers(list);
      }
    });

    // 2. Courses Listener
    const unsubCourses = onSnapshot(collection(db, 'courses'), (snapshot) => {
      if (snapshot.empty) {
        initialCourses.forEach(c => setDoc(doc(db, 'courses', c.id), c));
      } else {
        const list: Course[] = [];
        snapshot.forEach(doc => list.push(doc.data() as Course));
        setCourses(list);
      }
    });

    // 3. Events Listener
    const unsubEvents = onSnapshot(collection(db, 'events'), (snapshot) => {
      if (snapshot.empty) {
        initialEvents.forEach(e => setDoc(doc(db, 'events', e.id), e));
      } else {
        const list: Event[] = [];
        snapshot.forEach(doc => list.push(doc.data() as Event));
        setEvents(list);
      }
    });

    // 4. Articles Listener
    const unsubArticles = onSnapshot(collection(db, 'articles'), (snapshot) => {
      if (snapshot.empty) {
        initialArticles.forEach(a => setDoc(doc(db, 'articles', a.id), a));
      } else {
        const list: Article[] = [];
        snapshot.forEach(doc => list.push(doc.data() as Article));
        setArticles(list);
      }
    });

    // 5. Enrollments Listener
    const unsubEnrollments = onSnapshot(collection(db, 'enrollments'), (snapshot) => {
      const list: Enrollment[] = [];
      snapshot.forEach(doc => list.push(doc.data() as Enrollment));
      setEnrollments(list);
    });

    // 6. Certificates Listener
    const unsubCertificates = onSnapshot(collection(db, 'certificates'), (snapshot) => {
      const list: Certificate[] = [];
      snapshot.forEach(doc => list.push(doc.data() as Certificate));
      setCertificates(list);
    });

    // 7. Mentorship Requests Listener
    const unsubMentorship = onSnapshot(collection(db, 'mentorshipRequests'), (snapshot) => {
      const list: MentorshipRequest[] = [];
      snapshot.forEach(doc => list.push(doc.data() as MentorshipRequest));
      setMentorshipRequests(list);
    });

    // 8. Partner Inquiries Listener
    const unsubPartners = onSnapshot(collection(db, 'partnerInquiries'), (snapshot) => {
      const list: PartnerInquiry[] = [];
      snapshot.forEach(doc => list.push(doc.data() as PartnerInquiry));
      setPartnerInquiries(list);
    });

    // 9. Settings Banner Listener
    const unsubSettings = onSnapshot(doc(db, 'settings', 'global'), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.announcementBanner) {
          setAnnouncementBannerState(data.announcementBanner);
        }
      } else {
        setDoc(doc(db, 'settings', 'global'), {
          announcementBanner: '🚀 Cohorte IA & Développement Web 2026 : Les inscriptions sont officiellement ouvertes !'
        });
      }
    });

    return () => {
      unsubUsers();
      unsubCourses();
      unsubEvents();
      unsubArticles();
      unsubEnrollments();
      unsubCertificates();
      unsubMentorship();
      unsubPartners();
      unsubSettings();
    };
  }, []);

  // ----------------------------------------------------
  // FIREBASE AUTHENTICATION LISTENER
  // ----------------------------------------------------
  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        const userDocRef = doc(db, 'users', fbUser.uid);
        const userSnap = await getDoc(userDocRef);

        if (userSnap.exists()) {
          const userData = userSnap.data() as User;
          if (userData.status === 'blocked') {
            await signOut(auth);
            setCurrentUser(null);
            showToast('Ce compte est actuellement suspendu.', 'error');
            return;
          }
          setCurrentUser(userData);
        } else {
          // New user signed in (e.g. via Google OAuth or initial creation)
          const nameParts = (fbUser.displayName || 'Membre').split(' ');
          const newUser: User = {
            id: fbUser.uid,
            firstName: nameParts[0] || 'Membre',
            lastName: nameParts.slice(1).join(' ') || 'IT-LeadHER',
            email: fbUser.email || '',
            role: fbUser.email?.includes('admin') ? 'admin' : 'member',
            avatar: fbUser.photoURL || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
            country: 'Côte d\'Ivoire',
            technicalLevel: 'Débutant',
            domainInterest: 'Développement Web & IA',
            status: 'active',
            createdAt: new Date().toISOString().split('T')[0]
          };

          await setDoc(userDocRef, newUser);
          setCurrentUser(newUser);
        }
      } else {
        setCurrentUser(null);
      }
    });

    return () => unsubAuth();
  }, []);

  const setAnnouncementBanner = (banner: string) => {
    setAnnouncementBannerState(banner);
    setDoc(doc(db, 'settings', 'global'), { announcementBanner: banner }, { merge: true });
  };

  // ----------------------------------------------------
  // AUTH ACTIONS
  // ----------------------------------------------------
  const login = async (email: string, password?: string) => {
    try {
      if (password) {
        const cred = await signInWithEmailAndPassword(auth, email, password);
        const userSnap = await getDoc(doc(db, 'users', cred.user.uid));
        if (userSnap.exists()) {
          const userDoc = userSnap.data() as User;
          if (userDoc.status === 'blocked') {
            await signOut(auth);
            showToast('Ce compte est suspendu par l\'administration.', 'error');
            return false;
          }
          setCurrentUser(userDoc);
          setActiveTab(userDoc.role === 'admin' ? 'admin' : 'dashboard');
          showToast(`Bienvenue ${userDoc.firstName} !`);
          return true;
        }
        showToast('Connexion réussie !');
        return true;
      }

      // Fallback if no password was provided: check or create user in Firestore
      let userDoc = allUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (!userDoc) {
        const newRole = email.includes('admin') ? 'admin' : 'member';
        userDoc = {
          id: `user-${Date.now()}`,
          firstName: email.split('@')[0],
          lastName: 'Membre',
          email,
          role: newRole,
          avatar: 'https://www.hs-coburg.de/wp-content/uploads/2024/03/person-silhouette-2.jpg',
          country: 'Côte d\'Ivoire',
          technicalLevel: 'Débutant',
          domainInterest: 'Technologie & Leadership',
          status: 'active',
          createdAt: new Date().toISOString().split('T')[0]
        };
        await setDoc(doc(db, 'users', userDoc.id), userDoc);
      }

      if (userDoc.status === 'blocked') {
        showToast('Ce compte est suspendu par l\'administration.', 'error');
        return false;
      }

      setCurrentUser(userDoc);
      showToast(`Bienvenue ${userDoc.firstName} !`);
      setActiveTab(userDoc.role === 'admin' ? 'admin' : 'dashboard');
      return true;
    } catch (err: any) {
      showToast(err.message || 'Erreur lors de la connexion.', 'error');
      return false;
    }
  };

  const loginWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      showToast('Connexion avec Google réussie !');
      return true;
    } catch (err: any) {
      showToast(err.message || 'Erreur lors de la connexion Google.', 'error');
      return false;
    }
  };

  const logout = async () => {
    await signOut(auth);
    setCurrentUser(null);
    showToast('Déconnexion réussie.');
    setActiveTab('home');
  };

  const registerUser = async (userData: Partial<User>, password?: string) => {
    try {
      let userId = `user-${Date.now()}`;
      if (password && userData.email) {
        const res = await createUserWithEmailAndPassword(auth, userData.email, password);
        userId = res.user.uid;
      }

      const newUser: User = {
        id: userId,
        firstName: userData.firstName || 'Inscrite',
        lastName: userData.lastName || 'Membre',
        email: userData.email || `user${Date.now()}@itleadher.org`,
        role: userData.role || 'member',
        avatar: userData.avatar || 'https://www.hs-coburg.de/wp-content/uploads/2024/03/person-silhouette-2.jpg',
        country: userData.country || 'Côte d\'Ivoire',
        technicalLevel: userData.technicalLevel || 'Débutant',
        domainInterest: userData.domainInterest || 'Développement Web',
        bio: userData.bio || '',
        linkedin: userData.linkedin || '',
        status: 'active',
        createdAt: new Date().toISOString().split('T')[0]
      };

      await setDoc(doc(db, 'users', userId), newUser);
      setCurrentUser(newUser);
      showToast('Compte créé avec succès ! Enregistré dans Firebase.');
      setActiveTab(newUser.role === 'admin' ? 'admin' : 'dashboard');
    } catch (err: any) {
      showToast(err.message || 'Erreur lors de la création du compte.', 'error');
    }
  };

  const updateUserProfile = async (userId: string, data: Partial<User>, newPassword?: string) => {
    try {
      await setDoc(doc(db, 'users', userId), data, { merge: true });
      if (currentUser?.id === userId) {
        setCurrentUser(prev => (prev ? { ...prev, ...data } : null));
      }

      if (newPassword && newPassword.trim().length >= 6) {
        if (auth.currentUser) {
          await updatePassword(auth.currentUser, newPassword);
          showToast('Profil et mot de passe mis à jour avec succès dans Firebase !');
        } else {
          showToast('Profil mis à jour dans Firebase.');
        }
      } else {
        showToast('Profil mis à jour dans Firebase !');
      }
    } catch (err: any) {
      showToast(err.message || 'Erreur lors de la mise à jour du profil.', 'error');
    }
  };

  const enrollInCourse = (courseId: string) => {
    if (!currentUser) {
      setActiveTab('login');
      showToast('Veuillez vous connecter pour vous inscrire à cette formation.', 'info');
      return;
    }

    const existing = enrollments.find(e => e.userId === currentUser.id && e.courseId === courseId);
    if (existing) {
      navigateToCourse(courseId);
      return;
    }

    const newEnrollment: Enrollment = {
      id: `enroll-${Date.now()}`,
      userId: currentUser.id,
      courseId,
      progress: 0,
      status: 'enrolled',
      completedLessonIds: [],
      enrolledAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    };

    setDoc(doc(db, 'enrollments', newEnrollment.id), newEnrollment);

    const course = courses.find(c => c.id === courseId);
    if (course) {
      setDoc(doc(db, 'courses', courseId), { enrolledCount: course.enrolledCount + 1 }, { merge: true });
    }

    showToast('Inscription enregistrée dans Firebase !');
    navigateToCourse(courseId);
  };

  const completeLesson = (courseId: string, lessonId: string) => {
    if (!currentUser) return;
    const course = courses.find(c => c.id === courseId);
    if (!course) return;

    const existing = enrollments.find(e => e.userId === currentUser.id && e.courseId === courseId);
    const prevCompleted = existing ? existing.completedLessonIds : [];
    if (prevCompleted.includes(lessonId)) return;

    const updatedCompleted = [...prevCompleted, lessonId];
    const progress = Math.round((updatedCompleted.length / course.lessons.length) * 100);
    const isCompleted = progress >= 100;

    let certId = existing?.certificateId;

    if (isCompleted && !certId) {
      const newCertCode = `ITLH-${course.category.toUpperCase()}-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      const newCert: Certificate = {
        id: `cert-${Date.now()}`,
        userId: currentUser.id,
        userName: `${currentUser.firstName} ${currentUser.lastName}`,
        courseId: course.id,
        courseTitle: course.title,
        issueDate: new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }),
        certificateCode: newCertCode,
        skills: course.skillsAcquired
      };

      setDoc(doc(db, 'certificates', newCert.id), newCert);
      certId = newCert.id;
      showToast('Félicitations ! Votre certificat a été généré et enregistré dans Firebase !');
    } else {
      showToast('Leçon validée !');
    }

    const updatedEnrollment: Enrollment = {
      id: existing ? existing.id : `enroll-${Date.now()}`,
      userId: currentUser.id,
      courseId,
      progress,
      status: isCompleted ? 'completed' : 'enrolled',
      completedLessonIds: updatedCompleted,
      certificateId: certId,
      enrolledAt: existing ? existing.enrolledAt : new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    };

    setDoc(doc(db, 'enrollments', updatedEnrollment.id), updatedEnrollment);
  };

  const registerForEvent = (eventId: string) => {
    if (!currentUser) {
      setActiveTab('login');
      showToast('Veuillez vous connecter pour vous inscrire à un événement.', 'info');
      return;
    }

    const evt = events.find(e => e.id === eventId);
    if (evt) {
      setDoc(doc(db, 'events', eventId), { registeredCount: evt.registeredCount + 1 }, { merge: true });
      showToast('Inscription enregistrée dans Firebase !');
    }
  };

  const requestMentorship = (mentorId: string, message: string) => {
    if (!currentUser) {
      setActiveTab('login');
      showToast('Veuillez vous connecter pour demander une mentor.', 'info');
      return;
    }

    const mentorObj = mentors.find(m => m.id === mentorId);
    const newReq: MentorshipRequest = {
      id: `req-${Date.now()}`,
      userId: currentUser.id,
      userName: `${currentUser.firstName} ${currentUser.lastName}`,
      userEmail: currentUser.email,
      mentorId,
      mentorName: mentorObj?.name || 'Mentor IT-LeadHER',
      domainInterest: currentUser.domainInterest || 'Technologie',
      message,
      status: 'pending',
      createdAt: new Date().toISOString().split('T')[0]
    };

    setDoc(doc(db, 'mentorshipRequests', newReq.id), newReq);
    showToast('Demande de mentorat enregistrée dans Firebase !');
  };

  const submitPartnerInquiry = (inquiry: Omit<PartnerInquiry, 'id' | 'createdAt' | 'status'>) => {
    const newInquiry: PartnerInquiry = {
      id: `inq-${Date.now()}`,
      ...inquiry,
      status: 'new',
      createdAt: new Date().toISOString().split('T')[0]
    };
    setDoc(doc(db, 'partnerInquiries', newInquiry.id), newInquiry);
    showToast('Demande de partenariat transmise et enregistrée dans Firebase.');
  };

  const addArticleComment = (articleSlug: string, text: string) => {
    if (!currentUser) {
      setActiveTab('login');
      showToast('Connectez-vous pour commenter cet article.', 'info');
      return;
    }

    const art = articles.find(a => a.slug === articleSlug);
    if (!art) return;

    const newComment = {
      id: `com-${Date.now()}`,
      userName: `${currentUser.firstName} ${currentUser.lastName}`,
      userAvatar: currentUser.avatar,
      text,
      date: 'À l\'instant'
    };

    const updatedComments = [newComment, ...(art.comments || [])];
    setDoc(doc(db, 'articles', art.id), { comments: updatedComments }, { merge: true });
    showToast('Commentaire publié !');
  };

 // Dans AppContext.tsx, remplace les fonctions admin par celles-ci :

// ADMIN ACTIONS WITH LOCAL STATE UPDATE
const updateUserRoleAdmin = (userId: string, newRole: User['role']) => {
  setDoc(doc(db, 'users', userId), { role: newRole }, { merge: true });
  // Mise à jour du state local
  setAllUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
  showToast(`Rôle mis à jour (${newRole}) dans Firebase.`);
};

const toggleUserStatusAdmin = (userId: string, status: 'active' | 'blocked') => {
  setDoc(doc(db, 'users', userId), { status }, { merge: true });
  // Mise à jour du state local
  setAllUsers(prev => prev.map(u => u.id === userId ? { ...u, status } : u));
  showToast(status === 'blocked' ? 'Compte utilisateur suspendu.' : 'Compte utilisateur réactivé.');
};

const deleteUserAdmin = (userId: string) => {
  deleteDoc(doc(db, 'users', userId));
  // Mise à jour du state local
  setAllUsers(prev => prev.filter(u => u.id !== userId));
  showToast('Utilisateur supprimé de Firebase.');
};

const addUserAdmin = (newUser: User) => {
  setDoc(doc(db, 'users', newUser.id), newUser);
  // Mise à jour du state local
  setAllUsers(prev => [...prev, newUser]);
  showToast('Nouvel utilisateur enregistré dans Firebase.');
};

const addCourseAdmin = (newCourse: Course) => {
  setDoc(doc(db, 'courses', newCourse.id), newCourse);
  // Mise à jour du state local
  setCourses(prev => [...prev, newCourse]);
  showToast('Nouvelle formation publiée et enregistrée dans Firebase !');
};

const updateCourseAdmin = (updatedCourse: Course) => {
  setDoc(doc(db, 'courses', updatedCourse.id), updatedCourse, { merge: true });
  // Mise à jour du state local
  setCourses(prev => prev.map(c => c.id === updatedCourse.id ? updatedCourse : c));
  showToast('Formation mise à jour dans Firebase.');
};

const deleteCourseAdmin = (courseId: string) => {
  deleteDoc(doc(db, 'courses', courseId));
  // Mise à jour du state local
  setCourses(prev => prev.filter(c => c.id !== courseId));
  showToast('Formation supprimée de Firebase.');
};

const addEventAdmin = (newEvent: Event) => {
  setDoc(doc(db, 'events', newEvent.id), newEvent);
  // Mise à jour du state local - CORRECTION ICI !
  setEvents(prev => [...prev, newEvent]);
  showToast('Nouvel événement créé dans Firebase !');
};

const updateEventAdmin = (updatedEvent: Event) => {
  setDoc(doc(db, 'events', updatedEvent.id), updatedEvent, { merge: true });
  // Mise à jour du state local
  setEvents(prev => prev.map(e => e.id === updatedEvent.id ? updatedEvent : e));
  showToast('Événement mis à jour dans Firebase.');
};

const deleteEventAdmin = (eventId: string) => {
  deleteDoc(doc(db, 'events', eventId));
  // Mise à jour du state local
  setEvents(prev => prev.filter(e => e.id !== eventId));
  showToast('Événement supprimé de Firebase.');
};

const addArticleAdmin = (newArticle: Article) => {
  setDoc(doc(db, 'articles', newArticle.id), newArticle);
  // Mise à jour du state local
  setArticles(prev => [...prev, newArticle]);
  showToast('Nouvel article publié et enregistré dans Firebase !');
};

const deleteArticleAdmin = (articleId: string) => {
  deleteDoc(doc(db, 'articles', articleId));
  // Mise à jour du state local
  setArticles(prev => prev.filter(a => a.id !== articleId));
  showToast('Article supprimé de Firebase.');
};

const updateMentorshipStatusAdmin = (requestId: string, status: MentorshipRequest['status'], mentorName?: string) => {
  const updateData: any = { status };
  if (mentorName) updateData.mentorName = mentorName;
  setDoc(doc(db, 'mentorshipRequests', requestId), updateData, { merge: true });
  // Mise à jour du state local
  setMentorshipRequests(prev => prev.map(r => r.id === requestId ? { ...r, ...updateData } : r));
  showToast('Statut de mentorat mis à jour dans Firebase.');
};

const updatePartnerInquiryStatusAdmin = (inquiryId: string, status: PartnerInquiry['status']) => {
  setDoc(doc(db, 'partnerInquiries', inquiryId), { status }, { merge: true });
  // Mise à jour du state local
  setPartnerInquiries(prev => prev.map(p => p.id === inquiryId ? { ...p, status } : p));
  showToast('Statut de la demande de partenariat mis à jour dans Firebase.');
};

const deletePartnerInquiryAdmin = (inquiryId: string) => {
  deleteDoc(doc(db, 'partnerInquiries', inquiryId));
  // Mise à jour du state local
  setPartnerInquiries(prev => prev.filter(p => p.id !== inquiryId));
  showToast('Demande de partenariat supprimée de Firebase.');
};
  const navigateToCourse = (courseId: string) => {
    setSelectedCourseId(courseId);
    setActiveTab('course-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToArticle = (slug: string) => {
    setSelectedArticleSlug(slug);
    setActiveTab('blog-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        t,
        currentUser,
        setCurrentUser,
        allUsers,
        courses,
        enrollments,
        certificates,
        events,
        mentors,
        articles,
        partners,
        testimonials,
        team,
        mentorshipRequests,
        partnerInquiries,
        announcementBanner,
        setAnnouncementBanner,
        activeTab,
        setActiveTab,
        selectedCourseId,
        setSelectedCourseId,
        selectedArticleSlug,
        setSelectedArticleSlug,
        selectedCertificate,
        setSelectedCertificate,
        isAiModalOpen,
        setIsAiModalOpen,
        toast,
        showToast,
        login,
        loginWithGoogle,
        logout,
        registerUser,
        updateUserProfile,
        enrollInCourse,
        completeLesson,
        registerForEvent,
        requestMentorship,
        addArticleComment,
        submitPartnerInquiry,
        updateUserRoleAdmin,
        toggleUserStatusAdmin,
        deleteUserAdmin,
        addUserAdmin,
        addCourseAdmin,
        updateCourseAdmin,
        deleteCourseAdmin,
        addEventAdmin,
        updateEventAdmin,
        deleteEventAdmin,
        addArticleAdmin,
        deleteArticleAdmin,
        updateMentorshipStatusAdmin,
        updatePartnerInquiryStatusAdmin,
        deletePartnerInquiryAdmin,
        navigateToCourse,
        navigateToArticle
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
