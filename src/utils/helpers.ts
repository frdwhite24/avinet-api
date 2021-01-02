export const getFlightTitle = (timeOfDay: number): string => {
  let title: string;
  if (timeOfDay <= 5 || timeOfDay >= 22) {
    title = "Night flight";
  } else if (timeOfDay > 5 && timeOfDay < 12) {
    title = "Morning flight";
  } else if (timeOfDay >= 12 && timeOfDay < 18) {
    title = "Afternoon flight";
  } else if (timeOfDay <= 18 && timeOfDay < 22) {
    title = "Evening flight";
  } else {
    title = "Flight";
  }
  return title;
};
