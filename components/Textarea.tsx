import { HTMLProps } from "react";

interface Props extends HTMLProps<HTMLTextAreaElement> {}

const Textarea = (props: Props) => {
  return (
    <textarea
      {...props}
      className={`border-width-2 bg-gray-100 h-32 px-4 py-2 w-full rounded outline-wf-violet resize-none ${
        props.className ? props.className : ""
      }`}
    />
  );
};

export default Textarea;
