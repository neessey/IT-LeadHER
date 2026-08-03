import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { User as UserIcon, Lock, Mail, Globe, Award, Sparkles, Shield, Eye, EyeOff, CheckCircle2, UserCheck, Briefcase, Upload, Camera, Image as ImageIcon, ArrowRight } from 'lucide-react';
import { UserRole } from '../../types';

const DEFAULT_AVATAR = 'https://www.hs-coburg.de/wp-content/uploads/2024/03/person-silhouette-2.jpg';

export const AuthPage: React.FC = () => {
  const { login, loginWithGoogle, registerUser, t, language } = useApp();
  const [isRegister, setIsRegister] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register form state
  const [regData, setRegData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'member' as UserRole,
    country: "Côte d'Ivoire",
    technicalLevel: 'Débutant' as 'Débutant' | 'Intermédiaire' | 'Avancé',
    domainInterest: 'Développement Web & React',
    bio: '',
    linkedin: '',
    avatar: DEFAULT_AVATAR
  });

  const [passwordError, setPasswordError] = useState('');

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert("L'image sélectionnée est trop volumineuse (max 5 Mo).");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        setRegData(prev => ({ ...prev, avatar: reader.result as string }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(loginEmail, loginPassword);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (regData.password && regData.password !== regData.confirmPassword) {
      setPasswordError('Les mots de passe ne correspondent pas.');
      return;
    }
    if (regData.password && regData.password.length < 6) {
      setPasswordError('Le mot de passe doit contenir au moins 6 caractères.');
      return;
    }
    setPasswordError('');
    registerUser({
      firstName: regData.firstName,
      lastName: regData.lastName,
      email: regData.email,
      role: regData.role,
      country: regData.country,
      technicalLevel: regData.technicalLevel,
      domainInterest: regData.domainInterest,
      bio: regData.bio,
      linkedin: regData.linkedin,
      avatar: regData.avatar
    }, regData.password);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 bg-gray-50">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden">
        
        {/* Header */}
        <div className="bg-rose-600 text-white p-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
                            <img src="/assets/ai.jpeg" alt="IT-LeadHER" className="w-10 h-10 object-contain rounded-xl" />

          </div>
          <h2 className="text-2xl font-bold tracking-tight">
            {isRegister ? 'Créer votre compte' : 'Bienvenue sur IT-LeadHER'}
          </h2>
          <p className="text-sm text-rose-100 max-w-md mx-auto mt-1">
            {isRegister
              ? 'Rejoignez le réseau des femmes leaders dans la tech'
              : 'Connectez-vous pour accéder à vos formations et au réseau'}
          </p>
        </div>

        {/* Form Body */}
        <div className="p-8 space-y-6">
          
          {/* Toggle buttons */}
          <div className="flex rounded-xl bg-gray-100 p-1 text-sm font-bold">
            <button
              onClick={() => setIsRegister(false)}
              className={`flex-1 py-3 rounded-xl transition-all cursor-pointer ${
                !isRegister ? 'bg-white text-rose-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Se connecter
            </button>
            <button
              onClick={() => setIsRegister(true)}
              className={`flex-1 py-3 rounded-xl transition-all cursor-pointer ${
                isRegister ? 'bg-white text-rose-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Créer un compte
            </button>
          </div>

          {/* Google Sign In */}
          <button
            type="button"
            onClick={() => loginWithGoogle()}
            className="w-full py-3.5 px-4 rounded-xl bg-white hover:bg-gray-50 border-2 border-gray-200 text-gray-700 font-medium text-sm transition-all flex items-center justify-center gap-3 cursor-pointer active:scale-[0.98]"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
            <span>{isRegister ? 'S\'inscrire avec Google' : 'Se connecter avec Google'}</span>
          </button>

          <div className="relative">
            <div className="border-t border-gray-200"></div>
            <span className="absolute left-1/2 -translate-x-1/2 -top-2.5 px-4 bg-white text-[10px] font-bold text-gray-400 uppercase tracking-wider">
              ou
            </span>
          </div>

          {!isRegister ? (
            /* Login Form */
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Adresse e-mail</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="vous@email.com"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-shadow"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-shadow"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3.5 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 text-gray-600">
                  <input type="checkbox" className="rounded border-gray-300 text-rose-600 focus:ring-rose-500" />
                  <span>Se souvenir de moi</span>
                </label>
                <a href="#" className="text-rose-600 hover:text-rose-700 font-medium">Mot de passe oublié ?</a>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm shadow-sm transition-colors"
              >
                Se connecter
              </button>
            </form>
          ) : (
            /* Registration Form */
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              
              {/* Avatar */}
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-3">
                <label className="block text-sm font-bold text-gray-700">Photo de profil</label>
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <div className="relative group shrink-0">
                    <img
                      src={regData.avatar || DEFAULT_AVATAR}
                      alt="Avatar"
                      className="w-20 h-20 rounded-full object-cover border-4 border-rose-200 bg-gray-100"
                    />
                    <label className="absolute bottom-0 right-0 bg-rose-600 hover:bg-rose-700 text-white p-2 rounded-full cursor-pointer shadow-md transition-transform hover:scale-110">
                      <Camera className="w-4 h-4" />
                      <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
                    </label>
                  </div>
                  <div className="flex-1 text-center sm:text-left">
                    <p className="text-sm text-gray-500">JPG, PNG, WEBP (max 5 Mo)</p>
                    {regData.avatar && regData.avatar !== DEFAULT_AVATAR && (
                      <button
                        type="button"
                        onClick={() => setRegData({ ...regData, avatar: DEFAULT_AVATAR })}
                        className="mt-1 text-sm text-red-600 hover:text-red-700 font-medium"
                      >
                        Supprimer la photo
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Prénom *</label>
                  <input
                    type="text"
                    required
                    value={regData.firstName}
                    onChange={(e) => setRegData({ ...regData, firstName: e.target.value })}
                    placeholder="Awa"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-shadow"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nom *</label>
                  <input
                    type="text"
                    required
                    value={regData.lastName}
                    onChange={(e) => setRegData({ ...regData, lastName: e.target.value })}
                    placeholder="Diop"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-shadow"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Adresse e-mail *</label>
                <input
                  type="email"
                  required
                  value={regData.email}
                  onChange={(e) => setRegData({ ...regData, email: e.target.value })}
                  placeholder="awa.diop@email.com"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-shadow"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe *</label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={regData.password}
                    onChange={(e) => setRegData({ ...regData, password: e.target.value })}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-shadow"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Confirmer *</label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={regData.confirmPassword}
                    onChange={(e) => setRegData({ ...regData, confirmPassword: e.target.value })}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-shadow"
                  />
                </div>
              </div>

              {passwordError && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-600 font-medium">
                  {passwordError}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pays</label>
                  <select
                    value={regData.country}
                    onChange={(e) => setRegData({ ...regData, country: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent bg-white"
                  >
                    {["Côte d'Ivoire", 'Sénégal', 'Cameroun', 'Mali', 'Burkina Faso', 'Togo', 'Bénin', 'Guinée', 'France', 'Canada', 'Autre'].map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Niveau technique</label>
                  <select
                    value={regData.technicalLevel}
                    onChange={(e) => setRegData({ ...regData, technicalLevel: e.target.value as any })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent bg-white"
                  >
                    <option value="Débutant">Débutant</option>
                    <option value="Intermédiaire">Intermédiaire</option>
                    <option value="Avancé">Avancé</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Domaine d'intérêt</label>
                <select
                  value={regData.domainInterest}
                  onChange={(e) => setRegData({ ...regData, domainInterest: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent bg-white"
                >
                  <option value="Développement Web & React">Développement Web & React</option>
                  <option value="Data Science & IA Générative">Data Science & IA</option>
                  <option value="Cybersécurité & Réseaux">Cybersécurité & Cloud</option>
                  <option value="UI/UX Design & Product">UI/UX Design & Product</option>
                  <option value="Leadership & Entreprenariat Tech">Leadership & Management</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm shadow-sm transition-colors"
              >
                Créer mon compte
              </button>
            </form>
          )}

        </div>
      </div>
    </div>
  );
};