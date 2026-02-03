export type ApiError = {
  response?: {
    data?: {
      message?: string;
    };
  };
};

export function getErrorMessage(error: unknown, fallback: string): string {
  if (typeof error === 'object' && error) {
    const maybeError = error as ApiError;
    const message = maybeError.response?.data?.message;
    if (typeof message === 'string' && message.trim().length > 0) {
      return message;
    }
  }
  return fallback;
}
