import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { FaEye, FaEyeSlash, FaSpinner } from 'react-icons/fa';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const validateEmail = (value: string) => /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateEmail(email)) {
      setError('Veuillez entrer une adresse email valide.');
      return;
    }
    if (motDePasse.length < 4) {
      setError('Mot de passe trop court.');
      return;
    }

    setLoading(true);
    const res = await login(email, motDePasse);
    setLoading(false);

    if (res.ok) {
      if (remember) {
        // leave token in localStorage (already handled by AuthContext)
      } else {
        // if not remember, we could store token in sessionStorage instead — optional
      }
      navigate('/');
    } else {
      setError(res.message || 'Identifiants invalides');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-100 to-white">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-lg border">
        <div className="flex flex-col items-center gap-2 mb-6 text-center">
          <img src="/logo.png" alt="AKRIFI Logo" className="w-24 h-24 object-contain mx-auto mb-2" />
          <h2 className="text-3xl font-extrabold text-blue-800">Connexion</h2>
          <p className="text-sm text-gray-500">Accédez à votre espace AKRIFI</p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded bg-red-50 text-red-700 border border-red-100" role="alert" aria-live="polite">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <label className="block mb-2 text-gray-700">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-200"
            placeholder="votreemail@gmail.com"
            aria-label="Email"
            required
          />

          <label className="block mb-2 text-gray-700">Mot de passe</label>
          <div className="relative mb-4">
            <input
              type={showPassword ? 'text' : 'password'}
              value={motDePasse}
              onChange={(e) => setMotDePasse(e.target.value)}
              className="w-full p-3 border rounded-md pr-12 focus:outline-none focus:ring-2 focus:ring-blue-200"
              placeholder="Mot de passe"
              aria-label="Mot de passe"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
              aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          <div className="flex items-center justify-between mb-6">
            <label className="flex items-center gap-2 text-sm text-gray-600">
              <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
              Se souvenir de moi
            </label>
            <Link to="#" className="text-sm text-blue-700 hover:underline">Mot de passe oublié ?</Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full flex items-center justify-center gap-3 py-3 rounded-md text-white font-medium ${loading ? 'bg-blue-600 cursor-wait' : 'bg-blue-800 hover:bg-blue-900'}`}
          >
            {loading && <FaSpinner className="animate-spin" />}
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500">
          Pas de compte ? <Link to="#" className="text-blue-700 hover:underline">Contactez l'administrateur</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
