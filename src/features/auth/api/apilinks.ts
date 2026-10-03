import api from "@/shared/api/axiosInstance";

export interface RegisterRequest {
  email: string;
  password: string;
  confirmPassword: string;
  restaurantName: string;
  businessType: string;
  description: string;
  fullName: string;
  phone: string;
  alternativePhone?: string;
  streetAddress: string;
  city: string;
  stateProvince: string;
  postalCode: string;
  country: string;
  googleMapsUrl?: string;
  businessRegistrationNumber: string;
  taxVatNumber: string;
  openingTime: string;
  closingTime: string;
  cuisineType: string;
}

export interface RegisterResponse {
  message: string;
  // add other response fields from your backend
}

export const registerAdmin = async (
  data: RegisterRequest
): Promise<RegisterResponse> => {
  const response = await api.post<RegisterResponse>(
    "/api/admin/v1/auth/register",
    data
  );

  return response.data;
};

// Verify Email
export interface VerifyRequest {
  email: string;
  code: string;
}

export interface VerifyResponse {
  message: string;
  // add other response fields from your backend
}

export const verifyAdmin = async (
  data: VerifyRequest
): Promise<VerifyResponse> => {
  const response = await api.post<VerifyResponse>(
    "/api/admin/v1/auth/verify",
    data
  );

  return response.data;
};

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginData {
  token: string;
  refreshToken: string;
  expiresAt: string;
  userId: string;
  fullName: string;
  email: string;
  role: string;
  restaurantName: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: LoginData;
  errors: unknown;
}

export const loginAdmin = async (
  data: LoginRequest
): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>(
    "/api/admin/v1/auth/login",
    data
  );

  return response.data;
};