'use client';

import { useState } from 'react';
import { deleteListAction } from '@/app/actions/listActions';
import { Trash2, Loader2 } from 'lucide-react';

export default function DeleteListButton({ listId, title }: { listId: string; title: string }) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (confirm(`Deseja realmente remover a lista "${title}" e todos os seus itens? Esta ação não pode ser desfeita.`)) {
      setLoading(true);
      await deleteListAction(listId);
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      title="Excluir Lista"
      className="p-2.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 transition cursor-pointer disabled:opacity-50"
    >
      {loading ? <Loader2 className="w-4 h-4 animate-spin text-rose-500" /> : <Trash2 className="w-4 h-4" />}
    </button>
  );
}
