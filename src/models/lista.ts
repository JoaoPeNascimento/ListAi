import { Item, ItemSummary } from './item';
import { UserSummary } from './user';

export interface Lista {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  bannerUrl?: string | null;
  ownerId: string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface ListaWithItems extends Lista {
  items: Item[];
  owner?: UserSummary | null;
}

export interface ListaSummary extends Lista {
  items: ItemSummary[];
}

export interface ListaCreateInput {
  title: string;
  description?: string | null;
  bannerUrl?: string | null;
  ownerId?: string | null;
}
