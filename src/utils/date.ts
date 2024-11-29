import { formatDistanceToNow, parseISO } from 'date-fns';
import { tr } from 'date-fns/locale';

export const formatDate = (date: string | Date): string => {
  const d = new Date(date);
  return new Intl.DateTimeFormat('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(d);
};

export const getRelativeTime = (dateStr: string): string => {
  try {
    const date = parseISO(dateStr);
    return formatDistanceToNow(date, { addSuffix: true, locale: tr });
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateStr;
  }
};