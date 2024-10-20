import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function convertToUnixTimestamp(dateString: string): number {
  const date = new Date(dateString);
  return Math.floor(date.getTime() / 1000);
}

export function timeSince(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  let interval = Math.floor(seconds / 31536000); // seconds in a year
  if (interval > 1) {
    return `${interval} years ago`;
  }

  interval = Math.floor(seconds / 2592000); // seconds in a month
  if (interval > 1) {
    return `${interval} months ago`;
  }

  interval = Math.floor(seconds / 86400); // seconds in a day
  if (interval > 1) {
    return `${interval} days ago`;
  }

  interval = Math.floor(seconds / 3600); // seconds in an hour
  if (interval > 1) {
    return `${interval} hours ago`;
  }

  interval = Math.floor(seconds / 60); // seconds in a minute
  if (interval > 1) {
    return `${interval} minutes ago`;
  }

  return `${seconds} seconds ago`;
}

export function celsiusToFahrenheit(celsius: number): number {
  return (celsius * 9) / 5 + 32;
}
