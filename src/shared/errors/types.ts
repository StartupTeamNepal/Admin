export type ValidationErrorItem = {
  message: string;
  members: string[];
};

export type ValidationErrors = ValidationErrorItem[];

export type AppError = {
  code: string | null;
  message: string;
  details: string;
  data: Record<string, unknown>;
  validationErrors: ValidationErrors | null;
  status?: number;
};