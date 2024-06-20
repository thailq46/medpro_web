import _ from "lodash";

const parseTime = (timeString: string) => {
  const [time, period] = timeString.split(" ");
  let [hours, minutes] = time.split(":").map(Number);

  if (period === "PM" && hours !== 12) {
    hours += 12;
  } else if (period === "AM" && hours === 12) {
    hours = 0;
  }

  return {hours, minutes};
};

const getStartTime = (range: string) => {
  const [start] = range.split(" - ");
  return parseTime(start);
};

export default function sortTimes(times: string[]) {
  return _.sortBy(times, (time) => {
    const {hours, minutes} = getStartTime(time);
    return hours * 60 + minutes;
  });
}

export function addAmPmSuffix(timeRange: string) {
  return timeRange
    .split(" - ")
    .map((time) => {
      const [hours, minutes] = time.split(":").map(Number);
      const suffix = hours >= 12 ? "PM" : "AM";
      return `${hours}:${minutes.toString().padStart(2, "0")} ${suffix}`;
    })
    .join(" - ");
}
