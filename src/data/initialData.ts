import { Course, Event, Mentor, Article, Partner, Testimonial, TeamMember, User } from '../types';

export const initialCourses: Course[] = [
  
  {
    id: 'course-1',
    title: 'Data Science & Analyse de Données avec Python',
    description: 'Apprenez à manipuler, analyser et visualiser des données massives avec Python, Pandas, NumPy et Seaborn.',
    fullDescription: 'La donnée est le nouvel or noir de l\'économie numérique. Ce cours vous donne les clés pour devenir Data Analyst / Data Scientist. Vous manipulerez des datasets réels, concevrez des tableaux de bord prédictifs et présenterez vos insights avec impact.',
    category: 'data',
    categoryLabel: 'Data & Analytics',
    level: 'Intermédiaire',
    duration: '10 semaines (50h)',
    modulesCount: 6,
    thumbnail: 'https://img.youtube.com/vi/0P_A0m_MsR4/mqdefault.jpg',
    videoUrl: 'https://www.youtube.com/embed/0P_A0m_MsR4',
    instructorId: 'inst-2',
    instructorName: 'Fatou Kante',
    instructorRole: 'Lead Data Scientist @ AnalyticsHub',
    instructorAvatar: 'https://www.hs-coburg.de/wp-content/uploads/2024/03/person-silhouette-2.jpg',
    rating: 4.8,
    enrolledCount: 289,
    isFeatured: true,
    skillsAcquired: ['Python 3', 'Pandas & NumPy', 'Visualisation (Matplotlib/Seaborn)', 'Statistiques Descriptives', 'SQL', 'Jupyter Notebooks'],
    lessons: [
      {
        id: 'c1-l1',
        courseId: 'course-1',
        title: 'Introduction au langage Python pour la Data Science',
        duration: '30 min',
        videoUrl: 'https://www.youtube.com/embed/0P_A0m_MsR4',
        content: 'Python est le langage n°1 des données. Nous aborderons les structures de données (Listes, Dictionnaires) et les boucles.',
        quiz: [
          {
            id: 'q1-1',
            question: 'Quelle bibliothèque Python est la référence pour la manipulation de tableaux de données ?',
            options: ['Pandas', 'Flask', 'Django', 'React'],
            correctAnswer: 0,
            explanation: 'Pandas fournit les structures DataFrame et Series essentielles à l\'analyse de données.'
          }
        ],
        order: 1
      }
    ],
    videoSource: 'youtube'
  },
];
export const initialMentors: Mentor[] = [
  {
    id: 'mentor-1',
    userId: 'u-mentor-1',
    name: 'Aïcha Diallo',
    role: 'Lead Frontend Engineer',
    company: 'TechAfrique Solutions',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
    expertise: ['Développement Web', 'React / TypeScript', 'Architecture Logicielle', 'Carrière Tech'],
    availability: '2h / semaine (Disponible)',
    bio: 'Plus de 8 ans d\'expérience dans le développement d\'applications complexes. Passionnée par la transmission de compétences et l\'égalité des genres.',
    rating: 4.9,
    menteesCount: 14,
    linkedin: 'https://linkedin.com'
  },
  {
    id: 'mentor-2',
    userId: 'u-mentor-2',
    name: 'Mariam Sow',
    role: 'AI Researcher & Consultant',
    company: 'DeepTech Labs',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80',
    expertise: ['Intelligence Artificielle', 'Machine Learning', 'Recherche Académique', 'Pitch Start-up'],
    availability: '3h / semaine (Disponible)',
    bio: 'Docteure en Informatique, j\'accompagne les jeunes femmes souhaitant se lancer dans la Data & l\'IA ou poursuivre une thèse technologique.',
    rating: 5.0,
    menteesCount: 19,
    linkedin: 'https://linkedin.com'
  },
  {
    id: 'mentor-3',
    userId: 'u-mentor-3',
    name: 'Fatou Kante',
    role: 'Lead Data Architect',
    company: 'Global Bank Tech',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    expertise: ['Big Data', 'Cloud Architecture', 'Python / Spark', 'Management'],
    availability: '1h / semaine (Session individuelle)',
    bio: 'Experte des infrastructures de données sécurisées dans le secteur bancaire. Mentor engagée depuis 4 ans auprès de la communauté IT-LeadHER.',
    rating: 4.8,
    menteesCount: 11,
    linkedin: 'https://linkedin.com'
  },
  {
    id: 'mentor-4',
    userId: 'u-mentor-4',
    name: 'Grace Ndaye',
    role: 'Head of Product Design',
    company: 'InnoApp Digital',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
    expertise: ['UI/UX Design', 'Design Systems', 'Product Strategy', 'Portfolio Review'],
    availability: '2h / semaine (Disponible)',
    bio: 'J\'aide les créatives et designers à structurer leur portfolio professionnel et à décrocher des postes internationaux.',
    rating: 4.9,
    menteesCount: 16,
    linkedin: 'https://linkedin.com'
  }
];

export const initialEvents: Event[] = [
  {
    id: 'event-2',
    title: 'Hackathon Women Tech Code Challenge',
    description: '48 heures non-stop pour concevoir et développer des solutions numériques durables face aux défis sociaux actuels.',
    type: 'hackathon',
    typeLabel: 'Hackathon 48H',
    date: '24-26 Novembre 2026',
    time: 'Vendredi 18h - Dimanche 18h',
    location: 'Hub d\'Innovation IT-LeadHER & Discord Server',
    isOnline: true,
    link: 'https://discord.gg/itleadher',
    image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80',
    registeredCount: 0,
    maxCapacity: 200,
    speakers: [
      { name: 'KOSSONOU Emma', role: 'Executive Board', company: 'IT-LeadHER', avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=150&q=80' }
    ]
  },
];

export const initialArticles: Article[] = [
  {
    id: 'art-1',
    title: 'Comment franchir le plafond de verre dans les métiers de la Tech ?',
    slug: 'franchir-plafond-de-verre-tech',
    summary: 'Découvrez les stratégies concrètes adoptées par nos mentors pour affirmer leur posture, négocier leur salaire et atteindre des rôles exécutifs.',
    content: `Le secteur du numérique offre des opportunités de carrière inédites, mais les statistiques restent formelles : les femmes n'occupent aujourd'hui que 22% des postes techniques et moins de 15% des rôles de direction.

### 1. Construire une expertise technique indiscutable
L'apprentissage continu est votre meilleure arme. Ne vous limitez pas aux acquis universitaires : obtenez des certifications reconnues et contribuez à des projets open-source.

### 2. Développer un réseau de soutien et trouver une mentor
Personne ne réussit seule. Le mentorat vous permet d'éviter les pièges classiques et de bénéficier de recommandations directes dans des entreprises stratégiques.

### 3. Oser la prise de parole et valoriser ses accomplissements
Ne laissez pas le syndrome de l'imposteur freiner votre parole en réunion. Exprimez vos idées clairement et documentez vos victoires techniques.`,
    category: 'Leadership',
    cover: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80',
    authorName: 'Khadidia Mahamane Traoré',
    authorRole: 'Vice-Présidente IT-LeadHER',
    authorAvatar: 'https://www.hs-coburg.de/wp-content/uploads/2024/03/person-silhouette-2.jpg',
    readTime: '5 min de lecture',
    createdAt: '18 Juillet 2026',
    tags: ['Leadership', 'Carrière', 'Soft Skills', 'Empowerment'],
    comments: [
      { id: 'com-1', userName: 'Aminata Ndiaye', userAvatar: 'https://www.hs-coburg.de/wp-content/uploads/2024/03/person-silhouette-2.jpg', text: 'Article très inspirant ! Le conseil sur la documentation des victoires techniques change tout.', date: '19 Juillet 2026' }
    ]
  },
  {
    id: 'art-2',
    title: 'Les opportunités majeures de l\'IA Générative pour l\'Afrique en 2026',
    slug: 'ia-generative-opportunites-afrique',
    summary: 'Une analyse prospective sur l\'adoption des modèles d\'IA et la création d\'applications sur-mesure pour la santé, l\'éducation et la finance.',
    content: `L'Intelligence Artificielle Générative ne se résume pas à de simples chatbots. Elle représente un levier d'accélération économique massif pour le continent africain.

### Dépasser le statut de consommateur pour devenir créateur
Grâce aux API ouvertes et aux modèles légers applicables sur mobile, les développeuses d'IT-LeadHER créent des assistants agricoles multilingues et des solutions d'éducation personnalisée.`,
    category: 'Technologie',
    cover: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&w=800&q=80',
    authorName: 'Mariam Sow',
    authorRole: 'AI Researcher',
    authorAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80',
    readTime: '7 min de lecture',
    createdAt: '12 Juillet 2026',
    tags: ['IA', 'Python', 'Innovation', 'Future of Work'],
    comments: []
  }
];

export const initialPartners: Partner[] = [
  {
    id: 'part-1',
    name: 'TechAfrique Group',
    logo: '🌐 TechAfrique',
    category: 'Tech',
    tier: 'Grand Partenaire',
    description: 'Leader des solutions logicielles et cloud sur le continent africain, soutien officiel du programme d\'incubation IT-LeadHER.',
    website: 'https://techafrique.example.com'
  },
  {
    id: 'part-2',
    name: 'Global Innovation Foundation',
    logo: '🏛️ Global Foundation',
    category: 'Institutionnel',
    tier: 'Grand Partenaire',
    description: 'Organisation internationale œuvrant pour l\'inclusion numérique des femmes et le développement durable.',
    website: 'https://globalfoundation.example.org'
  },
  {
    id: 'part-3',
    name: 'Ecole Supérieure Polytechnique',
    logo: '🎓 ESP Digital',
    category: 'Éducation',
    tier: 'Partenaire Majeur',
    description: 'Partenaire académique pour la certification et le partage de ressources pédagogiques.',
    website: 'https://esp.example.edu'
  },
  {
    id: 'part-4',
    name: 'CyberShield Systems',
    logo: '🛡️ CyberShield',
    category: 'Tech',
    tier: 'Sponsor',
    description: 'Entreprise spécialisée dans la cybersécurité offrant des bourses d\'études complètes aux apprenantes.',
    website: 'https://cybershield.example.com'
  }
];

export const initialTestimonials: Testimonial[] = [
  {
    id: 'test-1',
    name: 'Sarah Soro',
    role: 'Développeuse Frontend React',
    promotion: 'Cohorte Web 2025',
    company: 'Fintech Solutions',
    photo: 'https://www.hs-coburg.de/wp-content/uploads/2024/03/person-silhouette-2.jpg',
    quote: 'Avant IT-LeadHER, je n\'osais pas postuler aux offres techniques. Grâce aux cours structurés et au soutien de ma mentor Aïcha, j\'ai décroché mon premier CDI de développeuse en 4 mois !'
  },
  {
    id: 'test-2',
    name: 'Nathalie Kouassi',
    role: 'Data Analyst & Co-Fondatrice',
    promotion: 'Cohorte Data 2025',
    company: 'AgriTech Start-up',
    photo: 'https://www.hs-coburg.de/wp-content/uploads/2024/03/person-silhouette-2.jpg',
    quote: 'La communauté IT-LeadHER est bien plus qu\'une académie : c\'est une sororité professionnelle où chacune s\'entraide pour atteindre le sommet.'
  },
  {
    id: 'test-3',
    name: 'Bintou Camara',
    role: 'Cybersecurity Junior',
    promotion: 'Cohorte Cyber 2026',
    company: 'BankCorp',
    photo: 'https://www.hs-coburg.de/wp-content/uploads/2024/03/person-silhouette-2.jpg',
    quote: 'Les projets pratiques et la préparation intensive aux entretiens m\'ont donné la confiance nécessaire pour réussir mon audit technique avec les félicitations du jury.'
  }
];

export const initialTeam: TeamMember[] = [
  {
  id: 'tm-1',
  name: 'KOSSONOU Emma Abenan ',
  role: 'Présidente',
  bio: 'Présidente d’IT-LeadHER, KOSSONOU Emma  porte la vision stratégique de l’organisation et œuvre pour la promotion du leadership féminin dans les domaines du numérique, de l’innovation et de l’entrepreneuriat. Elle pilote les orientations de l’association, développe les partenariats stratégiques et veille à la mise en œuvre d’initiatives à fort impact pour accompagner la nouvelle génération de femmes leaders .',
  photo: '/assets/img.jpg',
  linkedin: 'https://www.linkedin.com/in/emma-abenan-christelle-kossonou-871757351/'
  },
  {
  id: 'tm-2',
  name: 'TRAORE Khadidia Mahamane',
  role: 'Vice-Présidente',
  bio: 'Vice-Présidente d’IT-LeadHER, TRAORE Khadidia Mahamane accompagne la mise en œuvre de la vision stratégique de l’organisation. Elle contribue au développement des partenariats, à la coordination des initiatives et à la promotion du leadership féminin dans les domaines du numérique, de l’innovation et de l’entrepreneuriat.',
  photo: '/assets/img.jpg',
  linkedin: 'https://www.linkedin.com/in/khadidia-m/'
},
{
  id: 'tm-3',
  name: 'WADJAS Moyhe Armel',
  role: 'Secrétaire Générale',
  bio: 'Secrétaire Générale d’IT-LeadHER, WADJAS Moyhe Armel assure la coordination administrative de l’organisation, le suivi des activités et la gestion des relations institutionnelles. Elle veille à la bonne gouvernance et au bon fonctionnement des programmes afin de soutenir la mission de l’association.',
  photo: '/assets/img.jpg',
  linkedin: 'https://www.linkedin.com/in/moyhe-armel-wadjas-123456789/'
}
];

export const demoUsers: User[] = [
  {
    id: 'user-member-1',
    firstName: 'Sarah',
    lastName: 'Kone',
    email: 'sarah.kone@example.com',
    role: 'member',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    country: 'Côte d\'Ivoire',
    technicalLevel: 'Débutant',
    domainInterest: 'Développement Web & IA',
    bio: 'Passionnée de code et membre active de la communauté IT-LeadHER depuis 2025.',
    createdAt: '2025-10-12'
  },
];
