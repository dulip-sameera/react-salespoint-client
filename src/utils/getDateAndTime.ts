export const getDateAndTime = (date: Date) => {
  date = new Date(date);
  return date.toLocaleString();
};
