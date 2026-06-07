import { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { Ghost, Search, Users, User, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import MembershipFullModal from './MembershipFullModal';

const API_URL = import.meta.env.VITE_API_URL;

export default function Layout() {
  const { user, setUser } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await fetch(`${API_URL}/api/auth/logout`, { 
        method: 'POST', 
        credentials: 'include' 
      });
      setUser(null);
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col font-sans selection:bg-[#6C47FF] selection:text-white">
      <nav className="h-16 border-b border-zinc-800/50 flex items-center justify-between px-6 sticky top-0 bg-zinc-950/80 backdrop-blur-md z-40">
        <div className="flex items-center gap-8">
          <Link to="/" className="text-xl font-black tracking-widest text-white flex items-center gap-2 hover:text-zinc-300 transition-colors">
            <Ghost size={24} className="text-[#6C47FF]" strokeWidth={2.5} />
            GHOASTED
          </Link>
          
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-zinc-400">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <Link to="/search" className="hover:text-white transition-colors flex items-center gap-1.5"><Search size={16}/> Search</Link>
            <Link to="/communities" className="hover:text-white transition-colors flex items-center gap-1.5"><Users size={16}/> Communities</Link>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Link to="/profile" className="text-zinc-400 hover:text-white flex items-center gap-2 text-sm font-medium transition-colors">
                <User size={18} /> <span className="hidden md:inline">{user.full_name}</span>
              </Link>
              <button onClick={handleLogout} className="text-zinc-500 hover:text-red-400 transition-colors p-2" title="Logout">
                <LogOut size={18}/>
              </button>
              <Link to="/submit" className="bg-[#6C47FF] hover:bg-[#5b3ce0] text-white px-4 py-2 rounded font-bold text-sm transition-colors shadow-lg shadow-[#6C47FF]/20">
                Report Ghost
              </Link>
            </>
          ) : (
            <button onClick={() => setIsModalOpen(true)} className="bg-white hover:bg-zinc-200 text-zinc-950 px-4 py-2 rounded font-bold text-sm transition-colors">
              Request Invite
            </button>
          )}
        </div>
      </nav>

      <main className="flex-1 flex flex-col relative">
        <Outlet />
      </main>

      <footer className="border-t border-zinc-800/50 py-12 text-center text-zinc-600 text-xs">
        <p className="mb-2 font-medium">© 2026 Ghoasted™ Inc. All rights reserved. Owned and operated by Ghoasted Inc.</p>
        <p className="mb-6">GHOASTED™, GHOAST™, and THE VEIL™ are trademarks of Ghoasted Inc. Patent Pending.</p>
        <div className="flex justify-center gap-6 text-zinc-500 font-medium">
          <Link to="/privacy" className="hover:text-zinc-300 transition-colors">Privacy Policy</Link>
          <Link to="/terms" className="hover:text-zinc-300 transition-colors">Terms of Service</Link>
          <Link to="/support" className="hover:text-zinc-300 transition-colors">Support</Link>
          <Link to="/guidelines" className="hover:text-zinc-300 transition-colors">Guidelines</Link>
        </div>
      </footer>

      <MembershipFullModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
