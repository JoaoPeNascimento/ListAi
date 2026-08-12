import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';

export async function processImageUpload(
  imageUrl: string | null,
  imageFile: File | null
): Promise<string | null> {
  // If user provided a file upload
  if (imageFile && imageFile.size > 0 && imageFile.name !== 'undefined') {
    try {
      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Create uploads directory inside public if it doesn't exist
      const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
      await fs.mkdir(uploadsDir, { recursive: true });

      // Generate a unique filename
      const ext = path.extname(imageFile.name) || '.jpg';
      const hash = crypto.randomBytes(8).toString('hex');
      const filename = `${Date.now()}-${hash}${ext}`;
      const filePath = path.join(uploadsDir, filename);

      await fs.writeFile(filePath, buffer);
      return `/api/uploads/${filename}`;
    } catch (error) {
      console.error('Error saving uploaded image:', error);
      // Fallback to imageUrl if upload fails
    }
  }

  // If user provided a direct image URL
  if (imageUrl && imageUrl.trim() !== '') {
    return imageUrl.trim();
  }

  return null;
}

export async function deleteLocalImage(imageUrl: string | null | undefined): Promise<void> {
  if (!imageUrl || typeof imageUrl !== 'string') return;

  try {
    // Apenas tenta excluir imagens locais salvas na pasta uploads
    if (!imageUrl.includes('/uploads/')) return;

    let filename: string;
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
      const parsedUrl = new URL(imageUrl);
      filename = path.basename(parsedUrl.pathname);
    } else {
      filename = path.basename(imageUrl);
    }

    if (!filename) return;

    const safeFilename = path.basename(filename);
    const filePath = path.join(process.cwd(), 'public', 'uploads', safeFilename);

    await fs.unlink(filePath);
  } catch (error: unknown) {
    const err = error as { code?: string };
    if (err?.code !== 'ENOENT') {
      console.error(`Error deleting local image (${imageUrl}):`, error);
    }
  }
}

export async function deleteLocalImages(imageUrls: (string | null | undefined)[]): Promise<void> {
  await Promise.allSettled(imageUrls.map((url) => deleteLocalImage(url)));
}

