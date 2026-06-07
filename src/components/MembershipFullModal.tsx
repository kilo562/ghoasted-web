import { useState } from 'react';
import { X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const API_URL = import.meta.env.VITE_API_URL;

export default function MembershipFullModal({ isOpen, onClose }: ModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  
  const { setUser } = useAuth();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!isLogin && !consent) {
      setError('You must agree to the Privacy Policy to proceed.');
      return;
    }

    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
    const body = isLogin 
      ? { email, password } 
      : { email, password, full_name: fullName };

    try {
      const res = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        credentials: 'include',
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Authentication failed');

      if (isLogin) {
        setUser(data.user);
        onClose();
      } else {
        setMessage(data.message || 'Registration successful. You may now log in.');
        setIsLogin(true);
        setPassword('');
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-lg p-6 relative shadow-2xl">
        <button onClick={onClose} className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors">
          <X size={20} />
        </button>

        <h2 className="text-2xl font-bold text-white mb-6 tracking-tight">
          {isLogin ? 'Enter The Veil' : 'Request Invitation'}
        </h2>

        {error && <div className="mb-4 p-3 bg-red-950/50 border border-red-500/50 text-red-200 text-sm rounded">{error}</div>}
        {message && <div className="mb-4 p-3 bg-green-950/50 border border-green-500/50 text-green-200 text-sm rounded">{message}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <>
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1 uppercase tracking-wider">Full Name</label>
                <input 
                  type="text" required
                  className="w-full bg-zinc-950 border border-zinc-800 rounded p-2.5 text-white focus:border-[#6C47FF] focus:ring-1 focus:ring-[#6C47FF] outline-none transition-all"
                  value={fullName} onChange={e => setFullName(e.target.value)}
                />
              </div>
              <div className="flex items-start gap-3 mt-2 bg-zinc-950/50 p-3 border border-zinc-800 rounded">
                <input 
                  type="checkbox" required
                  id="privacy-consent"
                  className="mt-1 w-4 h-4 accent-[#6C47FF] bg-zinc-900 border-zinc-700 rounded cursor-pointer"
                  checked={consent} onChange={e => setConsent(e.target.checked)}
                />
                <label htmlFor="privacy-consent" className="text-xs text-zinc-400 leading-relaxed cursor-pointer select-none">
                  I agree to the Privacy Policy and acknowledge the zero-knowledge architecture.
                </label>
              </div>
            </>
          )}
          
          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1 uppercase tracking-wider">Work Email</label>
            <input 
              type="email" required
              className="w-full bg-zinc-950 border border-zinc-800 rounded p-2.5 text-white focus:border-[#6C47FF] focus:ring-1 focus:ring-[#6C47FF] outline-none transition-all"
              value={email} onChange={e => setEmail(e.target.value)}
            />
          </div>
          
          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1 uppercase tracking-wider">Password</label>
            <input 
              type="password" required
              className="w-full bg-zinc-950 border border-zinc-800 rounded p-2.5 text-white focus:border-[#6C47FF] focus:ring-1 focus:ring-[#6C47FF] outline-none transition-all"
              value={password} onChange={e => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="w-full bg-[#6C47FF] hover:bg-[#5b3ce0] text-white font-bold py-3 px-4 rounded transition-colors mt-4">
            {isLogin ? 'Authenticate' : 'Submit Request'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-zinc-500">
          {isLogin ? "Don't have access? " : "Already verified? "}
          <button onClick={() => { setIsLogin(!isLogin); setError(''); setMessage(''); setConsent(false); }} className="text-[#6C47FF] hover:text-[#8a6df2] font-medium transition-colors">
            {isLogin ? 'Request Invite' : 'Log In'}
          </button>
        </div>
      </div>
    </div>
  );
}
