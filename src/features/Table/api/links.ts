 import api from "@/shared/api/axiosInstance";

export interface Table {
  id: number;
  tableNumber: string;
  capacity: number;
  tableType: string;
  description: string;
  status: string;

}

export interface CreateTableRequest {
  tableNumber: string;
  capacity: number;
  tableType: string;
  description: string;
}

export interface UpdateTableRequest {
  tableNumber: string;
  capacity: number;
  tableType: string;
  description: string;
}

export interface TableResponse {
  success: boolean;
  message: string;
  data: Table;
  errors: unknown;
}

export interface TablesResponse {
  success: boolean;
  message: string;
  data: {
    items: Table[];
    totalCount: number;
    page: number;
    pageSize: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
  errors: unknown;
}

// GET 
export const getTables = async (): Promise<TablesResponse> => {
  const response = await api.get<TablesResponse>(
    "/api/admin/v1/tables"
  );

  return response.data;
};

// GET  
export const getTableById = async (
  id: number
): Promise<TableResponse> => {
  const response = await api.get<TableResponse>(
    `/api/admin/v1/tables/${id}`
  );

  return response.data;
};

// POST  
export const createTable = async (
  data: CreateTableRequest
): Promise<TableResponse> => {
  const response = await api.post<TableResponse>(
    "/api/admin/v1/tables",
    data
  );

  return response.data;
};

// PUT  
export const updateTable = async (
  id: number,
  data: UpdateTableRequest
): Promise<TableResponse> => {
  const response = await api.put<TableResponse>(
    `/api/admin/v1/tables/${id}`,
    data
  );

  return response.data;
};

// PATCH  
export const toggleTable = async (
  id: number
): Promise<TableResponse> => {
  const response = await api.patch<TableResponse>(
    `/api/admin/v1/tables/${id}/toggle`
  );

  return response.data;
};
 