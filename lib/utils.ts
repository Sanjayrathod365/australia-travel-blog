import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { format, parseISO } from "date-fns"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date | null | undefined): string {
  if (!date) return '';
  try {
    if (date instanceof Date) {
      return format(date, "MMMM d, yyyy");
    }
    // If it's a string, try to parse it as an ISO date
    const parsedDate = parseISO(String(date));
    return format(parsedDate, "MMMM d, yyyy");
  } catch (error) {
    console.error('Error formatting date:', error);
    return '';
  }
}
