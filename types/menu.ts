// types/menu.ts
export interface MenuItem {
  menu_item_id?: number;
  name: string;
  description: string | null;
  price: number;
  status?: string;
  created_at?: string;
  updated_at?: string;
}

export interface MenuItemsResponse {
  items: MenuItem[];
}

export interface ApiError {
  message: string;
  error?: string;
  suggestion?: string;
}

export interface ApiSuccess<T> {
  success: boolean;
  message: string;
  data?: T;
}

export type ApiResponse<T> = T | ApiError;
