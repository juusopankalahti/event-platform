import { useState } from "react";
import { Listbox } from "@headlessui/react";
import { ArrowDropDown } from "@mui/icons-material";
import { AutoFillOption } from "@/components/AutoFill";

interface Props {
  initialValue?: AutoFillOption | string;
  options: AutoFillOption[];
  onChange: (event: { target: { name: string; value: any } }) => void;
  name?: string;
}

const Select = (props: Props) => {
  const { options, initialValue } = props;

  const value =
    typeof initialValue == "object" && initialValue?.name
      ? initialValue
      : options.find((o) => o.id == initialValue);

  const [selectedValue, setSelectedValue] = useState(value);

  const onValueChanged = (value: AutoFillOption) => {
    setSelectedValue(value);
    if (props.onChange) {
      props.onChange({ target: { name: props.name || "", value } });
    }
  };

  return (
    <Listbox value={selectedValue} onChange={onValueChanged}>
      <Listbox.Button
        className={"bg-gray-100 w-full text-left px-4 py-2 rounded relative"}
      >
        {selectedValue?.name || "Not selected"}
        <ArrowDropDown className="absolute right-2 opacity-75" />
      </Listbox.Button>
      <Listbox.Options
        className={
          "shadow-md rounded absolute bg-white w-full z-40 max-h-32 overflow-y-auto"
        }
      >
        {options.map((option) => (
          <Listbox.Option
            key={option.id}
            value={option}
            className={"px-4 py-2 cursor-pointer"}
          >
            {option.name}
          </Listbox.Option>
        ))}
      </Listbox.Options>
    </Listbox>
  );
};

export default Select;
