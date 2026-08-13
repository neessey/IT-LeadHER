import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ArrowLeft,
  CheckCircle2,
  PlayCircle,
  HelpCircle,
  Award,
  Lock,
  Download,
  Share2,
  Clock,
  Sparkles,
  ChevronDown,
  ChevronUp,
  BookOpen,
  Users,
  BarChart3,
  Check,
  X,
  AlertCircle,
  Volume2,
  VolumeX,
  Maximize,
  Minimize
} from 'lucide-react';
import { Certificate } from '@/src/types';

export const CourseDetailPage: React.FC = () => {
  const {
    courses,
    selectedCourseId,
    setActiveTab,
    currentUser,
    enrollments,
    completeLesson,
    setSelectedCertificate,
    certificates
  } = useApp();

  const course = courses.find(c => c.id === selectedCourseId) || courses[0];
  const [activeLessonIndex, setActiveLessonIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<Record<string, boolean>>({});
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isDownloading, setIsDownloading] = useState<string | null>(null);
  const videoRef = useRef<HTMLIFrameElement>(null);
  const videoElRef = useRef<HTMLVideoElement>(null);

  const enrollment = currentUser
    ? enrollments.find(e => e.userId === currentUser.id && e.courseId === course.id)
    : null;

  const currentLesson = course.lessons[activeLessonIndex] || course.lessons[0];

  // Vidéo hébergée (Cloudinary/téléphone) => lecteur natif avec vraie progression
  const isNativeVideo = (currentLesson as any)?.videoSource === 'local';

  const isLessonCompleted = enrollment?.completedLessonIds.includes(currentLesson?.id);
  const completedCount = enrollment?.completedLessonIds.length || 0;
  const totalLessons = course.lessons.length;

  const cert = currentUser
    ? certificates.find(c => c.userId === currentUser.id && c.courseId === course.id)
    : null;

  // Écouter les messages de l'iframe YouTube pour suivre la progression
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data && typeof event.data === 'string') {
        try {
          const data = JSON.parse(event.data);
          if (data.event === 'onStateChange') {
            if (data.info === 1) { // Lecture
              setIsVideoPlaying(true);
            } else if (data.info === 2 || data.info === 0) { // Pause ou fin
              setIsVideoPlaying(false);
            }
          }
        } catch (e) {
          // Ignorer les messages qui ne sont pas JSON
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  // Simuler la progression pour YouTube uniquement (l'API ne donne pas la progression facilement).
  // Pour une vidéo native (Cloudinary/téléphone), la vraie progression vient de onTimeUpdate.
  useEffect(() => {
    if (isNativeVideo) return;
    let interval: NodeJS.Timeout;
    if (isVideoPlaying) {
      interval = setInterval(() => {
        setVideoProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsVideoPlaying(false);
            return 100;
          }
          return prev + 1;
        });
      }, 500);
    }
    return () => clearInterval(interval);
  }, [isVideoPlaying, isNativeVideo]);

  // Réinitialiser l'état du lecteur quand on change de leçon
  useEffect(() => {
    setIsVideoPlaying(false);
    setVideoProgress(0);
  }, [currentLesson?.id]);

  const handleNativeTimeUpdate = () => {
    const video = videoElRef.current;
    if (!video || !video.duration || Number.isNaN(video.duration)) return;
    const pct = (video.currentTime / video.duration) * 100;
    setVideoProgress(Math.min(100, Math.max(0, pct)));
  };

  const handleNativeEnded = () => {
    setVideoProgress(100);
    setIsVideoPlaying(false);
  };

  const handleQuizSelect = (questionId: string, optionIdx: number) => {
    if (quizSubmitted[questionId]) return;
    setSelectedAnswers(prev => ({ ...prev, [questionId]: optionIdx }));
  };

  const handleQuizSubmit = (questionId: string) => {
    setQuizSubmitted(prev => ({ ...prev, [questionId]: true }));
  };

  const toggleVideo = () => {
    if (isNativeVideo) {
      const video = videoElRef.current;
      if (!video) return;
      if (video.paused || video.ended) {
        video.play().catch(() => {
          // Lecture bloquée par le navigateur (rare sur un clic direct) : on resynchronise l'état.
          setIsVideoPlaying(false);
        });
        setIsVideoPlaying(true);
      } else {
        video.pause();
        setIsVideoPlaying(false);
      }
      return;
    }

    setIsVideoPlaying(!isVideoPlaying);
    if (!isVideoPlaying) {
      // Simuler le démarrage de la vidéo
      setVideoProgress(0);
    }
  };

  const toggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);

    if (isNativeVideo) {
      const video = videoElRef.current;
      if (video) video.muted = nextMuted;
      return;
    }

    const iframe = videoRef.current;
    if (iframe) {
      const muteCmd = isMuted ? 'unMute' : 'mute';
      iframe.contentWindow?.postMessage(
        JSON.stringify({ event: 'command', func: muteCmd, args: '' }),
        '*'
      );
    }
  };

  const toggleFullscreen = () => {
    const el: HTMLElement | null = isNativeVideo ? videoElRef.current : videoRef.current;
    if (el) {
      if (!document.fullscreenElement) {
        el.requestFullscreen?.();
        setIsFullscreen(true);
      } else {
        document.exitFullscreen?.();
        setIsFullscreen(false);
      }
    }
  };

  const getProgressStats = () => {
    const totalQuiz = currentLesson.quiz?.length || 0;
    const answered = Object.keys(quizSubmitted).length;
    return { totalQuiz, answered };
  };

  const progressStats = getProgressStats();
  const allQuizzesDone = progressStats.totalQuiz > 0 && progressStats.answered === progressStats.totalQuiz;

  function handleDownloadCertificate(cert: Certificate): void {
    throw new Error('Function not implemented.');
  }

  return (
    <div className="min-h-screen bg-white pb-16">
      
      {/* Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <button
          onClick={() => setActiveTab('academy')}
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-rose-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Retour au catalogue</span>
        </button>
      </div>

      {/* En-tête du cours */}
      <header className="bg-gray-900 text-white py-8 mt-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            <div className="lg:col-span-2 space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <span className="px-3 py-1 rounded-full bg-rose-600 text-white text-xs font-bold uppercase">
                  {course.categoryLabel}
                </span>
                <span className="text-sm text-gray-400">Niveau : {course.level}</span>
                <span className="text-sm text-amber-400 font-bold">★ {course.rating}</span>
                <span className="text-sm text-gray-400">{course.lessons.length} leçons</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{course.title}</h1>
              <p className="text-sm text-gray-300 leading-relaxed max-w-2xl">
                {course.fullDescription}
              </p>

              <div className="flex items-center gap-4 text-sm text-gray-300">
                <div className="flex items-center gap-3">
                  <img
                    src={course.instructorAvatar}
                    alt={course.instructorName}
                    className="w-10 h-10 rounded-full object-cover border border-gray-700"
                  />
                  <div>
                    <div className="font-bold text-white">{course.instructorName}</div>
                    <div className="text-xs text-gray-400">{course.instructorRole}</div>
                  </div>
                </div>
                <div className="border-l border-gray-700 pl-4">
                  <div className="font-bold text-white">{course.duration}</div>
                  <div className="text-xs text-gray-400">Durée totale</div>
                </div>
              </div>
            </div>

            {/* Certificat */}
            <div className="bg-gray-800/50 p-6 rounded-2xl border border-gray-700 text-center space-y-3">
              <Award className="w-12 h-12 text-rose-400 mx-auto" />
              <div className="text-sm font-bold text-white">Certificat de Réussite</div>
              <p className="text-xs text-gray-400 leading-relaxed">
                Validez toutes les leçons et les quiz pour obtenir votre certificat numérique.
              </p>
              {cert ? (
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
                            <Award className="w-4 h-4" />
                            <span>Télécharger mon certificat</span>
                          </>
                        )}
                     
                    </button>
              ) : (
                <div className="w-full py-3 rounded-xl bg-gray-700/50 text-gray-400 text-sm font-bold flex items-center justify-center gap-2">
                  <Lock className="w-4 h-4" />
                  <span>Complétez le cours</span>
                </div>
              )}
            </div>
  
          </div>
        </div>
      </header>

      {/* Corps principal */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Sidebar - Liste des leçons */}
          <aside className="lg:col-span-1 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-gray-900">Leçons</span>
                <span className="text-xs text-rose-600 font-bold">
                  {completedCount}/{totalLessons}
                </span>
              </div>
              <div className="mt-2 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-rose-600 rounded-full transition-all duration-500"
                  style={{ width: `${(completedCount / totalLessons) * 100}%` }}
                />
              </div>
            </div>

            <div className="max-h-[600px] overflow-y-auto p-2 space-y-1">
              {course.lessons.map((lesson, idx) => {
                const isCompleted = enrollment?.completedLessonIds.includes(lesson.id);
                const isActive = idx === activeLessonIndex;
                const hasQuiz = lesson.quiz && lesson.quiz.length > 0;

                return (
                  <button
                    key={lesson.id}
                    onClick={() => setActiveLessonIndex(idx)}
                    className={`w-full text-left p-3 rounded-xl text-sm transition-all flex items-start gap-3 ${
                      isActive
                        ? 'bg-rose-50 border-2 border-rose-200 font-bold'
                        : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <div className="mt-0.5">
                      {isCompleted ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                      ) : (
                        <PlayCircle className={`w-5 h-5 shrink-0 ${isActive ? 'text-rose-600' : 'text-gray-400'}`} />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="line-clamp-1">{idx + 1}. {lesson.title}</div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-gray-400">{lesson.duration}</span>
                        {hasQuiz && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-50 text-purple-600 font-bold">
                            Quiz
                          </span>
                        )}
                        {isCompleted && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-600 font-bold">
                            ✓ Fait
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </aside>

          {/* Zone principale */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* Leçon active */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              
              {/* En-tête de la leçon */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-xs font-bold text-rose-600 uppercase">
                      Leçon {activeLessonIndex + 1} sur {totalLessons}
                    </span>
                    <h2 className="text-xl font-bold text-gray-900 mt-1">
                      {currentLesson.title}
                    </h2>
                  </div>
                  <button
                    onClick={() => completeLesson(course.id, currentLesson.id)}
                    disabled={isLessonCompleted}
                    className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-colors flex items-center gap-2 ${
                      isLessonCompleted
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 cursor-default'
                        : 'bg-rose-600 hover:bg-rose-700 text-white shadow-sm'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{isLessonCompleted ? 'Leçon validée' : 'Marquer comme terminée'}</span>
                  </button>
                </div>
              </div>

              {/* Lecteur vidéo */}
              <div className="relative bg-gray-900 aspect-video overflow-hidden group">
                {currentLesson.videoUrl ? (
                  <>
                    {isNativeVideo ? (
                      <video
                        ref={videoElRef}
                        src={currentLesson.videoUrl}
                        className="w-full h-full"
                        playsInline
                        onClick={toggleVideo}
                        onPlay={() => setIsVideoPlaying(true)}
                        onPause={() => setIsVideoPlaying(false)}
                        onTimeUpdate={handleNativeTimeUpdate}
                        onEnded={handleNativeEnded}
                      />
                    ) : (
                      <iframe
                        ref={videoRef}
                        src={`${currentLesson.videoUrl}?enablejsapi=1&rel=0&modestbranding=1`}
                        title={currentLesson.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                        className="w-full h-full"
                        onLoad={() => setIsVideoPlaying(true)}
                      />
                    )}

                    {/* Gros bouton play central pour la vidéo native, tant qu'elle ne joue pas.
                        Sans ça, sur mobile notamment, il n'y a rien de visible à cliquer. */}
                    {isNativeVideo && !isVideoPlaying && (
                      <button
                        onClick={toggleVideo}
                        className="absolute inset-0 flex flex-col items-center justify-center text-white bg-black/20 hover:bg-black/30 transition-colors"
                      >
                        <span className="w-20 h-20 rounded-full bg-rose-600 hover:bg-rose-700 flex items-center justify-center shadow-2xl transition-transform hover:scale-105">
                          <PlayCircle className="w-12 h-12 fill-current ml-1" />
                        </span>
                      </button>
                    )}

                    {/* Contrôles vidéo personnalisés : toujours visibles sur mobile (pas de hover),
                        et au survol sur desktop. */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={toggleVideo}
                          className="text-white hover:text-rose-400 transition-colors"
                        >
                          {isVideoPlaying ? (
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                              <rect x="6" y="4" width="4" height="16" />
                              <rect x="14" y="4" width="4" height="16" />
                            </svg>
                          ) : (
                            <PlayCircle className="w-6 h-6" />
                          )}
                        </button>

                        <button
                          onClick={toggleMute}
                          className="text-white hover:text-rose-400 transition-colors"
                        >
                          {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                        </button>

                        <div className="flex-1 h-1.5 bg-gray-600 rounded-full overflow-hidden cursor-pointer">
                          <div
                            className="h-full bg-rose-500 rounded-full transition-all duration-300"
                            style={{ width: `${videoProgress}%` }}
                          />
                        </div>

                        <span className="text-xs text-white font-medium">
                          {Math.floor(videoProgress)}%
                        </span>

                        <button
                          onClick={toggleFullscreen}
                          className="text-white hover:text-rose-400 transition-colors"
                        >
                          {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>

                    {/* Badge de progression */}
                    {videoProgress >= 100 && (
                      <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-emerald-500/90 backdrop-blur-sm text-white text-xs font-bold flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Visionné
                      </div>
                    )}
                  </>
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                    <button
                      onClick={toggleVideo}
                      className="w-20 h-20 rounded-full bg-rose-600 hover:bg-rose-700 flex items-center justify-center shadow-2xl transition-transform hover:scale-105"
                    >
                      <PlayCircle className="w-12 h-12 fill-current ml-1" />
                    </button>
                    <p className="mt-4 text-sm font-medium text-gray-300">
                      Cliquez pour lire la vidéo
                    </p>
                  </div>
                )}
              </div>

              {/* Contenu de la leçon */}
              <div className="p-6 space-y-6">
                <div className="prose prose-rose max-w-none text-sm text-gray-700 leading-relaxed whitespace-pre-wrap font-sans">
                  {currentLesson.content}
                </div>

                {/* Quiz */}
                {currentLesson.quiz && currentLesson.quiz.length > 0 && (
                  <div className="mt-8 bg-rose-50/50 rounded-2xl border border-rose-100 p-6 space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <HelpCircle className="w-5 h-5 text-rose-600" />
                        <span className="text-sm font-bold text-gray-900">
                          Quiz de validation
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">
                        {progressStats.answered}/{progressStats.totalQuiz} répondues
                      </span>
                    </div>

                    {currentLesson.quiz.map((q, qIdx) => {
                      const selected = selectedAnswers[q.id];
                      const isSubmitted = quizSubmitted[q.id];
                      const isCorrect = selected === q.correctAnswer;

                      return (
                        <div key={q.id} className="bg-white p-5 rounded-xl border border-gray-200 space-y-4">
                          <div className="text-sm font-bold text-gray-900">
                            Question {qIdx + 1} : {q.question}
                          </div>

                          <div className="space-y-2">
                            {q.options.map((option, optIdx) => {
                              const isSelected = selected === optIdx;
                              const isCorrectAnswer = optIdx === q.correctAnswer;
                              let className = 'w-full text-left p-3 rounded-xl text-sm transition-all border-2 ';
                              
                              if (isSubmitted) {
                                if (isCorrectAnswer) {
                                  className += 'bg-emerald-50 border-emerald-500 text-emerald-800';
                                } else if (isSelected && !isCorrectAnswer) {
                                  className += 'bg-red-50 border-red-500 text-red-800';
                                } else {
                                  className += 'bg-gray-50 border-gray-200 text-gray-500 opacity-50';
                                }
                              } else {
                                className += isSelected
                                  ? 'bg-rose-50 border-rose-500 text-rose-800'
                                  : 'bg-gray-50 border-gray-200 text-gray-700 hover:border-rose-300';
                              }

                              return (
                                <button
                                  key={optIdx}
                                  onClick={() => handleQuizSelect(q.id, optIdx)}
                                  disabled={isSubmitted}
                                  className={className}
                                >
                                  <div className="flex items-center gap-3">
                                    <span className="w-6 h-6 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center text-xs font-bold flex-shrink-0">
                                      {String.fromCharCode(65 + optIdx)}
                                    </span>
                                    <span>{option}</span>
                                    {isSubmitted && isCorrectAnswer && (
                                      <Check className="w-4 h-4 text-emerald-500 ml-auto" />
                                    )}
                                    {isSubmitted && isSelected && !isCorrectAnswer && (
                                      <X className="w-4 h-4 text-red-500 ml-auto" />
                                    )}
                                  </div>
                                </button>
                              );
                            })}
                          </div>

                          {!isSubmitted ? (
                            <button
                              onClick={() => handleQuizSubmit(q.id)}
                              disabled={selected === undefined}
                              className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                              Valider ma réponse
                            </button>
                          ) : (
                            <div className={`p-4 rounded-xl text-sm font-medium flex items-start gap-3 ${
                              isCorrect
                                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                : 'bg-red-50 text-red-800 border border-red-200'
                            }`}>
                              <div className="mt-0.5">
                                {isCorrect ? (
                                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                                ) : (
                                  <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
                                )}
                              </div>
                              <div>
                                <div className="font-bold">
                                  {isCorrect ? '✓ Bonne réponse !' : '✗ Mauvaise réponse'}
                                </div>
                                <div className="text-xs font-normal mt-1">{q.explanation}</div>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}

                    {allQuizzesDone && (
                      <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200 flex items-center gap-3">
                        <Award className="w-6 h-6 text-emerald-600" />
                        <div>
                          <div className="text-sm font-bold text-emerald-800">
                            🎉 Quiz terminé !
                          </div>
                          <div className="text-xs text-emerald-700">
                            Vous avez répondu à toutes les questions. Passez à la leçon suivante.
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Navigation entre les leçons */}
            <div className="flex items-center justify-between gap-4">
              <button
                onClick={() => setActiveLessonIndex(Math.max(0, activeLessonIndex - 1))}
                disabled={activeLessonIndex === 0}
                className="px-6 py-3 rounded-xl border-2 border-gray-200 text-sm font-medium text-gray-700 hover:border-rose-200 hover:text-rose-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                ← Leçon précédente
              </button>
              <button
                onClick={() => setActiveLessonIndex(Math.min(totalLessons - 1, activeLessonIndex + 1))}
                disabled={activeLessonIndex === totalLessons - 1}
                className="px-6 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Leçon suivante →
              </button>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
};