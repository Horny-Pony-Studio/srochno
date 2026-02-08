export function formatTimeLeft(totalSeconds: number): string {
  const mins = Math.floor(totalSeconds / 60);
  if (mins >= 10) return `${mins} мин`;
  const secs = totalSeconds % 60;
  return `${mins}:${String(secs).padStart(2, '0')}`;
}

export const getTimeColor = (minutes: number) => {
  if (minutes > 40) return 'text-[#34C759]';
  if (minutes > 20) return 'text-[#FF9500]';
  return 'text-[#FF3B30]';
};

export const getTimeBackground = (minutes: number) => {
  if (minutes > 40) return 'bg-[#E5F8ED] dark:bg-[#1a3a2a]';
  if (minutes > 20) return 'bg-[#FFF5E5] dark:bg-[#3a2f1a]';
  return 'bg-[#FFE5E5] dark:bg-[#3a1a1a]';
};