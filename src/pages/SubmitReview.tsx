import React, { useState } from 'react';
import { Ghost, Building2 } from "lucide-react";
import ReportGhostForm from "../components/ReportGhostForm";
import CompanyReviewForm from "../components/CompanyReviewForm";

export default function SubmitReview() {
    const [activeTab, setActiveTab] = useState('recruiter');

    return (
        <div className="min-h-screen bg-zinc-950">
            <div className="max-w-3xl mx-auto px-4 py-12">
                
                {/* Header Section */}
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-white mb-3">
                        You did the work. They went Ghoast.
                    </h1>
                    <p className="text-zinc-400 text-base mb-2">
                        Tell us exactly where they Ghoasted so we can hold them accountable.
                    </p>
                    <p className="text-xs text-emerald-400 font-medium">
                        🔒 Posted anonymously — Your identity stays protected
                    </p>
                </div>

                {/* Plain React Tab Switcher */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-1 grid grid-cols-2 mb-6 w-full">
                    <button
                        onClick={() => setActiveTab('recruiter')}
                        className={`rounded-lg py-3 flex items-center justify-center gap-2 font-medium text-sm w-full transition-all ${
                            activeTab === 'recruiter'
                                ? 'bg-[#6C47FF] text-white'
                                : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                        }`}
                    >
                        <Ghost className="w-4 h-4" />
                        Recruiter Review
                    </button>
                    
                    <button
                        onClick={() => setActiveTab('company')}
                        className={`rounded-lg py-3 flex items-center justify-center gap-2 font-medium text-sm w-full transition-all ${
                            activeTab === 'company'
                                ? 'bg-blue-600 text-white'
                                : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                        }`}
                    >
                        <Building2 className="w-4 h-4" />
                        Company Review
                    </button>
                </div>

                {/* Form Rendering */}
                <div className="mt-6">
                    {activeTab === 'recruiter' && <ReportGhostForm />}
                    {activeTab === 'company' && <CompanyReviewForm />}
                </div>

            </div>
        </div>
    );
}
