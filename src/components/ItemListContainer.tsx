'use client';

import { useState } from 'react';
import ReserveModal from './ReserveModal';
import { deleteItemAction } from '@/app/actions/itemActions';
import { ExternalLink, Trash2, Tag, Gift, CheckCircle, Package } from 'lucide-react';

import { Item } from '@/models';

interface ItemListContainerProps {
  items: Item[];
  listSlug: string;
  isOwner: boolean;
}

export default function ItemListContainer({ items, listSlug, isOwner }: ItemListContainerProps) {
  const [filter, setFilter] = useState<'all' | 'available' | 'reserved'>('all');

  const filteredItems = items.filter((item) => {
    if (filter === 'available') return !item.reservado;
    if (filter === 'reserved') return item.reservado;
    return true;
  });

  const handleDelete = async (itemId: string, title: string) => {
    if (confirm(`Deseja realmente remover "${title}" da lista?`)) {
      await deleteItemAction(itemId, listSlug);
    }
  };

  const formatMoney = (val: number | null) => {
    if (val === null || isNaN(val)) return null;
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  return (
    <div className="space-y-6">
      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div className="flex items-center gap-2 bg-slate-100/90 p-1.5 rounded-xl border border-slate-200">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition ${
              filter === 'all'
                ? 'bg-indigo-100 text-indigo-700 border border-indigo-300 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Todos ({items.length})
          </button>

          <button
            onClick={() => setFilter('available')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition ${
              filter === 'available'
                ? 'bg-indigo-100 text-indigo-700 border border-indigo-300 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Disponíveis ({items.filter((i) => !i.reservado).length})
          </button>

          <button
            onClick={() => setFilter('reserved')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition ${
              filter === 'reserved'
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Reservados ({items.filter((i) => i.reservado).length})
          </button>
        </div>
      </div>

      {/* Items Grid */}
      {filteredItems.length === 0 ? (
        <div className="glass-card rounded-2xl p-12 text-center space-y-3 border border-slate-200">
          <Package className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="text-lg font-semibold text-slate-800">Nenhum item encontrado</h3>
          <p className="text-sm text-slate-500 max-w-sm mx-auto">
            {filter === 'all'
              ? isOwner
                ? 'Sua lista ainda não possui itens cadastrados. Clique em "Adicionar Item" acima para começar!'
                : 'Esta lista ainda não possui itens cadastrados pelo organizador.'
              : filter === 'available'
              ? 'Todos os itens desta lista já foram reservados! 🎉'
              : 'Nenhum item foi reservado ainda.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className={`glass-card rounded-2xl overflow-hidden border transition-all duration-300 flex flex-col justify-between ${
                item.reservado
                  ? 'border-emerald-300/80 bg-emerald-50/40 opacity-90'
                  : 'border-slate-200/90 hover:border-indigo-300 hover:shadow-xl hover:shadow-indigo-500/10'
              }`}
            >
              <div>
                {/* Image Container */}
                <div className="relative w-full h-48 bg-slate-100 overflow-hidden flex items-center justify-center border-b border-slate-200">
                  {item.imagem ? (
                    /* eslint-disable-next-img-element */
                    <img
                      src={item.imagem}
                      alt={item.titulo}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                  ) : (
                    <div className="text-center p-4 text-slate-400 space-y-1">
                      <Gift className="w-10 h-10 mx-auto opacity-50" />
                      <span className="text-xs">Sem foto</span>
                    </div>
                  )}

                  {/* Status Badge */}
                  {item.reservado && (
                    <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-emerald-100/95 border border-emerald-300 text-emerald-800 text-xs font-semibold flex items-center gap-1.5 shadow-md backdrop-blur-md">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Reservado</span>
                    </div>
                  )}

                  {/* Delete Button (Visible ONLY to Owner) */}
                  {isOwner && (
                    <button
                      onClick={() => handleDelete(item.id, item.titulo)}
                      title="Excluir item"
                      className="absolute top-3 right-3 p-2 rounded-full bg-white/90 text-slate-400 hover:text-rose-600 hover:bg-white transition border border-slate-200 backdrop-blur-md cursor-pointer shadow-xs"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Content Details */}
                <div className="p-5 space-y-3">
                  <h4 className="font-bold text-slate-800 text-lg line-clamp-2 leading-snug">
                    {item.titulo}
                  </h4>

                  <div className="flex items-center justify-between gap-2 pt-1">
                    {item.valorEstimado !== null && (
                      <span className="inline-flex items-center gap-1 text-indigo-600 font-semibold text-sm">
                        <Tag className="w-3.5 h-3.5 text-indigo-500" />
                        {formatMoney(item.valorEstimado)}
                      </span>
                    )}

                    {item.link && (
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-indigo-600 transition underline underline-offset-4"
                      >
                        <span>Ver Loja</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Bottom Action Footer */}
              <div className="p-5 pt-0">
                <ReserveModal
                  itemId={item.id}
                  itemTitle={item.titulo}
                  listSlug={listSlug}
                  isReserved={item.reservado}
                  reservedBy={item.reservadoPor}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
