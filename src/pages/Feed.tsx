import React, { useState, useEffect } from 'react';
import ReviewCard from '../components/ReviewCard';

// Define the shape of the data we expect from the API
export interface Review {
  id: string;
  company_name: string;
  recruiter_first_name: string | null;
  recruiter_last_name: string | null;
  ghost_stage: string;
  severity_rating: number;
  stage_answer_1: string | null;
  has_evidence: boolean;
  tags: string[];
  created_at: string;
  masked_email: string | null;
  masked_phone: string | null;
  company_score: { aggregate_score: number; confidence_level: string } | null;
  recruiter_score: { aggregate_score: number; confidence_level: string } | null;
}

interface Meta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export default function Feed() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [meta, setMeta] = useState<Meta | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Filters and Pagination State
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [sort, setSort] = useState('newest'); // 'newest', 'oldest', 'severity'
  const [filterStage, setFilterStage] = useState('');
  const [page, setPage] = useState(1);

  // Debounce the search input to prevent API spam
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Reset to page 1 whenever a filter or search changes
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, sort, filterStage]);

  // Fetch data from the backend
  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      setError(null);

      try {
        // Construct query parameters
        const params = new URLSearchParams({
          page: page.toString(),
          limit: '10',
        });

        if (debouncedSearch) params.append('q', debouncedSearch);
        if (filterStage) params.append('ghost_stage', filterStage);
        
        // Map UI sort options to API expected values
        if (sort === 'severity') params.append('sort', 'severity');
        if (sort === 'oldest') params.append('sort', 'oldest');

        const response = await fetch(`/api/reviews?${params.toString()}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch reviews');
        }

        const json = await response.json();
        setReviews(json.data);
        setMeta(json.meta);
      } catch (err: any) {
        console.error(err);
        setError(err.message || 'An error occurred while loading the feed.');
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [debouncedSearch, sort, filterStage, page]);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white mb-4">
            They Ghoasted you. <br className="hidden sm:block" />
            <span className="text-red-600">We remember everything.</span>
          </h1>
          <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
            Search the public database of recruiter and company Ghoasting behavior. 
            Powered by verifiable corroboration algorithms.
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by company, recruiter name, or phone number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg py-4 pl-5 pr-12 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent text-lg shadow-sm"
            />
            {/* Simple magnifying glass SVG */}
            <div className="absolute right-4 top-4 text-zinc-500">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Controls: Filter and Sort */}
        <div className="flex flex-col sm:flex-row justify-between gap-4 mb-8">
          <div className="flex items-center gap-2">
            <label htmlFor="stage-filter" className="text-sm font-medium text-zinc-400">Filter:</label>
            <select
              id="stage-filter"
              value={filterStage}
              onChange={(e) => setFilterStage(e.target.value)}
              className="bg-zinc-900 border border-zinc-800 text-sm rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-600"
            >
              <option value="">All Stages</option>
              <option value="INITIAL_OUTREACH">Initial Outreach</option>
              <option value="SCREENING_CALL">Screening Call</option>
              <option value="HIRING_MANAGER_INTERVIEW">Hiring Manager Interview</option>
              <option value="FINAL_ROUND_OFFER">Final Round / Offer</option>
              <option value="POST_PLACEMENT">Post Placement</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label htmlFor="sort-select" className="text-sm font-medium text-zinc-400">Sort by:</label>
            <select
              id="sort-select"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="bg-zinc-900 border border-zinc-800 text-sm rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-600"
            >
              <option value="newest">Newest First</option>
              <option value="severity">Highest Severity</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
        </div>

        {/* Feed Content */}
        {error && (
          <div className="bg-red-900/20 border border-red-900 text-red-400 p-4 rounded-lg text-center mb-8">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-pulse flex flex-col items-center">
              <div className="h-8 w-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-zinc-500 font-medium">Loading records...</p>
            </div>
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-20 bg-zinc-900/50 rounded-xl border border-zinc-800">
            <svg className="mx-auto h-12 w-12 text-zinc-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="text-lg font-medium text-white mb-1">No ghosting records found</h3>
            <p className="text-zinc-400">Adjust your search or filters to see more results.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {reviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        )}

        {/* Pagination Controls */}
        {!loading && meta && meta.totalPages > 0 && (
          <div className="mt-10 flex items-center justify-between border-t border-zinc-800 pt-6">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 text-sm font-medium text-white bg-zinc-900 border border-zinc-800 rounded-md hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            <span className="text-sm text-zinc-400">
              Page <span className="text-white font-medium">{meta.page}</span> of <span className="text-white font-medium">{meta.totalPages}</span>
            </span>
            <button
              onClick={() => setPage(p => Math.min(meta.totalPages, p + 1))}
              disabled={page === meta.totalPages}
              className="px-4 py-2 text-sm font-medium text-white bg-zinc-900 border border-zinc-800 rounded-md hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
