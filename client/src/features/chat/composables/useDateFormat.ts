export const useDateFormat = () => {
  const formatMessageTime = (timestamp: number, locale = 'fr-FR'): string => {
    const date = new Date(timestamp);
    const dayName = date.toLocaleDateString(locale, { weekday: 'long' });
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

    const capitalizedDay = dayName.charAt(0).toUpperCase() + dayName.slice(1);

    return `${capitalizedDay} ${hours}h${minutes}`;
  };

  return {
    formatMessageTime,
  };
};
