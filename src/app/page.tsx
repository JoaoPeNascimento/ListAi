import { getUserLists } from './actions/listActions';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import Link from 'next/link';
import CreateListForm from '@/components/CreateListForm';
import { Gift, HeartHandshake, Share2, Sparkles, ShieldCheck, LogIn, UserPlus, ListOrdered, ArrowRight } from 'lucide-react';

export default async function HomePage() {
  const session = await getServerSession(authOptions);
  const userLists = session?.user ? await getUserLists() : [];

  return (
    <main className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto flex flex-col justify-center items-center">
      {/* Header Banner */}
      <div className="text-center mb-10 space-y-4">
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900">
          Crie, Compartilhe e Gerencie sua <br />
          <span className="gradient-text">Lista de Presentes &amp; Casa Nova</span>
        </h1>

        <p className="text-slate-600 text-lg sm:text-xl max-w-2xl mx-auto font-normal leading-relaxed">
          Monte sua lista de itens desejados, compartilhe o link direto via WhatsApp e receba os presentes sem o risco de repetidos!
        </p>
      </div>

      {/* User Recent Lists Section (If Logged In and has lists) */}
      {session?.user && userLists.length > 0 && (
        <div className="w-full max-w-xl mb-8 glass-card rounded-2xl p-6 shadow-md border border-indigo-200/80 bg-indigo-50/40">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <ListOrdered className="w-5 h-5 text-indigo-600" />
              Suas Listas Recentes ({userLists.length})
            </h3>
            <Link
              href="/minhas-listas"
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition"
            >
              <span>Ver todas</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-2.5">
            {userLists.slice(0, 3).map((list) => {
              const reservedCount = list.items.filter((i) => i.reservado).length;
              return (
                <div
                  key={list.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-white border border-slate-200 shadow-xs hover:border-indigo-300 transition gap-3"
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    {list.bannerUrl ? (
                      <img
                        src={list.bannerUrl}
                        alt={list.title}
                        className="w-10 h-10 rounded-lg object-cover flex-shrink-0 border border-slate-200"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center flex-shrink-0">
                        <Gift className="w-5 h-5" />
                      </div>
                    )}
                    <div className="truncate">
                      <h4 className="font-semibold text-slate-800 text-sm truncate">{list.title}</h4>
                      <span className="text-xs text-slate-500 block">
                        {reservedCount} de {list.items.length} presentes reservados
                      </span>
                    </div>
                  </div>

                  <Link
                    href={`/lista/${list.slug}`}
                    className="px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 text-xs font-semibold hover:bg-indigo-100 transition flex-shrink-0"
                  >
                    Abrir
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Form Card or Login Prompt */}
      <div className="w-full max-w-xl glass-card rounded-2xl p-6 sm:p-8 shadow-xl relative border border-slate-200/90">
        <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
          <Gift className="w-7 h-7 text-indigo-600" />
          Criar Nova Lista
        </h2>

        {session?.user ? (
          <CreateListForm userName={session.user.name || session.user.email || 'Usuário'} />
        ) : (
          <div className="text-center py-6 space-y-6">
            <div className="w-16 h-16 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto border border-indigo-200">
              <ShieldCheck className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-bold text-slate-800">Faça Login para Criar Listas</h3>
              <p className="text-sm text-slate-500 max-w-md mx-auto">
                Para garantir a segurança da sua lista e que apenas você possa adicionar ou remover itens, entre na sua conta ou cadastre-se em 1 minuto.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <Link
                href="/login"
                className="py-3 px-6 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 text-sm font-semibold flex items-center justify-center gap-2 transition"
              >
                <LogIn className="w-4 h-4 text-indigo-600" />
                <span>Entrar na Minha Conta</span>
              </Link>
              <Link
                href="/register"
                className="py-3 px-6 rounded-xl gradient-btn text-white text-sm font-semibold flex items-center justify-center gap-2 shadow-lg transition"
              >
                <UserPlus className="w-4 h-4" />
                <span>Cadastrar-se Gratuitamente</span>
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Highlights Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-16 w-full max-w-4xl">
        <div className="glass-card p-5 rounded-xl text-center space-y-2 border border-slate-200">
          <Share2 className="w-8 h-8 text-indigo-600 mx-auto" />
          <h3 className="font-semibold text-slate-800">Link Direto</h3>
          <p className="text-xs text-slate-500">Compartilhe um único link no WhatsApp para todos verem.</p>
        </div>

        <div className="glass-card p-5 rounded-xl text-center space-y-2 border border-slate-200">
          <HeartHandshake className="w-8 h-8 text-emerald-600 mx-auto" />
          <h3 className="font-semibold text-slate-800">Sem Cadastro para Convidados</h3>
          <p className="text-xs text-slate-500">Os convidados reservam o presente em segundos apenas informando o nome.</p>
        </div>

        <div className="glass-card p-5 rounded-xl text-center space-y-2 border border-slate-200">
          <ShieldCheck className="w-8 h-8 text-purple-600 mx-auto" />
          <h3 className="font-semibold text-slate-800">Proteção de Dono</h3>
          <p className="text-xs text-slate-500">Apenas você gerencia os itens. Os convidados só podem reservar.</p>
        </div>
      </div>
    </main>
  );
}
