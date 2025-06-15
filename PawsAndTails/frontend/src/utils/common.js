import { groomingServices } from "./constant";

const BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

export const loadImageFromServer = (url) => {
  const baseUrl = BASE_URL.split("/api")[0];
  return url ? `${baseUrl}${url}` : url;
};

export const formatAvailability = (availability) => {
  if (!availability || !availability.days || availability.days.length === 0)
    return "";

  const dayOrder = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const selectedDays = [...availability.days].sort(
    (a, b) => dayOrder.indexOf(a) - dayOrder.indexOf(b)
  );

  const isEveryday = selectedDays.length === 7;
  const isWeekdays =
    selectedDays.length === 5 &&
    selectedDays.every((d, i) => d === dayOrder[i]);
  const isWeekends =
    selectedDays.length === 2 &&
    selectedDays.includes("Sat") &&
    selectedDays.includes("Sun");

  let dayStr = "";

  if (isEveryday) {
    dayStr = "Everyday";
  } else if (isWeekdays) {
    dayStr = "Mon - Fri";
  } else if (isWeekends) {
    dayStr = "Weekends";
  } else {
    dayStr =
      selectedDays.length > 1
        ? selectedDays.slice(0, -1).join(", ") +
          " and " +
          selectedDays.slice(-1)
        : selectedDays[0];
  }

  return `${dayStr}, ${availability.startTime} - ${availability.endTime}`;
};

export const ValueToName = (name) => {
  if (!name) return name || "";
  return name.replaceAll("_", " ");
};

export const getServiceName = (name) => {
  if (!name) return name || "";
  return groomingServices.find((k) => k.value === name)?.name || name;
};
