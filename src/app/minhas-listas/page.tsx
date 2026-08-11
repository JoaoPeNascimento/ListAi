import { getUserLists } from '@/app/actions/listActions';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import DeleteListButton from './DeleteListButton';
import ShareButton from '@/components/ShareButton';
import { Gift, Plus, Heart, ExternalLink, Calendar, ListOrdered, Sparkles } from 'lucide-react';

export default async function MinhasListasPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect('/login');
  }

  const lists = await getUserLists();

  return (
    <main className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold border border-indigo-200 mb-1">
            <ListOrdered className="w-3.5 h-3.5 text-indigo-600" />
            <span>Gerenciador de Listas</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Minhas Listas de Presentes
          </h1>
          <p className="text-slate-500 text-sm">
            Gerencie suas listas ativas, acompanhe as reservas e crie novos enxovais.
          </p>
        </div>

        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl gradient-btn text-white text-sm font-semibold shadow-md hover:shadow-indigo-500/25 transition cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Criar Nova Lista</span>
        </Link>
      </div>

      {/* Lists Grid or Empty State */}
      {lists.length === 0 ? (
        <div className="glass-card rounded-3xl p-12 text-center space-y-4 border border-slate-200 max-w-lg mx-auto my-12">
          <div className="w-16 h-16 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto border border-indigo-200">
            <Gift className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h3 className="text-xl font-bold text-slate-800">Nenhuma lista criada ainda</h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              Você ainda não tem listas cadastradas. Crie sua primeira lista de casa nova ou casamento agora mesmo!
            </p>
          </div>

          <div className="pt-2">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl gradient-btn text-white text-sm font-semibold shadow-lg"
            >
              <Sparkles className="w-4 h-4" />
              <span>Criar Minha Primeira Lista</span>
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {lists.map((list) => {
            const totalItems = list.items.length;
            const reservedItems = list.items.filter((i) => i.reservado).length;
            const progressPercent = totalItems > 0 ? Math.round((reservedItems / totalItems) * 100) : 0;
            const formattedDate = new Date(list.createdAt).toLocaleDateString('pt-BR', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            });

            return (
              <div
                key={list.id}
                className="glass-card rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md hover:border-indigo-300 transition flex flex-col justify-between overflow-hidden"
              >
                {list.bannerUrl && (
                  <div className="relative w-full h-52 sm:h-60 overflow-hidden border-b border-slate-200">
                    <img
                      src={list.bannerUrl}
                      alt={list.title}
                      className="w-full h-full object-cover object-center"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent" />
                  </div>
                )}

                <div className="p-6 space-y-5 flex-1 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="font-bold text-slate-900 text-lg line-clamp-1 leading-snug">
                        {list.title}
                      </h3>
                      <DeleteListButton listId={list.id} title={list.title} />
                    </div>

                    {list.description ? (
                      <p className="text-slate-600 text-xs line-clamp-2 leading-relaxed">
                        {list.description}
                      </p>
                    ) : (
                      <p className="text-slate-400 text-xs italic">Sem descrição fornecida</p>
                    )}

                    {/* Stats & Progress */}
                    <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2">
                      <div className="flex items-center justify-between text-xs font-medium text-slate-700">
                        <span className="flex items-center gap-1.5 text-slate-600">
                          <Heart className="w-3.5 h-3.5 text-emerald-600" />
                          Reservas
                        </span>
                        <span className="text-emerald-700 font-semibold">
                          {reservedItems} / {totalItems} itens ({progressPercent}%)
                        </span>
                      </div>

                      <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden p-0.5 border border-slate-300">
                        <div
                          className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500 rounded-full transition-all duration-500"
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Footer Metadata & Actions */}
                  <div className="space-y-3 pt-2 border-t border-slate-100">
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {formattedDate}
                      </span>
                      <span className="text-indigo-600 font-medium text-[11px]">
                        /{list.slug}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <Link
                        href={`/lista/${list.slug}`}
                        className="flex-1 py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
                      >
                        <span>Abrir Lista</span>
                        <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                      </Link>

                      <ShareButton title={list.title} />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
