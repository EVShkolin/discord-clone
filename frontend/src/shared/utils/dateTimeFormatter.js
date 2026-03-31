export const formatDateTime = (isoString) => {
  const date = new Date(isoString);
  const options = {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  };

  const formatter = new Intl.DateTimeFormat(navigator.language, { ...options });
  return formatter.format(date);
};
