'use server';

import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

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

  if (!session || !session.user || !(session.user as any).id) {
    redirect('/login');
  }

  const title = formData.get('title') as string;
  const description = formData.get('description') as string;

  if (!title || title.trim() === '') {
    return;
  }

  const slug = generateSlug(title);
  const userId = (session.user as any).id;

  const existingUser = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true },
  });

  if (!existingUser) {
    redirect('/login');
  }

  await prisma.list.create({
    data: {
      title: title.trim(),
      description: description?.trim() || null,
      ownerId: userId,
      slug,
    },
  });

  redirect(`/lista/${slug}`);
}

export async function getListBySlug(slug: string) {
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

    return list;
  } catch (error) {
    console.error('Error fetching list:', error);
    return null;
  }
}

export async function getUserLists() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !(session.user as any).id) {
      return [];
    }

    const userId = (session.user as any).id;

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

    return lists;
  } catch (error) {
    console.error('Error fetching user lists:', error);
    return [];
  }
}

export async function deleteListAction(listId: string) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !(session.user as any).id) {
      return { error: 'Não autorizado' };
    }

    const userId = (session.user as any).id;

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

