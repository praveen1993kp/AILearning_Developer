export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

export interface ApiError {
  error: string;
  status?: number;
  details?: unknown;
}
