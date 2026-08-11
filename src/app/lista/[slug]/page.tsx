import { getListBySlug } from '@/app/actions/listActions';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import ShareButton from '@/components/ShareButton';
import AddItemModal from '@/components/AddItemModal';
import ItemListContainer from '@/components/ItemListContainer';
import Link from 'next/link';
import { Home, Gift, Heart, ArrowLeft, AlertCircle, UserCheck } from 'lucide-react';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function ListPage({ params }: PageProps) {
  const { slug } = await params;
  const [list, session] = await Promise.all([
    getListBySlug(slug),
    getServerSession(authOptions),
  ]);

  if (!list) {
    return (
      <main className="min-h-screen py-16 px-4 flex flex-col justify-center items-center text-center">
        <div className="glass-card rounded-2xl p-8 sm:p-12 max-w-md w-full border border-slate-200 space-y-4">
          <AlertCircle className="w-14 h-14 text-rose-500 mx-auto" />
          <h2 className="text-2xl font-bold text-slate-800">Lista não encontrada</h2>
          <p className="text-slate-500 text-sm">
            O link que você acessou pode estar incorreto ou a lista foi removida.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl gradient-btn text-white text-sm font-semibold shadow-lg"
          >
            <Home className="w-4 h-4" />
            <span>Voltar ao Início</span>
          </Link>
        </div>
      </main>
    );
  }

  const userId = session?.user?.id || null;
  const isOwner = !!(userId && list.ownerId && userId === list.ownerId);

  const totalItems = list.items.length;
  const reservedItems = list.items.filter((i) => i.reservado).length;
  const progressPercent = totalItems > 0 ? Math.round((reservedItems / totalItems) * 100) : 0;

  return (
    <main className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-8">
      {/* Top Navbar Navigation */}
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition bg-slate-100 px-3.5 py-2 rounded-xl border border-slate-200"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar ao Início</span>
        </Link>

        <ShareButton title={list.title} />
      </div>

      {/* List Header Banner */}
      <div className="glass-card rounded-3xl overflow-hidden border border-slate-200/90 shadow-md">
        {list.bannerUrl && (
          <div className="relative w-full h-80 sm:h-[450px] md:h-[550px] lg:h-[620px] overflow-hidden border-b border-slate-200">
            <img
              src={list.bannerUrl}
              alt={list.title}
              className="w-full h-full object-cover object-center transition-all duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-slate-900/15 to-transparent" />
          </div>
        )}

        <div className="p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-medium border border-indigo-200">
                  <Gift className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Lista Compartilhável</span>
                </div>

                {isOwner && (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-medium border border-emerald-200">
                    <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Você é o criador desta lista</span>
                  </div>
                )}
              </div>

              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                {list.title}
              </h1>

              {list.description && (
                <p className="text-slate-600 text-sm sm:text-base max-w-3xl leading-relaxed">
                  {list.description}
                </p>
              )}
            </div>

            {/* Add Item Modal (Only visible if current user is Owner) */}
            {isOwner && (
              <div className="flex-shrink-0">
                <AddItemModal listId={list.id} listSlug={list.slug} />
              </div>
            )}
          </div>

        {/* Progress Bar Container */}
        {totalItems > 0 && (
          <div className="bg-slate-100/80 p-4 rounded-2xl border border-slate-200 space-y-2">
            <div className="flex items-center justify-between text-xs font-medium text-slate-700">
              <span className="flex items-center gap-1.5">
                <Heart className="w-4 h-4 text-emerald-600" />
                Progresso das Reservas
              </span>
              <span className="text-emerald-700 font-semibold">
                {reservedItems} de {totalItems} itens ({progressPercent}%)
              </span>
            </div>

            <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden p-0.5 border border-slate-300">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500 rounded-full transition-all duration-700 ease-out shadow-xs"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}
      </div>
      </div>

      {/* Main Items Container */}
      <ItemListContainer items={list.items} listSlug={list.slug} isOwner={isOwner} />
    </main>
  );
}
