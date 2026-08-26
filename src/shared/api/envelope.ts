import type { AxiosResponse } from "axios";

/** Backend'in tüm başarılı yanıtlarını sarmalayan zarf (`KanDostum.Shared/Models/Response`). */
export interface ApiSuccess<T> {
  success: true;
  message: string;
  data: T;
}

export interface ApiSuccessNoData {
  success: true;
  message: string;
}

export interface ApiError {
  success: false;
  message: string;
  data?: unknown;
}

export interface PaginatedList<T> {
  items: T[];
  currentPage: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

/** `SuccessDataResult<T>` zarfını açıp doğrudan `data` alanını döner. */
export async function unwrap<T>(
  promise: Promise<AxiosResponse<ApiSuccess<T>>>
): Promise<T> {
  const response = await promise;
  return response.data.data;
}

/** `SuccessResult` (veri içermeyen) zarfını açıp `message` alanını döner. */
export async function unwrapMessage(
  promise: Promise<AxiosResponse<ApiSuccessNoData>>
): Promise<string> {
  const response = await promise;
  return response.data.message;
}
