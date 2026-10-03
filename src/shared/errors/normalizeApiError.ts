import axios from 'axios';
import type {
  AppError,
  ValidationErrorItem,
  ValidationErrors,
} from './types';

const defaultAppError: AppError = {
  code: null,
  message: 'Something went wrong. Please try again.',
  details: '',
  data: {},
  validationErrors: null,
};

type PlainObject = Record<string, unknown>;

function isPlainObject(value: unknown): value is PlainObject {
  return (
    Boolean(value) &&
    typeof value === 'object' &&
    !Array.isArray(value)
  );
}

function readString(value: unknown): string | null {
  return typeof value === 'string' && value.trim()
    ? value.trim()
    : null;
}

function normalizeValidationErrors(
  value: unknown,
): ValidationErrors | null {
  if (Array.isArray(value)) {
    const items = value.flatMap(
      (item): ValidationErrorItem[] => {
        if (!isPlainObject(item)) {
          return [];
        }

        const message = readString(item.message);

        if (!message) {
          return [];
        }

        const members = Array.isArray(item.members)
          ? item.members.flatMap((member) =>
              typeof member === 'string' && member.trim()
                ? [member.trim()]
                : [],
            )
          : [];

        return [{ message, members }];
      },
    );

    return items.length > 0 ? items : null;
  }

  if (isPlainObject(value)) {
    const items = Object.entries(value).flatMap(
      ([member, messages]): ValidationErrorItem[] => {
        if (!Array.isArray(messages)) {
          return [];
        }

        return messages.flatMap((message) =>
          typeof message === 'string' && message.trim()
            ? [
                {
                  message: message.trim(),
                  members: [member],
                },
              ]
            : [],
        );
      },
    );

    return items.length > 0 ? items : null;
  }

  return null;
}

export function buildAppErrorFromPayload(
  value: unknown,
  fallbackMessage = defaultAppError.message,
  status?: number,
): AppError {
  if (typeof value === 'string') {
    return {
      ...defaultAppError,
      message: value.trim() || fallbackMessage,
      details: value.trim(),
      ...(status !== undefined ? { status } : {}),
    };
  }

  const payload = isPlainObject(value) ? value : {};

  const nestedError = isPlainObject(payload.error)
    ? payload.error
    : null;

  const source = nestedError ?? payload;

  const message =
    readString(source.message) ??
    readString(payload.error_description) ??
    readString(payload.message) ??
    (!nestedError ? readString(payload.error) : null) ??
    fallbackMessage;

  const details =
    readString(source.details) ??
    readString(payload.details) ??
    readString(payload.error_description) ??
    '';

  const data = isPlainObject(source.data)
    ? source.data
    : isPlainObject(payload.data)
      ? payload.data
      : payload;

  const validationErrors = normalizeValidationErrors(
    source.validationErrors ??
      payload.validationErrors,
  );

  const code =
    readString(source.code) ??
    (!nestedError ? readString(payload.error) : null) ??
    null;

  return {
    code,
    message,
    details,
    data,
    validationErrors,
    ...(status !== undefined ? { status } : {}),
  };
}

export function normalizeApiError(
  error: unknown,
): AppError {
  if (axios.isAxiosError(error)) {
    if (error.request && !error.response) {
      return {
        ...defaultAppError,
        code: 'NETWORK_ERROR',
        message: 'Unable to connect to the server.',
        details:
          'Please check your internet connection and try again.',
      };
    }

    return buildAppErrorFromPayload(
      error.response?.data,
      error.message || defaultAppError.message,
      error.response?.status,
    );
  }

  if (error instanceof Error) {
    return {
      ...defaultAppError,
      message:
        error.message || defaultAppError.message,
    };
  }

  if (isPlainObject(error)) {
    return buildAppErrorFromPayload(error);
  }

  return defaultAppError;
}