'use server';

import { prisma } from '@/lib/prisma';
import { processImageUpload } from '@/lib/imageHandler';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import { ActionResult } from '@/models';

interface OwnerCheckResult {
  isOwner: boolean;
  list: { id: string; ownerId: string | null; slug: string } | null;
}

async function verifyListOwner(listId: string): Promise<OwnerCheckResult> {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id || null;

  const list = await prisma.list.findUnique({
    where: { id: listId },
    select: { id: true, ownerId: true, slug: true },
  });

  if (!list) {
    return { isOwner: false, list: null };
  }

  // If list has an owner, check if session user matches ownerId
  const isOwner = !!(userId && list.ownerId && userId === list.ownerId);
  return { isOwner, list };
}

export async function addItemAction(formData: FormData): Promise<ActionResult> {
  const listId = formData.get('listId') as string;
  const listSlug = formData.get('listSlug') as string;
  const titulo = formData.get('titulo') as string;
  const link = formData.get('link') as string;
  const valorEstimadoStr = formData.get('valorEstimado') as string;
  const imageUrl = formData.get('imageUrl') as string;
  const imageFile = formData.get('imageFile') as File | null;

  if (!listId || !titulo || titulo.trim() === '') {
    return { error: 'O título do item é obrigatório.' };
  }

  // Verification: Only owner can add items
  const { isOwner } = await verifyListOwner(listId);
  if (!isOwner) {
    return { error: 'Apenas o criador desta lista tem permissão para adicionar itens.' };
  }

  try {
    const valorEstimado = valorEstimadoStr ? parseFloat(valorEstimadoStr.replace(',', '.')) : null;
    const finalImage = await processImageUpload(imageUrl, imageFile);

    await prisma.item.create({
      data: {
        listId,
        titulo: titulo.trim(),
        link: link?.trim() || null,
        valorEstimado: isNaN(valorEstimado as number) ? null : valorEstimado,
        imagem: finalImage,
      },
    });

    if (listSlug) {
      revalidatePath(`/lista/${listSlug}`);
    }

    return { success: true };
  } catch (error) {
    console.error('Error adding item:', error);
    return { error: 'Ocorreu um erro ao adicionar o item.' };
  }
}

/**
 * Public action for guests to reserve an item
 */
export async function reserveItemAction(
  itemId: string,
  reservadoPor: string,
  listSlug: string
): Promise<ActionResult> {
  if (!itemId || !reservadoPor || reservadoPor.trim() === '') {
    return { error: 'Por favor, informe seu nome para confirmar a reserva.' };
  }

  try {
    const result = await prisma.item.updateMany({
      where: {
        id: itemId,
        reservado: false,
      },
      data: {
        reservado: true,
        reservadoPor: reservadoPor.trim(),
      },
    });

    if (result.count === 0) {
      return { error: 'Este item já foi reservado por outra pessoa instantes atrás!' };
    }

    revalidatePath(`/lista/${listSlug}`);
    return { success: true };
  } catch (error) {
    console.error('Error reserving item:', error);
    return { error: 'Erro ao reservar o item. Tente novamente.' };
  }
}

export async function cancelReservationAction(itemId: string, listSlug: string): Promise<ActionResult> {
  try {
    await prisma.item.update({
      where: { id: itemId },
      data: {
        reservado: false,
        reservadoPor: null,
      },
    });

    revalidatePath(`/lista/${listSlug}`);
    return { success: true };
  } catch (error) {
    console.error('Error cancelling reservation:', error);
    return { error: 'Erro ao cancelar a reserva.' };
  }
}

export async function deleteItemAction(itemId: string, listSlug: string): Promise<ActionResult> {
  const item = await prisma.item.findUnique({
    where: { id: itemId },
    select: { listId: true },
  });

  if (!item) {
    return { error: 'Item não encontrado.' };
  }

  const { isOwner } = await verifyListOwner(item.listId);
  if (!isOwner) {
    return { error: 'Apenas o criador desta lista tem permissão para excluir itens.' };
  }

  try {
    await prisma.item.delete({
      where: { id: itemId },
    });

    revalidatePath(`/lista/${listSlug}`);
    return { success: true };
  } catch (error) {
    console.error('Error deleting item:', error);
    return { error: 'Erro ao excluir o item.' };
  }
}
