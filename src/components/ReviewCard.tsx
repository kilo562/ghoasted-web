import React from 'react';
import type { Review } from '../pages/Feed';

// Utility for relative time (e.g., "2 hours ago")
function getRelativeTime(dateString: string) {
  const date = new Date(dateString);
  const diffInSeconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return 'Just now';
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) return `${diffInDays}d ago`;
  return date.toLocaleDateString();
}

// Utility to format the Enum stage nicely
function formatStage(stage: string) {
  return stage.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}

// Color logic for P-Score (1-2 Green, 2-4 Amber, 4-5 Red)
function getScoreColor(score: number) {
  if (score < 2) return 'text-emerald-400';
  if (score < 4) return 'text-amber-400';
  return 'text-red-500';
}

// Color logic for Confidence Level
function getConfidenceStyle(level: string) {
  switch (level) {
    case 'HIGH': return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
    case 'MEDIUM': return 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
    case 'LOW':
    default: return 'bg-zinc-800 text-zinc-400 border border-zinc-700';
  }
}

export default function ReviewCard({ review }: { review: Review }) {
  // Use the company score as the primary display, fallback to recruiter score
  const scoreData = review.company_score || review.recruiter_score;
  const pScore = scoreData?.aggregate_score ? scoreData.aggregate_score.toFixed(2) : 'N/A';
  const confLevel = scoreData?.confidence_level || 'LOW';

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 sm:p-6 shadow-sm hover:border-zinc-700 transition-colors">
      
      {/* Top Header Row */}
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight leading-tight">
            {review.company_name}
          </h2>
          <p className="text-lg text-zinc-300 mt-1">
            <span className="text-zinc-500 font-medium mr-2">Target:</span>
            {review.recruiter_first_name} {review.recruiter_last_name}
          </p>
          
          {/* Stage Badge */}
          <div className="mt-3 inline-flex items-center px-2.5 py-1 rounded-md text-sm font-medium bg-red-950/40 text-red-400 border border-red-900/50">
            Stage: {formatStage(review.ghost_stage)}
          </div>
        </div>

        {/* P-Score Block */}
        <div className="flex flex-row sm:flex-col items-center sm:items-end gap-3 sm:gap-1 bg-zinc-950/50 sm:bg-transparent p-3 sm:p-0 rounded-lg border border-zinc-800 sm:border-none w-full sm:w-auto justify-between sm:justify-start">
          <div className="text-right">
            <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1">P-Score</div>
            <div className={`text-4xl sm:text-5xl font-black tabular-nums tracking-tighter leading-none ${pScore !== 'N/A' ? getScoreColor(parseFloat(pScore)) : 'text-zinc-600'}`}>
              {pScore}
            </div>
          </div>
          <div className={`mt-2 px-2 py-0.5 text-[11px] font-bold tracking-widest uppercase rounded-sm ${getConfidenceStyle(confLevel)}`}>
            {confLevel} CONFIDENCE
          </div>
        </div>
      </div>

      {/* Middle Details Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6 py-5 border-y border-zinc-800/60">
        
        {/* Contact Info (Masked) */}
        <div className="space-y-2">
          {review.masked_email && (
            <div className="flex items-center text-sm text-zinc-400">
              <svg className="w-4 h-4 mr-2 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              {review.masked_email}
            </div>
          )}
          {review.masked_phone && (
            <div className="flex items-center text-sm text-zinc-400">
              <svg className="w-4 h-4 mr-2 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              {review.masked_phone}
            </div>
          )}
        </div>

        {/* Evidence & Details */}
        <div className="space-y-2 md:text-right">
          <div className="text-sm">
            <span className="text-zinc-500 mr-2">Severity:</span>
            <span className="text-zinc-200 font-medium">{review.severity_rating} / 5</span>
          </div>
          {review.has_evidence && (
            <div className="inline-flex items-center text-sm text-emerald-400">
              <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Verified Evidence Attached
            </div>
          )}
        </div>
      </div>

      {/* Bottom Row: Tags & Timestamp */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex flex-wrap gap-2">
          {review.tags && review.tags.map((tag, idx) => (
            <span key={idx} className="px-2 py-1 text-xs font-medium bg-zinc-800/80 text-zinc-300 rounded-md border border-zinc-700/50">
              #{tag}
            </span>
          ))}
          {review._count?.disputes ? (
            <span className="px-2 py-1 text-xs font-medium bg-[#6C47FF]/10 text-[#6C47FF] rounded-md border border-[#6C47FF]/20">
              {review._count.disputes} {review._count.disputes === 1 ? 'response' : 'responses'}
            </span>
          ) : null}
        </div>
        
        <div className="text-xs text-zinc-500 font-medium whitespace-nowrap">
          Reported {getRelativeTime(review.created_at)}
        </div>
      </div>

    </div>
  );
}
