import { Interest } from "@/types";
import { CheckBox } from "@mui/icons-material";

interface Props {
  interests: Interest[];
  values: string[];
  onInterestSelected: (value: string) => void;
}

/**
 * A component for selecting user interests from a list.
 */
const InterestSelector = (props: Props) => {
  const { interests, values, onInterestSelected } = props;
  return (
    <div className="border rounded divide-y">
      {interests.map((interest) => (
        <div
          key={interest._id}
          onClick={() => onInterestSelected(interest._id)}
          className={`px-4 py-2 flex items-center !cursor-pointer hover:bg-green-800/5 ${
            values.includes(interest._id)
              ? "bg-green-800/10 text-green-800 font-bold"
              : ""
          }`}
        >
          <p className="flex-1">{interest.name}</p>
          {values.includes(interest._id) && <CheckBox />}
        </div>
      ))}
    </div>
  );
};

export default InterestSelector;
