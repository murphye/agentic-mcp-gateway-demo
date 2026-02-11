"use client";

import { useQuery } from "@tanstack/react-query";
import { apiClient, API_PATHS } from "../api/client";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useOrder(orderId: string) {
  return useQuery({
    queryKey: ["order", orderId],
    queryFn: async () => {
      const response = await apiClient.get({
        url: `${API_PATHS.orderManagement}/orders/${orderId}`,
      });

      if (response.error) {
        throw new Error("Failed to fetch order");
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return response.data as any;
    },
    enabled: !!orderId,
  });
}
