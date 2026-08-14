export type Language = 'fr' | 'en';

export type UserRole = 'member' | 'mentor' | 'admin' | 'partner';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  avatar: string;
  country: string;
  technicalLevel: 'Débutant' | 'Intermédiaire' | 'Avancé';
  domainInterest: string;
  bio?: string;
  linkedin?: string;
  portfolio?: string;
  experience?: string;
  status?: 'active' | 'blocked' | 'pending';
  createdAt: string;
}

export interface MentorshipRequest {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  mentorId?: string;
  mentorName?: string;
  domainInterest: string;
  message: string;
  status: 'pending' | 'assigned' | 'rejected' | 'completed';
  createdAt: string;
}

export interface PartnerInquiry {
  id: string;
  companyName: string;
  contactName: string;
  email: string;
  partnerType: string;
  message: string;
  status: 'new' | 'contacted' | 'approved' | 'rejected';
  createdAt: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface Lesson {
  id: string;
  courseId: string;
  title: string;
  duration: string;
  videoUrl?: string;
  videoSource?: 'youtube' | 'cursa' | 'local' | 'none';
  content: string;
  pdfUrl?: string;
  quiz?: QuizQuestion[];
  order: number;
  passingScore?: number;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  fullDescription: string;
  category: 'dev' | 'data' | 'ai' | 'cyber' | 'design' | 'leadership';
  categoryLabel: string;
  level: 'Débutant' | 'Intermédiaire' | 'Avancé';
  duration: string;
  modulesCount: number;
  thumbnail: string;
  instructorId: string;
  instructorName: string;
  instructorRole: string;
  instructorAvatar: string;
  videoUrl?: string;
  videoSource?: 'youtube' | 'cursa' | 'local' | 'none';
  rating: number;
  enrolledCount: number;
  lessons: Lesson[];
  isFeatured?: boolean;
  skillsAcquired: string[];
}

export interface Enrollment {
  id: string;
  userId: string;
  courseId: string;
  progress: number;
  status: 'enrolled' | 'completed';
  completedLessonIds: string[];
  certificateId?: string;
  enrolledAt: string;
  updatedAt: string;
  lessonScores?: Record<string, number>;
  lessonValidated?: Record<string, boolean>;
  overallScore?: number;
  certificateObtainedAt?: string;
}

export interface Certificate {
  id: string;
  userId: string;
  userName: string;
  courseId: string;
  courseTitle: string;
  issueDate: string;
  certificateCode: string;
  skills: string[];
}

export interface Speaker {
  name: string;
  role: string;
  company: string;
  avatar: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  type: 'webinar' | 'bootcamp' | 'hackathon' | 'conference';
  typeLabel: string;
  date: string;
  time: string;
  location: string;
  isOnline: boolean;
  link?: string;
  image: string;
  registeredCount: number;
  maxCapacity: number;
  speakers: Speaker[];
  isRegistered?: boolean;
}

export interface Mentor {
  id: string;
  userId: string;
  name: string;
  role: string;
  company: string;
  avatar: string;
  expertise: string[];
  availability: string;
  bio: string;
  rating: number;
  menteesCount: number;
  linkedin: string;
}

export interface Comment {
  id: string;
  userName: string;
  userAvatar: string;
  text: string;
  date: string;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  category: 'Technologie' | 'Carrière' | 'Leadership' | 'Portraits';
  cover: string;
  authorName: string;
  authorRole: string;
  authorAvatar: string;
  readTime: string;
  createdAt: string;
  tags: string[];
  comments: Comment[];
}

export interface Partner {
  id: string;
  name: string;
  logo: string;
  category: 'Tech' | 'Institutionnel' | 'Éducation' | 'Entreprise';
  description: string;
  website: string;
  tier: 'Grand Partenaire' | 'Partenaire Majeur' | 'Sponsor';
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  promotion: string;
  photo: string;
  quote: string;
  company?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  photo: string;
  linkedin: string;
}