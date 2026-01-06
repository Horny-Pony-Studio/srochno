export const getTimeColor = (minutes: number) => {
  if (minutes > 40) return 'text-[#34C759]';
  if (minutes > 20) return 'text-[#FF9500]';
  return 'text-[#FF3B30]';
};

export const getTimeBackground = (minutes: number) => {
  if (minutes > 40) return 'bg-[#E5F8ED]';
  if (minutes > 20) return 'bg-[#FFF5E5]';
  return 'bg-[#FFE5E5]';
};