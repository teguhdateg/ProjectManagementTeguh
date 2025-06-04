import { useMutation, useQuery, QueryKey } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';

type UseMutateApiProps<TPayload, TResponse> = {
  key: QueryKey;
  fetch: (payload: TPayload) => Promise<TResponse | AxiosResponse<TResponse>>;
  retry?: boolean | number;
  onSuccess?: (data: TResponse, payload: TPayload) => void;
  onError?: (error: unknown, payload: TPayload) => void;
  allResponse?: boolean;
};

export const useMutateApi = <TPayload, TResponse>({
  key,
  fetch,
  retry = false,
  onSuccess,
  onError,
  allResponse = false,
}: UseMutateApiProps<TPayload, TResponse>) => {
  const {
    data,
    mutate,
    mutateAsync,
    error,
    isError,
  } = useMutation<TResponse | AxiosResponse<TResponse>, unknown, TPayload>({
    mutationKey: key,
    mutationFn: fetch,
    retry,
    onSuccess: (res, payload) => {
      const responseData = isAxiosResponse<TResponse>(res) && !allResponse ? res.data : res;
      onSuccess?.(responseData as TResponse, payload);
    },
    onError: (error, payload) => {
      onError?.(error, payload);
    },
  });

  return {
    response: data,
    data: isAxiosResponse(data) && !allResponse ? data?.data : data,
    mutate,
    mutateAsync,
    error,
    isError,
  };
};

type UseGetApiProps<TResponse> = {
  key: QueryKey;
  fetch: () => Promise<TResponse | AxiosResponse<TResponse>>;
  enabled?: boolean;
  retry?: boolean | number;
  refetchOnWindowFocus?: boolean;
  onSuccess?: (data: TResponse) => void;
  onError?: (error: unknown) => void;
  allResponse?: boolean;
};

export const useGetApi = <TResponse>({
  key,
  fetch,
  enabled = true,
  retry = false,
  refetchOnWindowFocus = false,
  onSuccess,
  onError,
  allResponse = false,
}: UseGetApiProps<TResponse>) => {
  const query = useQuery<TResponse | AxiosResponse<TResponse>, unknown>({
    queryKey: key,
    queryFn: fetch,
    enabled,
    retry,
    refetchOnWindowFocus,
    // Simpan success handler terpisah via callbacks
    // untuk menghindari error overload
  });

  // Jalankan side effect success/error secara manual
  if (query.isSuccess && onSuccess) {
    const res = query.data;
    const responseData = isAxiosResponse(res) && !allResponse ? res.data : res;
    onSuccess(responseData as TResponse);
  }

  if (query.isError && onError) {
    onError(query.error);
  }

  return {
    response: query.data,
    data: isAxiosResponse(query.data) && !allResponse ? query.data?.data : query.data,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    refetch: query.refetch,
    isError: query.isError,
    error: query.error,
  };
};

type UseGetApiWithParamsProps<TPayload, TResponse> = {
  key: QueryKey;
  payload: TPayload;
  fetch: (payload: TPayload) => Promise<TResponse | AxiosResponse<TResponse>>;
  enabled?: boolean;
  retry?: boolean | number;
  refetchOnWindowFocus?: boolean;
  onSuccess?: (data: TResponse, payload: TPayload) => void;
  onError?: (error: unknown, payload: TPayload) => void;
  allResponse?: boolean;
};

export const useGetApiWithParams = <TPayload, TResponse>({
  key,
  payload,
  fetch,
  enabled = true,
  retry = false,
  refetchOnWindowFocus = false,
  onSuccess,
  onError,
  allResponse = false,
}: UseGetApiWithParamsProps<TPayload, TResponse>) => {
  const query = useQuery<TResponse | AxiosResponse<TResponse>, unknown>({
    queryKey: [...key, payload], // agar caching berubah jika payload berubah
    queryFn: () => fetch(payload),
    enabled,
    retry,
    refetchOnWindowFocus,
  });

  if (query.isSuccess && onSuccess) {
    const res = query.data;
    const responseData = isAxiosResponse(res) && !allResponse ? res.data : res;
    onSuccess(responseData as TResponse, payload);
  }

  if (query.isError && onError) {
    onError(query.error, payload);
  }

  return {
    response: query.data,
    data: isAxiosResponse(query.data) && !allResponse ? query.data?.data : query.data,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    refetch: query.refetch,
    isError: query.isError,
    error: query.error,
  };
};


// Helper function
function isAxiosResponse<T>(res: any): res is AxiosResponse<T> {
  return res && typeof res === 'object' && 'status' in res && 'data' in res;
}
