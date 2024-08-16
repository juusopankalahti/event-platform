import { HTMLProps } from "react";

interface Props extends HTMLProps<HTMLInputElement> {}

const Input = (props: Props) => {
  return (
    <input
      {...props}
      className={`border-width-2 bg-gray-100 px-4 py-2 w-full rounded outline-wf-violet ${
        props.className ? props.className : ""
      }`}
    />
  );
};

export default Input;
