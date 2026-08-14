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
  PartnerInquiry,
  Lesson
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

  // NOUVELLES FONCTIONS
  updateLessonScore: (userId: string, courseId: string, lessonId: string, score: number) => void;
  validateLesson: (userId: string, courseId: string, lessonId: string) => void;
  getLessonStatus: (userId: string, courseId: string, lessonId: string) => {
    score: number;
    validated: boolean;
    accessible: boolean;
    isLastLesson: boolean;
  };
  getCourseProgress: (userId: string, courseId: string) => {
    validatedLessons: number;
    totalLessons: number;
    overallScore: number;
    canGetCertificate: boolean;
  };
  checkAndGenerateCertificate: (userId: string, courseId: string) => Promise<Certificate | null>;
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
  // FIREBASE FIRESTORE LISTENERS (inchangé)
  // ----------------------------------------------------
  useEffect(() => {
    const unsubUsers = onSnapshot(collection(db, 'users'), (snapshot) => {
      if (snapshot.empty) {
        demoUsers.forEach(u => setDoc(doc(db, 'users', u.id), u));
      } else {
        const list: User[] = [];
        snapshot.forEach(doc => list.push(doc.data() as User));
        setAllUsers(list);
      }
    });

    const unsubCourses = onSnapshot(collection(db, 'courses'), (snapshot) => {
      if (snapshot.empty) {
        initialCourses.forEach(c => setDoc(doc(db, 'courses', c.id), c));
      } else {
        const list: Course[] = [];
        snapshot.forEach(doc => list.push(doc.data() as Course));
        setCourses(list);
      }
    });

    const unsubEvents = onSnapshot(collection(db, 'events'), (snapshot) => {
      if (snapshot.empty) {
        initialEvents.forEach(e => setDoc(doc(db, 'events', e.id), e));
      } else {
        const list: Event[] = [];
        snapshot.forEach(doc => list.push(doc.data() as Event));
        setEvents(list);
      }
    });

    const unsubArticles = onSnapshot(collection(db, 'articles'), (snapshot) => {
      if (snapshot.empty) {
        initialArticles.forEach(a => setDoc(doc(db, 'articles', a.id), a));
      } else {
        const list: Article[] = [];
        snapshot.forEach(doc => list.push(doc.data() as Article));
        setArticles(list);
      }
    });

    const unsubEnrollments = onSnapshot(collection(db, 'enrollments'), (snapshot) => {
      const list: Enrollment[] = [];
      snapshot.forEach(doc => list.push(doc.data() as Enrollment));
      setEnrollments(list);
    });

    const unsubCertificates = onSnapshot(collection(db, 'certificates'), (snapshot) => {
      const list: Certificate[] = [];
      snapshot.forEach(doc => list.push(doc.data() as Certificate));
      setCertificates(list);
    });

    const unsubMentorship = onSnapshot(collection(db, 'mentorshipRequests'), (snapshot) => {
      const list: MentorshipRequest[] = [];
      snapshot.forEach(doc => list.push(doc.data() as MentorshipRequest));
      setMentorshipRequests(list);
    });

    const unsubPartners = onSnapshot(collection(db, 'partnerInquiries'), (snapshot) => {
      const list: PartnerInquiry[] = [];
      snapshot.forEach(doc => list.push(doc.data() as PartnerInquiry));
      setPartnerInquiries(list);
    });

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
  // FIREBASE AUTHENTICATION LISTENER (inchangé)
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
  // AUTH ACTIONS (inchangé)
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
      updatedAt: new Date().toISOString().split('T')[0],
      lessonScores: {},
      lessonValidated: {},
      overallScore: 0
    };

    setDoc(doc(db, 'enrollments', newEnrollment.id), newEnrollment);

    const course = courses.find(c => c.id === courseId);
    if (course) {
      setDoc(doc(db, 'courses', courseId), { enrolledCount: course.enrolledCount + 1 }, { merge: true });
    }

    showToast('Inscription enregistrée dans Firebase !');
    navigateToCourse(courseId);
  };

  // ----------------------------------------------------
  // NOUVELLES FONCTIONS DE VALIDATION
  // ----------------------------------------------------

 const updateLessonScore = (userId: string, courseId: string, lessonId: string, score: number) => {
  const enrollment = enrollments.find(e => e.userId === userId && e.courseId === courseId);
  if (!enrollment) return;

  const newScores = { ...enrollment.lessonScores, [lessonId]: score };
  
  // Calculer le score global (moyenne de TOUTES les leçons, pas seulement celles qui ont un score)
  const course = courses.find(c => c.id === courseId);
  const allLessons = course?.lessons || [];
  const allScores = allLessons.map(l => newScores[l.id] || 0);
  const overallScore = allLessons.length > 0 
    ? Math.round(allScores.reduce((a, b) => a + b, 0) / allLessons.length)
    : 0;

  console.log('📊 Mise à jour du score:', { lessonId, score, overallScore, allScores });

  const updatedEnrollment: Enrollment = {
    ...enrollment,
    lessonScores: newScores,
    overallScore: overallScore
  };

  setDoc(doc(db, 'enrollments', enrollment.id), updatedEnrollment, { merge: true });
  setEnrollments(prev => prev.map(e => e.id === enrollment.id ? updatedEnrollment : e));
};

const validateLesson = (userId: string, courseId: string, lessonId: string) => {
  const enrollment = enrollments.find(e => e.userId === userId && e.courseId === courseId);
  if (!enrollment) {
    showToast('❌ Vous devez être inscrit à ce cours.', 'error');
    return;
  }

  const score = enrollment.lessonScores?.[lessonId] || 0;
  const course = courses.find(c => c.id === courseId);
  const lesson = course?.lessons.find(l => l.id === lessonId);
  const passingScore = lesson?.passingScore || 90;

  if (score < passingScore) {
    showToast(`❌ Score insuffisant (${score}%). Minimum requis : ${passingScore}%.`, 'error');
    return;
  }

  // Éviter la double validation
  if (enrollment.lessonValidated?.[lessonId]) {
    showToast('✅ Cette leçon est déjà validée !', 'info');
    return;
  }

  const completedIds = enrollment.completedLessonIds.includes(lessonId)
    ? enrollment.completedLessonIds
    : [...enrollment.completedLessonIds, lessonId];

  // Calculer la progression
  const totalLessons = course?.lessons.length || 0;
  const progress = totalLessons > 0 ? Math.round((completedIds.length / totalLessons) * 100) : 0;

  const updatedEnrollment: Enrollment = {
    ...enrollment,
    completedLessonIds: completedIds,
    lessonValidated: { ...enrollment.lessonValidated, [lessonId]: true },
    progress: progress,
    updatedAt: new Date().toISOString().split('T')[0]
  };

  // Mettre à jour dans Firestore
  setDoc(doc(db, 'enrollments', enrollment.id), updatedEnrollment, { merge: true });
  setEnrollments(prev => prev.map(e => e.id === enrollment.id ? updatedEnrollment : e));

  showToast(`✅ Leçon validée avec ${score}% !`, 'success');

  // ⚠️ VÉRIFIER SI TOUTES LES LEÇONS SONT VALIDÉES POUR GÉNÉRER LE CERTIFICAT
  const allLessons = course?.lessons || [];
  const allValidated = allLessons.every(l => 
    updatedEnrollment.lessonValidated?.[l.id] === true
  );

  console.log('🔍 Vérification certificat:', {
    allValidated,
    totalLessons: allLessons.length,
    validatedLessons: Object.values(updatedEnrollment.lessonValidated || {}).filter(v => v).length,
    overallScore: updatedEnrollment.overallScore
  });

  if (allValidated && allLessons.length > 0 && updatedEnrollment.overallScore !== undefined && updatedEnrollment.overallScore >= 90) {
    // Générer le certificat
    console.log('🎓 Toutes les leçons sont validées, génération du certificat...');
    checkAndGenerateCertificate(userId, courseId).then(cert => {
      if (cert) {
        console.log('✅ Certificat généré avec succès !', cert);
      }
    }).catch(err => {
      console.error('❌ Erreur lors de la génération du certificat:', err);
    });
  } else if (allValidated && allLessons.length > 0) {
    // Toutes les leçons sont validées mais le score global est insuffisant
    console.log('⚠️ Toutes les leçons sont validées mais score global insuffisant:', updatedEnrollment.overallScore);
    showToast(`📊 Toutes les leçons sont validées mais votre score global (${updatedEnrollment.overallScore}%) est insuffisant. Minimum requis : 90%.`, 'info');
  }
};
  const getLessonStatus = (userId: string, courseId: string, lessonId: string) => {
    const enrollment = enrollments.find(e => e.userId === userId && e.courseId === courseId);
    const course = courses.find(c => c.id === courseId);
    
    if (!enrollment || !course) {
      return { score: 0, validated: false, accessible: false, isLastLesson: false };
    }

    const score = enrollment.lessonScores?.[lessonId] || 0;
    const validated = enrollment.lessonValidated?.[lessonId] || false;
    
    const lessonIndex = course.lessons.findIndex(l => l.id === lessonId);
    const isLastLesson = lessonIndex === course.lessons.length - 1;
    
    let accessible = false;
    if (lessonIndex === 0) {
      accessible = true;
    } else {
      const prevLesson = course.lessons[lessonIndex - 1];
      accessible = enrollment.lessonValidated?.[prevLesson.id] || false;
    }

    return { score, validated, accessible, isLastLesson };
  };

  const getCourseProgress = (userId: string, courseId: string) => {
    const enrollment = enrollments.find(e => e.userId === userId && e.courseId === courseId);
    const course = courses.find(c => c.id === courseId);
    
    if (!enrollment || !course) {
      return { validatedLessons: 0, totalLessons: 0, overallScore: 0, canGetCertificate: false };
    }

    const validatedLessons = Object.values(enrollment.lessonValidated || {}).filter(v => v).length;
    const totalLessons = course.lessons.length;
    const overallScore = enrollment.overallScore || 0;
    const canGetCertificate = validatedLessons === totalLessons && overallScore >= 90 && totalLessons > 0;

    return { validatedLessons, totalLessons, overallScore, canGetCertificate };
  };

 const checkAndGenerateCertificate = async (userId: string, courseId: string): Promise<Certificate | null> => {
  const enrollment = enrollments.find(e => e.userId === userId && e.courseId === courseId);
  const course = courses.find(c => c.id === courseId);
  const user = allUsers.find(u => u.id === userId);
  
  console.log('🔍 checkAndGenerateCertificate appelé:', { userId, courseId, hasEnrollment: !!enrollment, hasCourse: !!course, hasUser: !!user });
  
  if (!enrollment || !course || !user) {
    console.error('❌ Données manquantes pour générer le certificat');
    return null;
  }

  // Vérifier si le certificat existe déjà
  const existingCert = certificates.find(c => c.userId === userId && c.courseId === courseId);
  if (existingCert) {
    console.log('📜 Certificat déjà existant:', existingCert);
    return existingCert;
  }

  // Vérifier que toutes les leçons sont validées
  const allLessons = course.lessons;
  const allValidated = allLessons.every(l => 
    enrollment.lessonValidated?.[l.id] === true
  );

  if (!allValidated) {
    console.warn('⚠️ Toutes les leçons ne sont pas validées');
    return null;
  }

  // Vérifier le score global
  const overallScore = enrollment.overallScore || 0;
  if (overallScore < 90) {
    console.warn(`⚠️ Score global insuffisant: ${overallScore}%`);
    showToast(`📊 Votre score global est de ${overallScore}%. Minimum requis : 90%.`, 'info');
    return null;
  }

  // Générer le code du certificat
  const certCode = `ITLH-${course.category.toUpperCase()}-${Date.now().toString().slice(-6)}`;
  
  const newCert: Certificate = {
    id: `cert-${Date.now()}`,
    userId: user.id,
    userName: `${user.firstName} ${user.lastName}`,
    courseId: course.id,
    courseTitle: course.title,
    issueDate: new Date().toLocaleDateString('fr-FR', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    }),
    certificateCode: certCode,
    skills: course.skillsAcquired || []
  };

  console.log('🎓 Génération du certificat:', newCert);

  // Sauvegarder dans Firestore
  await setDoc(doc(db, 'certificates', newCert.id), newCert);
  
  // Mettre à jour l'enrollment
  const updatedEnrollment: Enrollment = {
    ...enrollment,
    certificateId: newCert.id,
    certificateObtainedAt: new Date().toISOString(),
    status: 'completed'
  };
  await setDoc(doc(db, 'enrollments', enrollment.id), updatedEnrollment, { merge: true });
  
  setCertificates(prev => [...prev, newCert]);
  setEnrollments(prev => prev.map(e => e.id === enrollment.id ? updatedEnrollment : e));

  showToast(`🎓 Félicitations ${user.firstName} ! Certificat obtenu avec ${overallScore}% !`, 'success');
  return newCert;
};

  // ----------------------------------------------------
  // COMPLETE LESSON MODIFIÉE
  // ----------------------------------------------------
  const completeLesson = (courseId: string, lessonId: string) => {
    if (!currentUser) {
      showToast('Veuillez vous connecter.', 'info');
      setActiveTab('login');
      return;
    }

    const course = courses.find(c => c.id === courseId);
    if (!course) return;

    const enrollment = enrollments.find(e => e.userId === currentUser.id && e.courseId === courseId);
    if (!enrollment) {
      showToast('Vous devez être inscrit à ce cours.', 'error');
      return;
    }

    // Utiliser validateLesson qui gère toutes les vérifications
    validateLesson(currentUser.id, courseId, lessonId);
  };

  // ----------------------------------------------------
  // ADMIN ACTIONS (inchangées)
  // ----------------------------------------------------
  const updateUserRoleAdmin = (userId: string, newRole: User['role']) => {
    setDoc(doc(db, 'users', userId), { role: newRole }, { merge: true });
    setAllUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
    showToast(`Rôle mis à jour (${newRole}) dans Firebase.`);
  };

  const toggleUserStatusAdmin = (userId: string, status: 'active' | 'blocked') => {
    setDoc(doc(db, 'users', userId), { status }, { merge: true });
    setAllUsers(prev => prev.map(u => u.id === userId ? { ...u, status } : u));
    showToast(status === 'blocked' ? 'Compte utilisateur suspendu.' : 'Compte utilisateur réactivé.');
  };

  const deleteUserAdmin = (userId: string) => {
    deleteDoc(doc(db, 'users', userId));
    setAllUsers(prev => prev.filter(u => u.id !== userId));
    showToast('Utilisateur supprimé de Firebase.');
  };

  const addUserAdmin = (newUser: User) => {
    setDoc(doc(db, 'users', newUser.id), newUser);
    setAllUsers(prev => [...prev, newUser]);
    showToast('Nouvel utilisateur enregistré dans Firebase.');
  };

  const addCourseAdmin = (newCourse: Course) => {
    setDoc(doc(db, 'courses', newCourse.id), newCourse);
    setCourses(prev => [...prev, newCourse]);
    showToast('Nouvelle formation publiée et enregistrée dans Firebase !');
  };

  const updateCourseAdmin = (updatedCourse: Course) => {
    setDoc(doc(db, 'courses', updatedCourse.id), updatedCourse, { merge: true });
    setCourses(prev => prev.map(c => c.id === updatedCourse.id ? updatedCourse : c));
    showToast('Formation mise à jour dans Firebase.');
  };

  const deleteCourseAdmin = (courseId: string) => {
    deleteDoc(doc(db, 'courses', courseId));
    setCourses(prev => prev.filter(c => c.id !== courseId));
    showToast('Formation supprimée de Firebase.');
  };

  const addEventAdmin = (newEvent: Event) => {
    setDoc(doc(db, 'events', newEvent.id), newEvent);
    setEvents(prev => [...prev, newEvent]);
    showToast('Nouvel événement créé dans Firebase !');
  };

  const updateEventAdmin = (updatedEvent: Event) => {
    setDoc(doc(db, 'events', updatedEvent.id), updatedEvent, { merge: true });
    setEvents(prev => prev.map(e => e.id === updatedEvent.id ? updatedEvent : e));
    showToast('Événement mis à jour dans Firebase.');
  };

  const deleteEventAdmin = (eventId: string) => {
    deleteDoc(doc(db, 'events', eventId));
    setEvents(prev => prev.filter(e => e.id !== eventId));
    showToast('Événement supprimé de Firebase.');
  };

  const addArticleAdmin = (newArticle: Article) => {
    setDoc(doc(db, 'articles', newArticle.id), newArticle);
    setArticles(prev => [...prev, newArticle]);
    showToast('Nouvel article publié et enregistré dans Firebase !');
  };

  const deleteArticleAdmin = (articleId: string) => {
    deleteDoc(doc(db, 'articles', articleId));
    setArticles(prev => prev.filter(a => a.id !== articleId));
    showToast('Article supprimé de Firebase.');
  };

  const updateMentorshipStatusAdmin = (requestId: string, status: MentorshipRequest['status'], mentorName?: string) => {
    const updateData: any = { status };
    if (mentorName) updateData.mentorName = mentorName;
    setDoc(doc(db, 'mentorshipRequests', requestId), updateData, { merge: true });
    setMentorshipRequests(prev => prev.map(r => r.id === requestId ? { ...r, ...updateData } : r));
    showToast('Statut de mentorat mis à jour dans Firebase.');
  };

  const updatePartnerInquiryStatusAdmin = (inquiryId: string, status: PartnerInquiry['status']) => {
    setDoc(doc(db, 'partnerInquiries', inquiryId), { status }, { merge: true });
    setPartnerInquiries(prev => prev.map(p => p.id === inquiryId ? { ...p, status } : p));
    showToast('Statut de la demande de partenariat mis à jour dans Firebase.');
  };

  const deletePartnerInquiryAdmin = (inquiryId: string) => {
    deleteDoc(doc(db, 'partnerInquiries', inquiryId));
    setPartnerInquiries(prev => prev.filter(p => p.id !== inquiryId));
    showToast('Demande de partenariat supprimée de Firebase.');
  };

  // ----------------------------------------------------
  // AUTRES ACTIONS (inchangées)
  // ----------------------------------------------------
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
        navigateToArticle,
        updateLessonScore,
        validateLesson,
        getLessonStatus,
        getCourseProgress,
        checkAndGenerateCertificate
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