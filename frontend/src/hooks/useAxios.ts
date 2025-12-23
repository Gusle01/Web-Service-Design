import { useEffect, useState } from "react";

import { axiosInstance } from "../api/axiosInstance";

export function useAxios<T>(url: string, initialData: T) {
  const [data, setData] = useState<T>(initialData);
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let ignore = false;
    const controller = new AbortController();

    const fetchData = async () => {
      setIsLoading(true);
      setError("");

      try {
        const res = await axiosInstance.get<T>(url, {
          signal: controller.signal,
        });
        if (!ignore) {
          setData(res.data);
        }
      } catch (err) {
        if (!ignore) {
          if (err instanceof Error && err.name === "CanceledError") {
            return;
          }
          setError(err instanceof Error ? err.message : "오류가 발생했습니다.");
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      ignore = true;
      controller.abort();
    };
  }, [url]);

  return { data, error, isLoading };
}
