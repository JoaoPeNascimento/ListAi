'use client';

import { useState } from 'react';
import { createListAction } from '@/app/actions/listActions';
import { Sparkles, ShieldCheck, Upload, Link as LinkIcon, Image as ImageIcon, Loader2 } from 'lucide-react';

interface CreateListFormProps {
  userName: string;
}

export default function CreateListForm({ userName }: CreateListFormProps) {
  const [loading, setLoading] = useState(false);
  const [imageTab, setImageTab] = useState<'url' | 'upload'>('url');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPreviewUrl(e.target.value || null);
  };

  const handleSubmit = async () => {
    setLoading(true);
  };

  return (
    <form action={createListAction} onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-slate-700 mb-2">
          Título da Lista <span className="text-indigo-600">*</span>
        </label>
        <input
          type="text"
          id="title"
          name="title"
          required
          placeholder="Ex: Enxoval da Casa Nova de João e Maria"
          className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-2">
          Descrição ou Mensagem aos Convidados (Opcional)
        </label>
        <textarea
          id="description"
          name="description"
          rows={3}
          placeholder="Ex: Olá família e amigos! Preparamos esta lista com carinho para nossa nova fase. Fiquem à vontade!"
          className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition resize-none"
        />
      </div>

      {/* Banner Selection (URL or File Upload) */}
      <div className="space-y-2.5">
        <label className="block text-sm font-medium text-slate-700">
          <span className="flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-indigo-600" />
            <span>Imagem do Banner de Topo (Opcional)</span>
          </span>
        </label>

        <div className="flex gap-2 border-b border-slate-200 pb-2">
          <button
            type="button"
            onClick={() => setImageTab('url')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
              imageTab === 'url'
                ? 'bg-indigo-50 text-indigo-700 border border-indigo-200 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <LinkIcon className="w-3.5 h-3.5" /> Link da Foto (URL)
          </button>
          <button
            type="button"
            onClick={() => setImageTab('upload')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
              imageTab === 'upload'
                ? 'bg-indigo-50 text-indigo-700 border border-indigo-200 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Upload className="w-3.5 h-3.5" /> Enviar Arquivo
          </button>
        </div>

        {imageTab === 'url' ? (
          <div>
            <input
              type="url"
              id="bannerUrl"
              name="bannerUrl"
              onChange={handleUrlChange}
              placeholder="Cole o link da imagem (ex: https://...jpg)"
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
            />
          </div>
        ) : (
          <div>
            <input
              type="file"
              id="bannerFile"
              name="bannerFile"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full text-xs text-slate-600 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer border border-slate-200 rounded-xl p-1 bg-slate-50"
            />
          </div>
        )}

        {/* Live Preview */}
        {previewUrl && (
          <div className="mt-3 relative w-full h-64 sm:h-80 rounded-xl overflow-hidden border border-slate-200 bg-slate-100 flex items-center justify-center">
            {/* eslint-disable-next-img-element */}
            <img
              src={previewUrl}
              alt="Pré-visualização do Banner"
              className="w-full h-full object-cover object-center"
              onError={() => setPreviewUrl(null)}
            />
            <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded-md bg-slate-900/60 text-white text-[10px] font-medium backdrop-blur-xs">
              Pré-visualização do Banner
            </div>
          </div>
        )}
      </div>

      <div className="p-3.5 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-800 text-xs flex items-center gap-2.5">
        <ShieldCheck className="w-4 h-4 text-indigo-600 flex-shrink-0" />
        <span>
          Criando como <strong className="text-slate-900 font-bold">{userName}</strong>. Apenas você terá permissão para adicionar e gerenciar itens nesta lista.
        </span>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-4 px-6 rounded-xl font-semibold text-white gradient-btn flex items-center justify-center gap-2 text-lg shadow-lg hover:shadow-indigo-500/25 transition cursor-pointer disabled:opacity-75"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Criando Lista...</span>
          </>
        ) : (
          <>
            <Sparkles className="w-5 h-5" />
            <span>Criar Minha Lista Agora</span>
          </>
        )}
      </button>
    </form>
  );
}
