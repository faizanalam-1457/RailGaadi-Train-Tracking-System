export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
  meta: {
    timestamp: string;
    cached: boolean;
    provider?: string;
    isDemoData?: boolean;
    realtimeInventory?: boolean;
  };
}


