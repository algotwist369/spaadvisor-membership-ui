"use client";

import React from "react";

export function useDebouncedValue<T>(value: T, delay: number) {
  const [debouncedValue, setDebouncedValue] = React.useState(value);

  React.useEffect(() => {
    const timeout = window.setTimeout(() => setDebouncedValue(value), delay);
    return () => window.clearTimeout(timeout);
  }, [delay, value]);

  return debouncedValue;
}

export function formatDate(value?: string) {
  return value ? new Date(value).toLocaleString() : "Not available";
}

export function formatCurrency(amount?: number) {
  return `Rs. ${(amount || 0).toLocaleString()}`;
}
