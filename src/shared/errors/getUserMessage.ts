import type { AppError } from './types';

const statusMessages: Record<number, string> = {
  400: 'Invalid request. Please check your input and try again.',
  401: 'Your session has expired. Please log in again.',
  403: 'You do not have permission to perform this action.',
  404: 'The requested resource was not found.',
  409: 'The requested operation could not be completed.',
  422: 'Please check the entered information.',
  500: 'A server error occurred. Please try again later.',
};

const technicalPatterns = [
  /divide by zero/i,
  /stack trace/i,
  /null reference/i,
  /nullreferenceexception/i,
  /exception/i,
  /invalid operation/i,
  /request failed with status code/i,
];

export function getUserMessage(error: AppError): string {
  const validationMessage =
    error.validationErrors?.find(
      (item) => item.message.trim(),
    )?.message;

  if (validationMessage) {
    return validationMessage;
  }

  if (
    typeof error.status === 'number' &&
    statusMessages[error.status]
  ) {
    if (
      !error.message ||
      technicalPatterns.some((pattern) =>
        pattern.test(error.message),
      )
    ) {
      return statusMessages[error.status];
    }
  }

  const message = error.message?.trim();

  if (!message) {
    return 'Something went wrong. Please try again.';
  }

  if (
    technicalPatterns.some((pattern) =>
      pattern.test(message),
    )
  ) {
    return (
      statusMessages[error.status ?? 0] ??
      'Something went wrong. Please try again.'
    );
  }

  return message;
}