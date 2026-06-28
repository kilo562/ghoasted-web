import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Ghost, Building2, MapPin, Calendar, FileText, Loader2, ShieldCheck, Mail, Phone, AlertTriangle } from 'lucide-react';
import { QUESTION_MAP, type GhostStage } from '../constants/questions';

const ghostStageLabels: Record<string, string> = {
  INITIAL_OUTREACH: "Initial Outreach",
  SCREENING_CALL: "Screening Call",
  HIRING_MANAGER_INTERVIEW: "Hiring Manager Interview",
  FINAL_ROUND_OFFER: "Final Round / Offer",
  POST_PLACEMENT: "Post Placement"
};

const getScoreColor = (score: number) => {
  if (score < 2) return 'text-emerald-400';
  if (score < 4) return 'text-amber-400';
  return 'text-red-500';
};

export default function ReviewDetail() {
  const { id } = useParams<{ id: string }>();
  const [review, setReview] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchReview = async () => {
      try {
        const res = await fetch(`/api/reviews/${id}`, { credentials: 'include' });
        if (!res.ok) {
          if (res.status === 404) throw new Error('Review not found.');
          throw new Error('Failed to load review.');
        }
        const data = await res.json();
        setReview(data);
      } catch (err: any) {
        setError(err.message || 'An unexpected error occurred.');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) fetchReview();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#6C47FF] animate-spin" />
      </div>
    );
  }

  if (error || !review) {
    return (
      <div className="max-w-4xl mx-auto p-8 text-center mt-12">
        <Link to="/" className="inline-flex items-center text-zinc-400 hover:text-white transition-colors mb-8">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Feed
        </Link>
        <div className="bg-zinc-950 border border-zinc-900 rounded-lg p-12">
          <Ghost className="w-16 h-16 text-zinc-700 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">{error || 'Review not found'}</h2>
          <p className="text-zinc-500">The report you are looking for may have been removed or does not exist.</p>
        </div>
      </div>
    );
  }

  const recruiterName = review.recruiter_first_name && review.recruiter_last_name 
    ? `${review.recruiter_first_name} ${review.recruiter_last_name}`
    : 'Anonymous Recruiter';

  const questionsForStage = QUESTION_MAP[review.ghost_stage as GhostStage] || {};

  // SEO Structured Data
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Review",
    "itemReviewed": {
      "@type": "Organization",
      "name": review.company_name
    },
    "author": {
      "@type": "Person",
      "name": "Anonymous Candidate"
    },
    "reviewRating": {
      "@type": "Rating",
      "ratingValue": review.severity_rating,
      "bestRating": "5",
      "worstRating": "1"
    },
    "reviewBody": `Ghosting report regarding ${recruiterName} at ${review.company_name}. Stage: ${ghostStageLabels[review.ghost_stage] || review.ghost_stage}.`,
    "datePublished": review.created_at || review.created_date,
    "publisher": {
      "@type": "Organization",
      "name": "Ghoasted"
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />

      <Link to="/" className="inline-flex items-center text-zinc-400 hover:text-white transition-colors mb-6">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Feed
      </Link>

      <div className="bg-black border border-zinc-900 rounded-lg overflow-hidden">
        
        {/* Header Section */}
        <div className="p-6 sm:p-8 border-b border-zinc-900 bg-zinc-950/50">
          <div className="flex flex-col md:flex-row justify-between items-start gap-6">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <Ghost className="w-8 h-8 text-[#6C47FF]" />
                <h1 className="text-3xl font-bold text-white tracking-tight">{recruiterName}</h1>
              </div>
              
              <div className="flex items-center gap-2 text-lg text-zinc-300 mb-4">
                <Building2 className="w-5 h-5 text-zinc-500" />
                <span className="font-medium">{review.company_name}</span>
              </div>

              <div className="flex flex-col gap-2 text-sm text-zinc-400">
                {review.masked_email && (
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" /> <span>{review.masked_email}</span>
                  </div>
                )}
                {review.masked_phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4" /> <span>{review.masked_phone}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col items-end gap-3 min-w-[200px]">
              <div className="bg-zinc-950 border border-zinc-800 px-4 py-2 rounded-lg text-center w-full">
                <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1">Severity Rating</div>
                <div className="flex items-center justify-center gap-1">
                  {[1, 2, 3, 4, 5].map(i => (
                    <Ghost key={i} className={`w-5 h-5 ${i <= review.severity_rating ? 'text-[#6C47FF] fill-[#6C47FF]/20' : 'text-zinc-800'}`} />
                  ))}
                </div>
              </div>
              <span className="bg-[#6C47FF]/10 text-[#6C47FF] border border-[#6C47FF]/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                {ghostStageLabels[review.ghost_stage] || review.ghost_stage}
              </span>
            </div>
          </div>
        </div>

        {/* Validation / P-Score Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-zinc-900 border-b border-zinc-900">
          <div className="p-6">
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck className="w-5 h-5 text-[#6C47FF]" />
              <h3 className="font-semibold text-white">Recruiter Corroboration</h3>
            </div>
            {review.recruiter_score ? (
              <div>
                <div className={`text-3xl font-bold ${getScoreColor(review.recruiter_score.aggregate_score)}`}>
                  {review.recruiter_score.aggregate_score.toFixed(2)}
                  <span className="text-lg text-zinc-500">/5.0</span>
                </div>
                <div className="text-sm text-zinc-400 mt-1">Confidence: <span className="text-white capitalize">{review.recruiter_score.confidence_level}</span></div>
              </div>
            ) : (
              <div className="text-sm text-zinc-500 flex items-center gap-2 mt-2">
                <AlertTriangle className="w-4 h-4" /> Insufficient data for index
              </div>
            )}
          </div>
          <div className="p-6">
            <div className="flex items-center gap-2 mb-2">
              <Building2 className="w-5 h-5 text-[#6C47FF]" />
              <h3 className="font-semibold text-white">Company Corroboration</h3>
            </div>
            {review.company_score ? (
              <div>
                <div className={`text-3xl font-bold ${getScoreColor(review.company_score.aggregate_score)}`}>
                  {review.company_score.aggregate_score.toFixed(2)}
                  <span className="text-lg text-zinc-500">/5.0</span>
                </div>
                <div className="text-sm text-zinc-400 mt-1">Confidence: <span className="text-white capitalize">{review.company_score.confidence_level}</span></div>
              </div>
            ) : (
              <div className="text-sm text-zinc-500 flex items-center gap-2 mt-2">
                <AlertTriangle className="w-4 h-4" /> Insufficient data for index
              </div>
            )}
          </div>
        </div>

        {/* Timeline Logistical Details */}
        <div className="p-6 sm:p-8 border-b border-zinc-900">
          <h3 className="text-lg font-bold text-white mb-6">Interaction Timeline Details</h3>
          <div className="space-y-6">
            {Object.entries(questionsForStage).map(([key, label], idx) => {
              // Map q1, q2, q3 to stage_answer_1, stage_answer_2, stage_answer_3
              const answerKey = `stage_answer_${idx + 1}`;
              const answer = review[answerKey];
              if (!answer) return null;

              return (
                <div key={key} className="bg-zinc-950 p-4 rounded-lg border border-zinc-800">
                  <div className="text-xs font-semibold uppercase text-zinc-500 mb-2">{label as string}</div>
                  <div className="text-white">{answer}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Tags & Evidence */}
        <div className="p-6 sm:p-8">
          {review.tags && review.tags.length > 0 && (
            <div className="mb-8">
              <h3 className="text-sm font-semibold uppercase text-zinc-500 mb-3">Contextual Tags</h3>
              <div className="flex flex-wrap gap-2">
                {review.tags.map((tag: string, idx: number) => (
                  <span key={idx} className="bg-zinc-900 border border-zinc-800 text-zinc-300 px-3 py-1 rounded-full text-xs">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {review.file_urls && review.file_urls.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold uppercase text-zinc-500 mb-3">Attached Evidence</h3>
              <div className="flex flex-wrap gap-4">
                {review.file_urls.map((url: string, idx: number) => {
                  const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(url);
                  return isImage ? (
                    <a key={idx} href={url} target="_blank" rel="noopener noreferrer" className="block group">
                      <img 
                        src={url} 
                        alt={`Evidence ${idx + 1}`} 
                        className="h-32 w-32 object-cover rounded-lg border border-zinc-800 group-hover:border-[#6C47FF] transition-all opacity-80 group-hover:opacity-100"
                      />
                    </a>
                  ) : (
                    <a 
                      key={idx} 
                      href={url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 px-4 py-3 bg-zinc-950 rounded-lg border border-zinc-800 hover:border-[#6C47FF] hover:bg-zinc-900 transition-all"
                    >
                      <FileText className="w-5 h-5 text-zinc-400" />
                      <span className="text-sm text-zinc-300">Document {idx + 1}</span>
                    </a>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-zinc-950 p-4 px-6 border-t border-zinc-900 flex justify-between items-center">
          <div className="flex items-center gap-2 text-xs text-zinc-500">
            <Calendar className="w-4 h-4" />
            <span>Reported on {new Date(review.created_at || review.created_date).toLocaleDateString()}</span>
          </div>
          {review.has_evidence && (
            <div className="flex items-center gap-1.5 text-xs text-green-500 font-medium bg-green-500/10 px-2 py-1 rounded">
              <ShieldCheck className="w-3.5 h-3.5" /> 
              Evidence Provided {review.file_urls?.length > 0 && `(${review.file_urls.length} files)`}
            </div>
          )}
        </div>

        {/* Dispute / Employer CTA */}
        <div className="bg-zinc-950 p-6 border-t border-zinc-900">
          <div className="flex items-start gap-3 mb-3">
            <ShieldCheck className="w-5 h-5 text-[#6C47FF] shrink-0 mt-0.5" />
            <h3 className="text-sm font-semibold text-white">Are you the recruiter or company mentioned in this report?</h3>
          </div>
          <p className="text-sm text-zinc-400 leading-relaxed mb-4">
            Ghoasted's Professional tier (launching Q4 2026) will allow verified recruiters and companies to submit factual responses that appear publicly alongside reports. Disputes are noted, never removed.
          </p>
          <Link
            to="/employer-waitlist"
            className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium bg-[#6C47FF] text-white hover:bg-[#5b3ce0] transition-colors"
          >
            Join the Employer Waitlist
          </Link>
        </div>
      </div>
    </div>
  );
}
