import React, { useState } from 'react';
import { Building2, Mail, UserCircle, CheckCircle2, AlertCircle } from 'lucide-react';

export default function EmployerWaitlist() {
  const [formData, setFormData] = useState({ email: '', company_name: '', role: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    try {
      const response = await fetch('/api/employer-waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.status === 201) {
        setStatus('success');
      } else {
        setStatus('error');
        setErrorMessage(data.error || 'Something went wrong. Please try again.');
      }
    } catch (err) {
      setStatus('error');
      setErrorMessage('Network error. Please check your connection and try again.');
    }
  };

  if (status === 'success') {
    return (
      <div className="max-w-2xl mx-auto mt-12 p-8 bg-zinc-950 border border-zinc-900 rounded-xl text-center">
        <CheckCircle2 className="w-16 h-16 text-[#6C47FF] mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">You're on the list.</h2>
        <p className="text-zinc-400">
          We'll be in touch when the Ghoasted Professional tier launches in Q4 2026.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto mt-12 p-6 sm:p-8 bg-zinc-950 border border-zinc-900 rounded-xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-3">Employer Waitlist</h1>
        <p className="text-zinc-400 leading-relaxed">
          The Ghoasted Professional tier launches Q4 2026 with dispute capability, accountability score management, and the Verified Trust Badge. Reserve your place now.
        </p>
      </div>

      {status === 'error' && (
        <div className="mb-6 p-4 bg-red-950/30 border border-red-900 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <p className="text-red-400 text-sm">{errorMessage}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-zinc-300 mb-2">Work Email</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-zinc-500" />
            </div>
            <input
              type="email"
              id="email"
              required
              className="block w-full pl-10 pr-3 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-[#6C47FF] focus:ring-1 focus:ring-[#6C47FF] transition-colors"
              placeholder="you@company.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              disabled={status === 'loading'}
            />
          </div>
        </div>

        <div>
          <label htmlFor="company_name" className="block text-sm font-medium text-zinc-300 mb-2">Company Name</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Building2 className="h-5 w-5 text-zinc-500" />
            </div>
            <input
              type="text"
              id="company_name"
              required
              className="block w-full pl-10 pr-3 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-[#6C47FF] focus:ring-1 focus:ring-[#6C47FF] transition-colors"
              placeholder="Acme Corp"
              value={formData.company_name}
              onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
              disabled={status === 'loading'}
            />
          </div>
        </div>

        <div>
          <label htmlFor="role" className="block text-sm font-medium text-zinc-300 mb-2">Your Role</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <UserCircle className="h-5 w-5 text-zinc-500" />
            </div>
            <input
              type="text"
              id="role"
              required
              className="block w-full pl-10 pr-3 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-[#6C47FF] focus:ring-1 focus:ring-[#6C47FF] transition-colors"
              placeholder="e.g. HR Manager, Lead Recruiter"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              disabled={status === 'loading'}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={status === 'loading'}
          className="w-full mt-2 flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[#6C47FF] hover:bg-[#5b3ce0] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#6C47FF] focus:ring-offset-zinc-950 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {status === 'loading' ? 'Submitting...' : 'Join the Waitlist'}
        </button>
      </form>
    </div>
  );
}
