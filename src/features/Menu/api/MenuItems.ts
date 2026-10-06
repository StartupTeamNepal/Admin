import api from "@/shared/api/axiosInstance";

 // Types
 

export interface MenuItemVariant {
  id: string;
  name: string;
  additionalPrice: number;
  isAvailable: boolean;
}

export interface CreateMenuItemVariantRequest {
  name: string;
  additionalPrice: number;
  isAvailable: boolean;
}

export interface UpdateMenuItemVariantRequest {
  id: string;
  name: string;
  additionalPrice: number;
  isAvailable: boolean;
}

export interface CreateMenuItemRequest {
  categoryId: string;
  name: string;
  description: string;
  basePrice: number;
  imageUrl: string;
  isAvailable: boolean;
  preparationTime: number;
  isSpecialOffer: boolean;
  specialOfferPrice: number;
  displayOrder: number;
  variants: CreateMenuItemVariantRequest[];
}

export interface UpdateMenuItemRequest {
  categoryId: string;
  name: string;
  description: string;
  basePrice: number;
  imageUrl: string;
  isAvailable: boolean;
  preparationTime: number;
  isSpecialOffer: boolean;
  specialOfferPrice: number;
  displayOrder: number;
  variants: UpdateMenuItemVariantRequest[];
}

export interface MenuItem {
  id: string;
  menuCategoryId: string;
  categoryName: string;
  name: string;
  description: string;
  basePrice: number;
  imageUrl: string;
  isAvailable: boolean;
  preparationTime: number;
  isSpecialOffer: boolean;
  specialOfferPrice: number | null;
  displayOrder: number;
  createdAt: string;
  updatedAt: string | null;
  variants: MenuItemVariant[];
}

 // Response Types
 
export interface MenuItemResponse {
  success: boolean;
  message: string;
  data: MenuItem;
  errors: unknown;
}

export interface MenuItemsResponse {
  success: boolean;
  message: string;
  data: {
    items: MenuItem[];
  };
  errors: unknown;
}
 
// GET - All Menu Items
 

export const getMenuItems = async (): Promise<MenuItemsResponse> => {
  const response = await api.get<MenuItemsResponse>(
    "/api/admin/v1/menu-items"
  );

  return response.data;
};

 
// GET - Menu Items By Category
 

export const getMenuItemsByCategory = async (
  categoryId: string
): Promise<MenuItemsResponse> => {
  const response = await api.get<MenuItemsResponse>(
    `/api/admin/v1/menu-items/by-category/${categoryId}`
  );

  return response.data;
};

 
// GET - Menu Item By ID
 

export const getMenuItemById = async (
  id: string
): Promise<MenuItemResponse> => {
  const response = await api.get<MenuItemResponse>(
    `/api/admin/v1/menu-items/${id}`
  );

  return response.data;
};

 
// POST - Create Menu Item
 

export const createMenuItem = async (
  data: CreateMenuItemRequest
): Promise<MenuItemResponse> => {
  const response = await api.post<MenuItemResponse>(
    "/api/admin/v1/menu-items",
    data
  );

  return response.data;
};

 
// PUT - Update Menu Item
 

export const updateMenuItem = async (
  id: string,
  data: UpdateMenuItemRequest
): Promise<MenuItemResponse> => {
  const response = await api.put<MenuItemResponse>(
    `/api/admin/v1/menu-items/${id}`,
    data
  );

  return response.data;
};

 
// DELETE - Delete Menu Item
 

export const deleteMenuItem = async (
  id: string
): Promise<MenuItemResponse> => {
  const response = await api.delete<MenuItemResponse>(
    `/api/admin/v1/menu-items/${id}`
  );

  return response.data;
};