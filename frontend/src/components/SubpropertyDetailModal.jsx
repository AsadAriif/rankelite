import React, { useState } from 'react';
import { useCompare } from '../context/CompareContext';
import { X, ExternalLink, ShieldCheck, Globe, Copy, Check, Sparkles } from 'lucide-react';

const SubpropertyDetailModal = () => {
  const { subpropertyModalData, closeSubpropertyModal } = useCompare();
  const [copied, setCopied] = useState(false);

  if (!subpropertyModalData || !subpropertyModalData.item) return null;

  const item = subpropertyModalData.item;
  const officialWebsite = item.custom_values?.website || item.website || 'https://www.google.com';

  const handleCopyLink = () => {
    navigator.clipboard.writeText(officialWebsite);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative w-full max-w-lg bg-white p-8 rounded-3xl border-2 border-[#7C3AED]/40 shadow-regal-strong animate-in fade-in zoom-in-95">
        
        {/* Close Button */}
        <button
          onClick={closeSubpropertyModal}
          className="absolute top-6 right-6 p-2 rounded-full bg-purple-50 text-gray-500 hover:text-black border border-purple-200 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Badge */}
        <div className="flex items-center space-x-2 text-xs text-[#059669] uppercase tracking-widest font-black mb-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>VERIFIED TELEMETRY AUDIT</span>
        </div>

        {/* Item Title */}
        <h3 className="font-serif-luxury text-2xl font-black text-[#0A0A12] mb-1">
          {item.title}
        </h3>
        
        <p className="text-xs text-[#7C3AED] uppercase tracking-wider font-extrabold mb-4">
          Subproperty: {subpropertyModal.propertyKey || 'Official Parameter'}
        </p>

        {/* Highlight Box for Subproperty Value */}
        <div className="p-4 rounded-2xl bg-[#F5F3FF] border border-purple-200 mb-6">
          <span className="text-[10px] text-gray-500 uppercase font-bold block mb-1">
            Audited Telemetry Value:
          </span>
          <span className="font-mono text-xl font-black text-[#0A0A12] purple-gradient-text">
            {subpropertyModal.propertyValue || 'Verified Standings'}
          </span>
        </div>

        {/* Main Official Website Link CTA */}
        <div className="p-5 rounded-2xl bg-[#ECFDF5] border border-emerald-300 space-y-3 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-[#064E3B] flex items-center space-x-1.5">
              <Globe className="w-4 h-4 text-[#059669]" />
              <span>Official Main Website</span>
            </span>
            <span className="text-[10px] text-emerald-800 font-extrabold bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
              AUTHENTICATED
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-white text-xs font-mono text-gray-700 border border-emerald-200 truncate">
            {officialWebsite}
          </div>

          <div className="flex items-center space-x-2 pt-1">
            <a
              href={officialWebsite}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-3 rounded-xl btn-emerald-action text-xs uppercase tracking-wider flex items-center justify-center space-x-2 shadow-emerald-glow"
            >
              <span>Visit Official Portal</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <button
              onClick={handleCopyLink}
              className="px-4 py-3 rounded-xl bg-white border border-gray-300 text-gray-700 hover:text-black text-xs font-bold transition-colors flex items-center space-x-1"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700 font-black">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default SubpropertyDetailModal;
