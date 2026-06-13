import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Ghost } from 'lucide-react';
import { QUESTION_MAP, GhostStage } from '../constants/questions';
import { useAuth } from '../context/AuthContext';

const PRESET_TAGS = ['unprofessional', 'no-response', 'wasted-time', 'misleading', 'rude', 'unorganized', 'no-feedback', 'salary-lowball', 'bait-and-switch'];

export default function ReportGhostForm() {
  const { user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  
  // Auth Guard Verification
  useEffect(() => {
    if (!authLoading && !user) navigate('/');
  }, [user, authLoading, navigate]);

  // Form Variables State Trackers
  const [meta, setMeta] = useState({ first: '', last: '', email: '', company: '' });
  const [stage, setStage] = useState<GhostStage>('INITIAL_OUTREACH');
  const [answers, setAnswers] = useState({ q1: '', q2: '', q3: '' });
  const [severity_rating, setSeverity] = useState(0);
  const [has_evidence, setHasEvidence] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');

  // Step 1 Validation Rule: All four structural metadata fields are required to proceed
  const isStep1Valid = meta.first.trim() !== '' && meta.last.trim() !== '' && meta.email.trim() !== '' && meta.company.trim() !== '';

  if (authLoading) return null;

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          recruiter_first_name: meta.first,
          recruiter_last_name: meta.last,
          recruiter_email: meta.email,
          company_name: meta.company,
          ghost_stage: stage,
          stage_answer_1: answers.q1,
          stage_answer_2: answers.q2,
          stage_answer_3: answers.q3,
          severity_rating,
          has_evidence,
          tags
        }),
      });
      const data = await res.json();
      if (res.ok) navigate(`/reviews/${data.id}`);
    } catch (e) { 
      console.error(e); 
    } finally { 
      setIsLoading(false); 
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8 text-white bg-black rounded-lg border border-zinc-900 my-8">
      {/* Visual Step Timeline Tracker Bar */}
      <div className="flex gap-2 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className={`h-1 flex-1 rounded transition-all duration-300 ${step >= i ? 'bg-[#6C47FF]' : 'bg-zinc-800'}`} />
        ))}
      </div>

      {/* Step 1: Core Corporate & Recruiter Target Selection Meta */}
      {step === 1 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold tracking-tight">Recruiter Profile Information</h2>
          <p className="text-sm text-zinc-400 mb-4">Please identify the target entity. All text fields are strictly required.</p>
          <input className="w-full bg-zinc-900 p-3 rounded border border-zinc-800 focus:border-[#6C47FF] outline-none" placeholder="Recruiter First Name" value={meta.first} onChange={e => setMeta({...meta, first: e.target.value})} />
          <input className="w-full bg-zinc-900 p-3 rounded border border-zinc-800 focus:border-[#6C47FF] outline-none" placeholder="Recruiter Last Name" value={meta.last} onChange={e => setMeta({...meta, last: e.target.value})} />
          <input className="w-full bg-zinc-900 p-3 rounded border border-zinc-800 focus:border-[#6C47FF] outline-none" type="email" placeholder="Recruiter Professional Email" value={meta.email} onChange={e => setMeta({...meta, email: e.target.value})} />
          <input className="w-full bg-zinc-900 p-3 rounded border border-zinc-800 focus:border-[#6C47FF] outline-none" placeholder="Target Company Name" value={meta.company} onChange={e => setMeta({...meta, company: e.target.value})} />
          <button onClick={() => isStep1Valid && setStep(2)} disabled={!isStep1Valid} className="w-full bg-[#6C47FF] py-3 rounded font-bold hover:bg-opacity-90 transition-all disabled:opacity-40 disabled:cursor-not-allowed mt-4">Next: Select Ghosting Stage</button>
        </div>
      )}

      {/* Step 2: Milestone Interaction Boundary Selection */}
      {step === 2 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold tracking-tight">Select Stage of Incident Breakdown</h2>
          <p className="text-sm text-zinc-400 mb-4">At what point in your interaction sequence did the target break off communication lines?</p>
          <div className="grid gap-3">
            {(Object.keys(QUESTION_MAP) as GhostStage[]).map(s => (
              <button key={s} onClick={() => { setStage(s); setStep(3); }} className="w-full p-4 border border-zinc-800 rounded text-left hover:border-[#6C47FF] bg-zinc-950 transition-all font-medium text-sm">
                {s.replaceAll('_', ' ')}
              </button>
            ))}
          </div>
          <button onClick={() => setStep(1)} className="w-full bg-zinc-900 text-zinc-400 py-2 rounded text-xs mt-4">Back to Profile</button>
        </div>
      )}

      {/* Step 3: Algorithmic Sequence Verification Inputs */}
      {step === 3 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold tracking-tight">Provide Logistical Timeline Details</h2>
          <p className="text-sm text-zinc-400 mb-4">Your responses provide numerical tracking anchors that feed the credibility indexing logic directly.</p>
          {Object.entries(QUESTION_MAP[stage]).map(([key, q]) => (
            <div key={key} className="space-y-2">
              <label className="block text-xs font-semibold uppercase text-zinc-400 tracking-wider">{q}</label>
              <input className="w-full bg-zinc-900 p-3 rounded border border-zinc-800 focus:border-[#6C47FF] outline-none text-sm" onChange={e => setAnswers({...answers, [key]: e.target.value})} />
            </div>
          ))}
          <button onClick={() => setStep(4)} className="w-full bg-[#6C47FF] py-3 rounded font-bold hover:bg-opacity-90 transition-all mt-4">Next: Finalize Metrics</button>
          <button onClick={() => setStep(2)} className="w-full bg-zinc-900 text-zinc-400 py-2 rounded text-xs">Back to Stage</button>
        </div>
      )}

      {/* Step 4: Metric Scales, Custom Anchors, and Evidence Checks */}
      {step === 4 && (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold tracking-tight mb-2">Metrics & Verification Check</h2>
            <label className="block text-xs font-semibold uppercase text-zinc-400 tracking-wider mb-3">Severity Rating Index (1-5)</label>
            <div className="flex gap-3 bg-zinc-950 p-4 rounded border border-zinc-900 justify-around">
              {[1, 2, 3, 4, 5].map(n => (
                <button key={n} type="button" onClick={() => setSeverity(n)} className={`p-2 transition-all transform hover:scale-110 ${severity_rating >= n ? 'text-[#6C47FF]' : 'text-zinc-700'}`}>
                  <Ghost size={36} fill={severity_rating >= n ? "currentColor" : "none"} />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <label className="block text-xs font-semibold uppercase text-zinc-400 tracking-wider">Contextual Categorization Tags (Maximum 5)</label>
            <div className="flex flex-wrap gap-2 p-3 bg-zinc-950 rounded border border-zinc-900 min-h-[50px]">
              {PRESET_TAGS.map(t => (
                <button key={t} type="button" onClick={() => tags.length < 5 && !tags.includes(t) && setTags([...tags, t])} className="bg-zinc-900 border border-zinc-800 px-2.5 py-1 rounded text-xs text-zinc-300 hover:border-[#6C47FF] hover:text-white transition-all">
                  + {t}
                </button>
              ))}
            </div>
            
            <div className="flex gap-2">
              <input className="flex-1 bg-zinc-900 p-3 rounded border border-zinc-800 text-sm outline-none" value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyDown={e => {
                if (e.key === 'Enter' && tagInput.trim() !== '' && tags.length < 5 && !tags.includes(tagInput.trim())) {
                  setTags([...tags, tagInput.trim()]);
                  setTagInput('');
                }
              }} placeholder="Or type a custom classification tag and hit Enter..." />
            </div>

            <div className="flex flex-wrap gap-1.5 pt-1">
              {tags.map(t => (
                <span key={t} onClick={() => setTags(tags.filter(item => item !== t))} className="bg-[#6C47FF] text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 cursor-pointer hover:bg-red-600 transition-all">
                  {t} ×
                </span>
              ))}
            </div>
          </div>

          {/* Core Verification Checkbox Addition */}
          <div className="p-4 bg-zinc-950 rounded border border-zinc-900 my-2">
            <label className="flex items-start gap-3 cursor-pointer select-none">
              <input type="checkbox" checked={has_evidence} className="accent-[#6C47FF] w-5 h-5 rounded mt-0.5" onChange={(e) => setHasEvidence(e.target.checked)} />
              <span className="text-sm text-zinc-300 leading-tight">
                I have supporting evidence such as emails, messages, or screenshots that I can upload later to authenticate this report.
              </span>
            </label>
          </div>

          <button onClick={handleSubmit} disabled={isLoading || severity_rating === 0} className="w-full bg-[#6C47FF] py-3.5 rounded-lg font-bold hover:bg-opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-all mt-4 shadow-lg shadow-[#6C47FF]/10 text-base">
            {isLoading ? 'Processing Pipeline Submission...' : 'Finalize and Post Report'}
          </button>
          <button onClick={() => setStep(3)} className="w-full bg-zinc-900 text-zinc-400 py-2 rounded text-xs">Back to Evidence</button>
        </div>
      )}
    </div>
  );
}
