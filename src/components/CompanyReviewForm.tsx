import React, { useState } from 'react';
import { Building2, CheckCircle2, Ghost } from "lucide-react";
import { useNavigate } from "react-router-dom";

const industries = [
    "Technology", "Finance", "Healthcare", "Retail", "Manufacturing", 
    "Consulting", "Marketing", "Education", "Legal", "Other"
];

const interviewStages = [
    { value: "APPLICATION_ONLY", label: "Application Only (Never heard back)" },
    { value: "SCREENING", label: "Screening/Phone Screen" },
    { value: "FIRST_INTERVIEW", label: "First Interview" },
    { value: "MULTIPLE_ROUNDS", label: "Multiple Interview Rounds" },
    { value: "FINAL_ROUND", label: "Final Round" },
    { value: "OFFER_STAGE", label: "Offer/Negotiation Stage" }
];

export default function CompanyReviewForm() {
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [guidelinesAccepted, setGuidelinesAccepted] = useState(false);
    const [tags, setTags] = useState<string[]>([]);
    const [tagInput, setTagInput] = useState("");
    
    const [formData, setFormData] = useState({
        company_name: "",
        position_applied_for: "",
        location: "",
        industry: "",
        interview_stages_completed: "",
        time_to_ghosting: "",
        overall_rating: 3,
        spec_honesty_rating: 3,
        signal_clarity_rating: 3,
        hiring_manager_pulse_rating: 3,
        vibe_integrity_rating: 3,
        closure_respect_rating: 3,
        review_text: "",
        pros: "",
        cons: "",
        would_apply_again: null as boolean | null,
        is_anonymous: false
    });

    const handleChange = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const addTag = () => {
        const tag = tagInput.trim().toLowerCase();
        if (tag && !tags.includes(tag) && tags.length < 5) {
            setTags(prev => [...prev, tag]);
            setTagInput("");
        }
    };

    const removeTag = (tagToRemove: string) => {
        setTags(prev => prev.filter(t => t !== tagToRemove));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!formData.company_name || !formData.review_text || !formData.overall_rating) {
            alert('Please fill in all required fields (Company Name, Overall Rating, and Review Text)');
            return;
        }

        setIsSubmitting(true);

        try {
            const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
            const response = await fetch(`${apiBaseUrl}/api/company-reviews`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include', // Includes the JWT cookie for authenticateJWT middleware
                body: JSON.stringify({
                    ...formData,
                    tags,
                    overall_rating: Number(formData.overall_rating),
                    spec_honesty_rating: Number(formData.spec_honesty_rating),
                    signal_clarity_rating: Number(formData.signal_clarity_rating),
                    hiring_manager_pulse_rating: Number(formData.hiring_manager_pulse_rating),
                    vibe_integrity_rating: Number(formData.vibe_integrity_rating),
                    closure_respect_rating: Number(formData.closure_respect_rating)
                })
            });

            if (response.ok) {
                setIsSuccess(true);
                setTimeout(() => {
                    navigate('/Profile');
                }, 2000);
            } else {
                const errorData = await response.json();
                alert(`Submission failed: ${errorData.message || 'Unknown error'}`);
            }
        } catch (error) {
            console.error("Submission error:", error);
            alert('A network error occurred while submitting the review.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-lg">
                <div className="w-16 h-16 bg-emerald-900/50 border border-emerald-500/50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Company Review Submitted!</h2>
                <p className="text-slate-400">Thank you for helping the community. Redirecting...</p>
            </div>
        );
    }

    return (
        <div className="p-8 bg-slate-900 border border-slate-800 rounded-lg shadow-xl">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-blue-900/30 rounded-xl">
                    <Building2 className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-white">Review a Company</h2>
                    <p className="text-sm text-slate-400">Share your interview and hiring experience</p>
                </div>
            </div>

            {/* Anonymous Option */}
            <div className="flex items-center gap-3 p-4 bg-slate-950 border border-slate-800 rounded-xl mb-8">
                <input
                    type="checkbox"
                    id="is_anonymous"
                    checked={formData.is_anonymous}
                    onChange={(e) => handleChange("is_anonymous", e.target.checked)}
                    className="w-5 h-5 accent-blue-600 rounded cursor-pointer"
                />
                <label htmlFor="is_anonymous" className="flex items-center gap-2 cursor-pointer flex-1">
                    <Building2 className="w-5 h-5 text-slate-500" />
                    <div>
                        <span className="font-medium text-white">Post anonymously?</span>
                        <p className="text-xs text-slate-500">This will hide your Ghoasted name from this review</p>
                    </div>
                </label>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">

                {/* Company Name + Position */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider">Company Name *</label>
                        <input
                            placeholder="e.g., Tech Corp"
                            value={formData.company_name}
                            onChange={(e) => handleChange("company_name", e.target.value)}
                            required
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider">Position Applied For</label>
                        <input
                            placeholder="e.g., Software Engineer"
                            value={formData.position_applied_for}
                            onChange={(e) => handleChange("position_applied_for", e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                        />
                    </div>
                </div>

                {/* Location + Industry */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider">Location</label>
                        <input
                            placeholder="e.g., San Francisco, CA"
                            value={formData.location}
                            onChange={(e) => handleChange("location", e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider">Industry</label>
                        <select
                            value={formData.industry}
                            onChange={(e) => handleChange("industry", e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                        >
                            <option value="">Select industry...</option>
                            {industries.map(i => <option key={i} value={i}>{i}</option>)}
                        </select>
                    </div>
                </div>

                {/* Interview Stage + Time to Ghosting */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider">Interview Stage Reached</label>
                        <select
                            value={formData.interview_stages_completed}
                            onChange={(e) => handleChange("interview_stages_completed", e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                        >
                            <option value="">Select stage...</option>
                            {interviewStages.map(s => (
                                <option key={s.value} value={s.value}>{s.label}</option>
                            ))}
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider">Time to Ghosting</label>
                        <input
                            placeholder="e.g., Ghosted after 2 weeks"
                            value={formData.time_to_ghosting}
                            onChange={(e) => handleChange("time_to_ghosting", e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                        />
                    </div>
                </div>

                {/* Overall Rating */}
                <div className="space-y-2 p-5 bg-slate-950 border border-slate-800 rounded-xl">
                    <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider">Overall Rating *</label>
                    <div className="flex items-center gap-3 mt-2">
                        {[1,2,3,4,5].map(num => (
                            <button
                                key={num}
                                type="button"
                                onClick={() => handleChange("overall_rating", num)}
                                className={`p-2 transition-all transform hover:scale-110 ${formData.overall_rating >= num ? 'text-blue-500' : 'text-slate-700 hover:text-slate-500'}`}
                            >
                                <Ghost size={36} fill={formData.overall_rating >= num ? "currentColor" : "none"} />
                            </button>
                        ))}
                    </div>
                </div>

                {/* Sub-ratings */}
                <div className="space-y-6 p-5 bg-slate-950 border border-slate-800 rounded-xl">
                    <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">Dimension Ratings</label>

                    {[
                        { field: "spec_honesty_rating", label: "📋 Spec Honesty", desc: "Accuracy of job description vs actual role", low: "Total Bait and Switch", high: "Exactly as advertised" },
                        { field: "signal_clarity_rating", label: "📡 Signal Clarity", desc: "Communication about interview stages", low: "Flying blind / No updates", high: "Professional clear timeline" },
                        { field: "hiring_manager_pulse_rating", label: "👔 Hiring Manager Pulse", desc: "Engagement of person you'd work for", low: "Disinterested / No-show", high: "Prepared and inspiring" },
                        { field: "vibe_integrity_rating", label: "✨ Vibe Integrity", desc: "Culture authenticity vs marketing", low: "Toxic / Fake", high: "Genuine / Matches brand" },
                        { field: "closure_respect_rating", label: "🚪 Closure Respect", desc: "How they handled the final decision", low: "Left in the Void (Ghoasted)", high: "Timely respectful conclusion" },
                    ].map(({ field, label, desc, low, high }) => (
                        <div key={field} className="space-y-3 pb-6 border-b border-slate-800/50 last:border-0 last:pb-0">
                            <div>
                                <p className="text-sm font-semibold text-white">{label}</p>
                                <p className="text-xs text-slate-500 mt-0.5">{desc}</p>
                            </div>
                            <div className="flex items-center gap-2">
                                {[1,2,3,4,5].map(num => (
                                    <button
                                        key={num}
                                        type="button"
                                        onClick={() => handleChange(field, num)}
                                        className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-200 ${
                                            // @ts-expect-error dynamic field access
                                            formData[field] >= num 
                                                ? 'bg-blue-600/20 text-blue-400 border border-blue-500/50 shadow-[0_0_15px_rgba(37,99,235,0.15)]' 
                                                : 'bg-slate-900 border border-slate-800 text-slate-600 hover:bg-slate-800 hover:border-slate-700'
                                        }`}
                                    >
                                        <Ghost className="w-5 h-5" fill={
                                            // @ts-expect-error
                                            formData[field] >= num ? "currentColor" : "none"
                                        }/>
                                    </button>
                                ))}
                            </div>
                            <div className="h-4">
                                {
                                // @ts-expect-error
                                formData[field] === 1 ? <p className="text-xs text-amber-500/90 font-medium">⚠️ {low}</p> : 
                                // @ts-expect-error
                                formData[field] === 5 ? <p className="text-xs text-emerald-500/90 font-medium">✅ {high}</p> : null
                                }
                            </div>
                        </div>
                    ))}
                </div>

                {/* Review Text */}
                <div className="space-y-2">
                    <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider">Your Experience *</label>
                    <textarea
                        placeholder="Describe your interview experience, what happened, how they treated candidates..."
                        value={formData.review_text}
                        onChange={(e) => handleChange("review_text", e.target.value)}
                        required
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg p-4 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none min-h-[160px] resize-y"
                    />
                </div>

                {/* Pros + Cons */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider">Pros (Optional)</label>
                        <textarea
                            placeholder="What did they do well?"
                            value={formData.pros}
                            onChange={(e) => handleChange("pros", e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none min-h-[100px] resize-none"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider">Cons (Optional)</label>
                        <textarea
                            placeholder="What could they improve?"
                            value={formData.cons}
                            onChange={(e) => handleChange("cons", e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none min-h-[100px] resize-none"
                        />
                    </div>
                </div>

                {/* Would Apply Again - Radio Buttons */}
                <div className="p-5 bg-slate-950 border border-slate-800 rounded-xl">
                    <label className="block text-sm font-semibold text-white mb-4">Would you ever apply to this company again, or has this experience permanently damaged their brand in your eyes?</label>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8">
                        <label className="flex items-center gap-3 cursor-pointer group">
                            <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${formData.would_apply_again === true ? 'border-blue-500' : 'border-slate-600 group-hover:border-slate-400'}`}>
                                {formData.would_apply_again === true && <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />}
                            </div>
                            <input
                                type="radio"
                                name="would_apply_again"
                                checked={formData.would_apply_again === true}
                                onChange={() => handleChange("would_apply_again", true)}
                                className="hidden"
                            />
                            <span className={`text-sm ${formData.would_apply_again === true ? 'text-white font-medium' : 'text-slate-400'}`}>Yes I'd apply again</span>
                        </label>
                        
                        <label className="flex items-center gap-3 cursor-pointer group">
                            <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${formData.would_apply_again === false ? 'border-blue-500' : 'border-slate-600 group-hover:border-slate-400'}`}>
                                {formData.would_apply_again === false && <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />}
                            </div>
                            <input
                                type="radio"
                                name="would_apply_again"
                                checked={formData.would_apply_again === false}
                                onChange={() => handleChange("would_apply_again", false)}
                                className="hidden"
                            />
                            <span className={`text-sm ${formData.would_apply_again === false ? 'text-white font-medium' : 'text-slate-400'}`}>No brand permanently damaged</span>
                        </label>
                    </div>
                </div>

                {/* Tags */}
                <div className="space-y-4 p-5 bg-slate-950 border border-slate-800 rounded-xl">
                    <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider">Tags (Max 5)</label>
                    <div className="flex flex-wrap gap-2">
                        {['slow-process', 'disorganized', 'great-benefits', 'poor-communication', 'transparent', 'long-hours', 'competitive-salary', 'red-flags', 'unprofessional', 'excellent-culture', 'toxic-environment', 'growth-opportunities'].map(suggestion => (
                            <button
                                key={suggestion}
                                type="button"
                                onClick={() => {
                                    if (!tags.includes(suggestion) && tags.length < 5) {
                                        setTags(prev => [...prev, suggestion]);
                                    }
                                }}
                                disabled={tags.includes(suggestion) || tags.length >= 5}
                                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                                    tags.includes(suggestion)
                                        ? 'bg-blue-600/20 border-blue-500/50 text-blue-400 cursor-not-allowed'
                                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-600 hover:text-slate-200'
                                }`}
                            >
                                {tags.includes(suggestion) && '✓ '}{suggestion}
                            </button>
                        ))}
                    </div>
                    <div className="flex gap-2 pt-4 border-t border-slate-800/50 mt-2">
                        <input
                            placeholder="Type custom tag and hit Enter..."
                            value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    addTag();
                                }
                            }}
                            className="flex-1 bg-slate-900 border border-slate-800 rounded-lg p-3 text-white text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                        />
                    </div>
                    {tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 pt-2">
                            {tags.map(t => (
                                <span
                                    key={t}
                                    onClick={() => removeTag(t)}
                                    className="group bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 cursor-pointer hover:bg-red-500 transition-colors"
                                >
                                    {t} 
                                    <span className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center text-[10px] font-bold group-hover:bg-white/40">×</span>
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                {/* Community Guidelines Acceptance */}
                <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl mt-8">
                    <label className="flex items-start gap-3 cursor-pointer group">
                        <input
                            type="checkbox"
                            checked={guidelinesAccepted}
                            onChange={(e) => setGuidelinesAccepted(e.target.checked)}
                            className="w-5 h-5 mt-0.5 rounded border-slate-700 text-blue-600 focus:ring-blue-500 bg-slate-900 cursor-pointer"
                        />
                        <span className="text-sm text-slate-300 leading-relaxed group-hover:text-slate-200 transition-colors">
                            I have read and agree to the Community Guidelines and confirm this review is truthful to the best of my knowledge.
                        </span>
                    </label>
                </div>

                {/* Submit */}
                <button
                    type="submit"
                    disabled={isSubmitting || !guidelinesAccepted}
                    className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-4 rounded-xl transition-all disabled:opacity-50 disabled:hover:bg-blue-600 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-base shadow-[0_0_20px_rgba(37,99,235,0.2)] hover:shadow-[0_0_25px_rgba(37,99,235,0.3)] disabled:shadow-none mt-4"
                >
                    {isSubmitting ? (
                        <>Processing Submission...</>
                    ) : (
                        <><Building2 className="w-5 h-5" /> Submit Company Review</>
                    )}
                </button>
            </form>
        </div>
    );
}
