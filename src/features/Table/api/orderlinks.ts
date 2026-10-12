import api from "@/shared/api/axiosInstance";

export interface TableOrdersResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T;
  errors: unknown;
}

export interface BillResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T;
  errors: unknown;
}

// GET orders for a specific table
export const getOrdersByTableId = async <T = unknown>(
  tableId: string
): Promise<TableOrdersResponse<T>> => {
  const response = await api.get<TableOrdersResponse<T>>(
    `/api/admin/v1/orders/table/${tableId}`
  );

  return response.data;
};

// GET bill for a specific order
export const getBillByOrderId = async <T = unknown>(
  orderId: string
): Promise<BillResponse<T>> => {
  const response = await api.get<BillResponse<T>>(
    `/api/admin/v1/bill/${orderId}`
  );

  return response.data;
};