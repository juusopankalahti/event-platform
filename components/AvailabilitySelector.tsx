import { useEffect, useState } from "react";
import { CheckBox, Deselect, SelectAll } from "@mui/icons-material";

import Button from "@/components/Button";

interface Props {
  values: string[];
  onTimeSelected: (value: string) => void;
  onAllSelected: (values: string[]) => void;
}

/**
 * A component for selecting user availabilities for meetings.
 */
const AvailabilitySelector = (props: Props) => {
  const { values, onTimeSelected, onAllSelected } = props;
  const [times, setTimes] = useState<string[]>([]);

  const getTimesArray = () => {
    const timeSlots = [];
    let startTime = new Date();
    startTime.setHours(8, 30, 0, 0); // Set the start time to 08:30, hard coded for now

    while (startTime.getHours() < 23) {
      const endTime = new Date(startTime);
      endTime.setMinutes(endTime.getMinutes() + 15);

      const startTimeString = startTime.toLocaleTimeString("en-US", {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
      });
      const endTimeString = endTime.toLocaleTimeString("en-US", {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
      });

      const timeSlot = `${startTimeString}-${endTimeString}`;
      timeSlots.push(timeSlot);

      startTime = endTime;
    }

    return timeSlots;
  };

  useEffect(() => {
    setTimes(getTimesArray());
  }, []);

  return (
    <div>
      <div className="flex items-center">
        <Button
          className="pl-0 text-sm"
          color="!text-green-800"
          secondary
          onClick={() => onAllSelected(times)}
        >
          <SelectAll className="!h-6 !w-6 mr-1" />
          Select all
        </Button>
        <Button
          className="pl-0 text-sm"
          secondary
          onClick={() => onAllSelected([])}
        >
          <Deselect className="!h-6 !w-6 mr-1" />
          Deselect all
        </Button>
      </div>
      <div className="border rounded divide-y">
        {times.map((time) => (
          <div
            key={time}
            onClick={() => onTimeSelected(time)}
            className={`px-4 py-2 flex items-center !cursor-pointer hover:bg-green-800/5 ${
              values.includes(time)
                ? "bg-green-800/10 text-green-800 font-bold"
                : ""
            }`}
          >
            <p className="flex-1">{time}</p>
            {values.includes(time) && <CheckBox />}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AvailabilitySelector;
