import React, { useState } from 'react';

export default function ReportGhostForm() {
    const [formData, setFormData] = useState({
        recruiterName: '',
        company: '',
        role: '',
        context: '',
        severity: 1,
        tags: [] as string[],
        has_evidence: false,
    });
    
    // AWS S3 Upload State
    const [uploading, setUploading] = useState(false);
    const [fileUrls, setFileUrls] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            // 1. Get the presigned URL from the backend
            const response = await fetch(`http://127.0.0.1:3000/api/upload-url?filename=${encodeURIComponent(file.name)}&filetype=${encodeURIComponent(file.type)}`, {
                credentials: 'include'
            });
            
            if (!response.ok) throw new Error("Failed to get upload URL");
            const { uploadUrl, fileUrl } = await response.json();

            // 2. Upload directly to S3
            const uploadResponse = await fetch(uploadUrl, {
                method: 'PUT',
                headers: { 'Content-Type': file.type },
                body: file
            });

            if (uploadResponse.ok) {
                setFileUrls(prev => [...prev, fileUrl]);
            } else {
                console.error("AWS S3 Upload Rejected the File");
            }
        } catch (error) {
            console.error("Upload error:", error);
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const payload = {
                ...formData,
                file_urls: fileUrls, // Attach the S3 URLs to the final payload
            };
            
            const response = await fetch('http://127.0.0.1:3000/api/reviews', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(payload)
            });
            
            if (response.ok) {
                alert("Report submitted securely!");
                // Future integration: Redirect to dashboard or reset form
            } else {
                console.error("Failed to submit report");
            }
        } catch (error) {
            console.error("Submit error:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Standard Form Fields (Steps 1-3 abstract) */}
            <div className="p-5 border border-zinc-800 bg-zinc-900/50 rounded-xl space-y-4">
                <h3 className="text-lg font-semibold text-white">Incident Details</h3>
                <input 
                    type="text" 
                    placeholder="Recruiter Name" 
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-slate-300 focus:ring-[#6C47FF] focus:border-[#6C47FF]"
                    value={formData.recruiterName}
                    onChange={(e) => setFormData({ ...formData, recruiterName: e.target.value })}
                />
                <input 
                    type="text" 
                    placeholder="Company" 
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-slate-300 focus:ring-[#6C47FF] focus:border-[#6C47FF]"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                />
            </div>

            {/* Step 4: Evidence & File Upload */}
            <div className="p-5 border border-zinc-800 bg-zinc-900/50 rounded-xl">
                <h3 className="text-lg font-semibold text-white mb-4">Supporting Evidence</h3>
                
                <label className="flex items-center gap-3 p-4 rounded-xl border border-zinc-800 bg-zinc-950 cursor-pointer hover:bg-zinc-900 transition-colors">
                    <input 
                        type="checkbox" 
                        className="w-5 h-5 rounded border-zinc-700 bg-zinc-900 text-[#6C47FF] focus:ring-[#6C47FF] focus:ring-offset-zinc-950"
                        checked={formData.has_evidence}
                        onChange={(e) => setFormData({ ...formData, has_evidence: e.target.checked })}
                    />
                    <span className="text-slate-300 font-medium">I have documentation or proof (emails, screenshots, etc.)</span>
                </label>

                {formData.has_evidence && (
                    <div className="mt-4 p-5 border border-zinc-800 bg-zinc-950 rounded-xl">
                        <label className="block text-sm font-medium text-slate-300 mb-3">
                            Attach Evidence (PDF, PNG, JPG)
                        </label>
                        <input 
                            type="file" 
                            onChange={handleFileUpload} 
                            disabled={uploading}
                            className="block w-full text-sm text-slate-400 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#6C47FF] file:text-white hover:file:bg-[#5835eb] transition-all disabled:opacity-50 cursor-pointer"
                        />
                        
                        {uploading && <p className="text-sm text-emerald-400 mt-3 animate-pulse">Uploading securely to AWS...</p>}
                        
                        {fileUrls.length > 0 && (
                            <div className="mt-4">
                                <p className="text-xs text-slate-400 mb-2 uppercase tracking-wider font-semibold">Attached Files</p>
                                <ul className="text-sm text-slate-300 list-disc pl-5 space-y-1">
                                    {fileUrls.map((url, i) => {
                                        const displayName = url.split('/').pop()?.split('-').slice(1).join('-') || `Attachment ${i + 1}`;
                                        return (
                                            <li key={i} className="truncate text-emerald-400">{displayName}</li>
                                        );
                                    })}
                                </ul>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-[#6C47FF] hover:bg-[#5835eb] text-white font-bold py-4 rounded-xl transition-all disabled:opacity-50"
            >
                {isSubmitting ? "Submitting..." : "Submit Ghost Report"}
            </button>
        </form>
    );
}
