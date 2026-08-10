'use client';

import { useState } from 'react';
import { addItemAction } from '@/app/actions/itemActions';
import { Plus, X, Upload, Link as LinkIcon, Image as ImageIcon, DollarSign, Tag, Loader2 } from 'lucide-react';

interface AddItemModalProps {
  listId: string;
  listSlug: string;
}

export default function AddItemModal({ listId, listSlug }: AddItemModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [imageTab, setImageTab] = useState<'url' | 'upload'>('url');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPreviewUrl(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    const formData = new FormData(e.currentTarget);
    formData.append('listId', listId);
    formData.append('listSlug', listSlug);

    const res = await addItemAction(formData);

    setLoading(false);

    if (res?.error) {
      setErrorMsg(res.error);
    } else {
      setIsOpen(false);
      setPreviewUrl(null);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl gradient-btn text-white font-medium text-sm shadow-lg shadow-indigo-500/20 cursor-pointer"
      >
        <Plus className="w-4 h-4" />
        <span>Adicionar Item</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg glass-modal rounded-2xl p-6 sm:p-8 shadow-2xl border border-slate-200 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>

            <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              <Plus className="w-6 h-6 text-indigo-600" />
              Adicionar Novo Item
            </h3>

            {errorMsg && (
              <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-sm">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Título do Item <span className="text-indigo-600">*</span>
                </label>
                <div className="relative">
                  <Tag className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    name="titulo"
                    required
                    placeholder="Ex: Fritadeira Air Fryer 4L"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Valor Estimado (R$)
                </label>
                <div className="relative">
                  <DollarSign className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    name="valorEstimado"
                    placeholder="Ex: 350,00"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Link da Loja / Onde Comprar (Opcional)
                </label>
                <div className="relative">
                  <LinkIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="url"
                    name="link"
                    placeholder="Ex: https://www.magazinevoce.com.br/..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
                  />
                </div>
              </div>

              {/* Image Input Options Tabs */}
              <div className="space-y-2 pt-2">
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Foto / Imagem do Item
                </label>
                
                <div className="flex gap-2 border-b border-slate-200 pb-2 mb-3">
                  <button
                    type="button"
                    onClick={() => setImageTab('url')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                      imageTab === 'url'
                        ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <LinkIcon className="w-3.5 h-3.5" /> Link da Foto
                  </button>
                  <button
                    type="button"
                    onClick={() => setImageTab('upload')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                      imageTab === 'upload'
                        ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <Upload className="w-3.5 h-3.5" /> Enviar Arquivo
                  </button>
                </div>

                {imageTab === 'url' ? (
                  <div className="relative">
                    <ImageIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="url"
                      name="imageUrl"
                      onChange={handleUrlChange}
                      placeholder="Cole o link direto da imagem (ex: https://...jpg)"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
                    />
                  </div>
                ) : (
                  <input
                    type="file"
                    name="imageFile"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="w-full text-xs text-slate-600 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer"
                  />
                )}

                {previewUrl && (
                  <div className="mt-3 relative w-full h-32 rounded-xl overflow-hidden border border-slate-200 bg-slate-100 flex items-center justify-center">
                    {/* eslint-disable-next-img-element */}
                    <img
                      src={previewUrl}
                      alt="Pré-visualização"
                      className="w-full h-full object-cover"
                      onError={() => setPreviewUrl(null)}
                    />
                  </div>
                )}
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 rounded-xl font-semibold text-white gradient-btn flex items-center justify-center gap-2 text-sm shadow-md disabled:opacity-50 cursor-pointer"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Salvando...</span>
                    </>
                  ) : (
                    <span>Adicionar Item à Lista</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
