'use server';

import { prisma } from '@/lib/prisma';
import { processImageUpload } from '@/lib/imageHandler';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { ListaWithItems, ListaSummary, ActionResult } from '@/models';

function generateSlug(title: string): string {
  const baseSlug = title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');

  const randomHash = Math.random().toString(36).substring(2, 6);
  return `${baseSlug || 'lista'}-${randomHash}`;
}

export async function createListAction(formData: FormData): Promise<void> {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect('/login');
  }

  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const bannerUrl = formData.get('bannerUrl') as string;
  const bannerFile = formData.get('bannerFile') as File | null;

  if (!title || title.trim() === '') {
    return;
  }

  const slug = generateSlug(title);
  const userId = session.user.id;

  const existingUser = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true },
  });

  if (!existingUser) {
    redirect('/login');
  }

  const finalBanner = await processImageUpload(bannerUrl, bannerFile);

  await prisma.list.create({
    data: {
      title: title.trim(),
      description: description?.trim() || null,
      bannerUrl: finalBanner,
      ownerId: userId,
      slug,
    },
  });

  redirect(`/lista/${slug}`);
}

export async function getListBySlug(slug: string): Promise<ListaWithItems | null> {
  try {
    const list = await prisma.list.findUnique({
      where: { slug },
      include: {
        owner: {
          select: { id: true, name: true, email: true },
        },
        items: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    return list as unknown as ListaWithItems | null;
  } catch (error) {
    console.error('Error fetching list:', error);
    return null;
  }
}

export async function getUserLists(): Promise<ListaSummary[]> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return [];
    }

    const userId = session.user.id;

    const lists = await prisma.list.findMany({
      where: { ownerId: userId },
      include: {
        items: {
          select: {
            id: true,
            reservado: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return lists as unknown as ListaSummary[];
  } catch (error) {
    console.error('Error fetching user lists:', error);
    return [];
  }
}

export async function deleteListAction(listId: string): Promise<ActionResult> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return { error: 'Não autorizado' };
    }

    const userId = session.user.id;

    const list = await prisma.list.findUnique({
      where: { id: listId },
      select: { id: true, ownerId: true },
    });

    if (!list || list.ownerId !== userId) {
      return { error: 'Permissão negada ou lista não encontrada' };
    }

    await prisma.list.delete({
      where: { id: listId },
    });

    revalidatePath('/minhas-listas');
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Error deleting list:', error);
    return { error: 'Erro ao excluir lista' };
  }
}

