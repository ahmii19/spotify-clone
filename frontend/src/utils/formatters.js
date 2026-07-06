export const formatDuration = (seconds) => {
  if (!seconds) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export const formatNumber = (num) => {
  if (!num) return '0';
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
};

export const getImageUrl = (url, placeholder = '') => {
  return url || placeholder;
};

export const truncate = (str, len = 20) => {
  if (!str) return '';
  return str.length > len ? `${str.substring(0, len)}...` : str;
};
