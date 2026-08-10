export interface Item {
  id: string;
  listId: string;
  titulo: string;
  link: string | null;
  valorEstimado: number | null;
  imagem: string | null;
  reservado: boolean;
  reservadoPor: string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface ItemSummary {
  id: string;
  reservado: boolean;
}

export interface ItemCreateInput {
  listId: string;
  listSlug?: string;
  titulo: string;
  link?: string | null;
  valorEstimado?: number | null;
  imagem?: string | null;
}

export interface ItemReserveInput {
  itemId: string;
  reservadoPor: string;
  listSlug: string;
}

export interface ActionResult<T = undefined> {
  success?: boolean;
  error?: string;
  data?: T;
}
