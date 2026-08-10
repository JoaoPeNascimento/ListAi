'use client';

import { useState } from 'react';
import { reserveItemAction, cancelReservationAction } from '@/app/actions/itemActions';
import { HeartHandshake, X, Loader2, CheckCircle2, User, RotateCcw } from 'lucide-react';

interface ReserveModalProps {
  itemId: string;
  itemTitle: string;
  listSlug: string;
  isReserved: boolean;
  reservedBy: string | null;
}

export default function ReserveModal({
  itemId,
  itemTitle,
  listSlug,
  isReserved,
  reservedBy,
}: ReserveModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [guestName, setGuestName] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleReserve = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim()) return;

    setLoading(true);
    setErrorMsg(null);

    const res = await reserveItemAction(itemId, guestName, listSlug);
    setLoading(false);

    if (res?.error) {
      setErrorMsg(res.error);
    } else {
      setIsOpen(false);
      setGuestName('');
    }
  };

  const handleCancelReservation = async () => {
    if (!confirm('Deseja realmente cancelar a reserva deste item?')) return;

    setLoading(true);
    setErrorMsg(null);

    const res = await cancelReservationAction(itemId, listSlug);
    setLoading(false);

    if (res?.error) {
      setErrorMsg(res.error);
    } else {
      setIsOpen(false);
    }
  };

  return (
    <>
      {isReserved ? (
        <button
          onClick={() => setIsOpen(true)}
          className="w-full py-2.5 px-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 font-medium text-xs flex items-center justify-center gap-2 hover:bg-emerald-100 transition cursor-pointer"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Reservado por {reservedBy || 'alguém'}</span>
        </button>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="w-full py-2.5 px-4 rounded-xl gradient-btn text-white font-medium text-xs flex items-center justify-center gap-2 shadow-md hover:shadow-indigo-500/25 transition cursor-pointer"
        >
          <HeartHandshake className="w-4 h-4" />
          <span>Quero Presentear / Reservar</span>
        </button>
      )}

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md glass-modal rounded-2xl p-6 shadow-2xl border border-slate-200 relative">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {isReserved ? (
              <div className="space-y-4 text-center">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-300">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-800">{itemTitle}</h3>
                  <p className="text-sm text-slate-600 mt-1">
                    Este presente foi reservado por <span className="font-semibold text-emerald-700">{reservedBy}</span>.
                  </p>
                </div>

                {errorMsg && (
                  <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                    {errorMsg}
                  </div>
                )}

                <div className="pt-2 flex flex-col gap-2">
                  <button
                    onClick={handleCancelReservation}
                    disabled={loading}
                    className="w-full py-2.5 px-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center justify-center gap-2 hover:bg-rose-100 transition cursor-pointer"
                  >
                    {loading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Desfazer esta Reserva</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleReserve} className="space-y-4">
                <div className="text-center space-y-1">
                  <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-2 border border-indigo-200">
                    <HeartHandshake className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-800">Reservar Presente</h3>
                  <p className="text-xs text-slate-500">
                    Você está reservando <span className="text-indigo-600 font-semibold">{itemTitle}</span>.
                  </p>
                </div>

                {errorMsg && (
                  <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                    {errorMsg}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Seu Nome Completo
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      required
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      placeholder="Ex: Tia Cláudia / Carlos Eduardo"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading || !guestName.trim()}
                    className="w-full py-3 px-4 rounded-xl font-semibold text-white gradient-btn flex items-center justify-center gap-2 text-sm shadow-md disabled:opacity-50 cursor-pointer"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Confirmando...</span>
                      </>
                    ) : (
                      <span>Confirmar Reserva</span>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
