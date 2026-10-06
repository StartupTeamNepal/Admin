import api from "@/shared/api/axiosInstance";

export interface MenuCategory {
  id: string;
  categoryName: string;
  description: string;
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string | null;
}

export interface CreateMenuCategoryRequest {
  categoryName: string;
  description: string;
  displayOrder: number;
}

export interface UpdateMenuCategoryRequest {
  categoryName: string;
  description: string;
  displayOrder: number;
}

export interface MenuCategoryResponse {
  success: boolean;
  message: string;
  data: MenuCategory;
  errors: unknown;
}

export interface MenuCategoriesResponse {
  success: boolean;
  message: string;
  data: {
    categories: MenuCategory[];
  };
  errors: unknown;
}

// GET  
export const getMenuCategories = async (): Promise<MenuCategoriesResponse> => {
  const response = await api.get<MenuCategoriesResponse>(
    "/api/admin/v1/menu-categories"
  );

  return response.data;
};

// GET  
export const getMenuCategoryById = async (
  id: string
): Promise<MenuCategoryResponse> => {
  const response = await api.get<MenuCategoryResponse>(
    `/api/admin/v1/menu-categories/${id}`
  );

  return response.data;
};

// POST  
export const createMenuCategory = async (
  data: CreateMenuCategoryRequest
): Promise<MenuCategoryResponse> => {
  const response = await api.post<MenuCategoryResponse>(
    "/api/admin/v1/menu-categories",
    data
  );

  return response.data;
};

// PUT  
export const updateMenuCategory = async (
  id: string,
  data: UpdateMenuCategoryRequest
): Promise<MenuCategoryResponse> => {
  const response = await api.put<MenuCategoryResponse>(
    `/api/admin/v1/menu-categories/${id}`,
    data
  );

  return response.data;
};

// DELETE 
export const deleteMenuCategory = async (
  id: string
): Promise<MenuCategoryResponse> => {
  const response = await api.delete<MenuCategoryResponse>(
    `/api/admin/v1/menu-categories/${id}`
  );

  return response.data;
};