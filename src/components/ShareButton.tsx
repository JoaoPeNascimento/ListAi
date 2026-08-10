'use client';

import { useState } from 'react';
import { Share2, Check, Copy } from 'lucide-react';

export default function ShareButton({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const url = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: `Confira a nossa lista de presentes: ${title}`,
          url,
        });
        return;
      } catch (err) {
        // User cancelled or share failed, fallback to copy
      }
    }

    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <button
      onClick={handleShare}
      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 font-semibold text-sm transition cursor-pointer shadow-xs"
    >
      {copied ? (
        <>
          <Check className="w-4 h-4 text-emerald-600" />
          <span>Link Copiado!</span>
        </>
      ) : (
        <>
          <Share2 className="w-4 h-4 text-indigo-600" />
          <span>Compartilhar Lista</span>
        </>
      )}
    </button>
  );
}
