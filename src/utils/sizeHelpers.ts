import { dateHeaderHeight } from '@/constants';

export function calculateHeaderHeight(dateDisplay: string[]): number {
  return dateDisplay.length * dateHeaderHeight;
}
