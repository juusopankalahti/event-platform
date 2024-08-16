import { useCallback, useEffect, useMemo, useState } from "react";
import { Combobox } from "@headlessui/react";
import { ArrowDropDown } from "@mui/icons-material";

export type AutoFillOption = {
  id: string;
  name: string;
};

interface Props {
  initialValue?: AutoFillOption | string;
  options: AutoFillOption[];
  onChange: (event: { target: { name: string; value: any } }) => void;
  name?: string;
  placeholder?: string;
}

const AutoFill = (props: Props) => {
  const { options, initialValue, placeholder } = props;

  const value =
    typeof initialValue == "object" && initialValue?.name
      ? initialValue
      : options.find((o) => o.id == initialValue);

  const [selectedValue, setSelectedValue] = useState<
    AutoFillOption | undefined
  >(value);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const value =
      typeof initialValue == "object" && initialValue?.name
        ? initialValue
        : options.find((o) => o.id == initialValue);
    setSelectedValue(value);
  }, [initialValue]);

  const onValueChanged = useCallback(
    (value: AutoFillOption) => {
      setSelectedValue(value);
      if (props.onChange) {
        props.onChange({ target: { name: props.name || "", value } });
      }
    },
    [setSelectedValue, props.onChange]
  );

  const filteredOptions = useMemo(
    () =>
      query === ""
        ? options
        : options.filter((option) => {
            return option.name.toLowerCase().includes(query.toLowerCase());
          }),
    [query, options]
  );

  return (
    <Combobox value={selectedValue} onChange={onValueChanged}>
      <Combobox.Button as="div" className="relative flex items-center">
        <Combobox.Input
          className={
            "bg-gray-100 w-full text-left px-4 py-2 rounded relative outline-wf-violet"
          }
          displayValue={(selectedValue: AutoFillOption) => selectedValue.name}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={placeholder}
        />
        <ArrowDropDown className="absolute right-2" />
      </Combobox.Button>
      <Combobox.Options
        className={
          "shadow-md rounded absolute bg-white w-full z-40 max-h-32 overflow-y-auto"
        }
      >
        {filteredOptions.map((option) => (
          <Combobox.Option
            key={option.id}
            value={option}
            className={"px-4 py-2 cursor-pointer"}
          >
            {option.name}
          </Combobox.Option>
        ))}
      </Combobox.Options>
    </Combobox>
  );
};

export default AutoFill;
