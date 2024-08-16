import { ChangeEvent, RefObject, useRef, useState } from "react";
import { ChangeCircle, Delete, FileCopy } from "@mui/icons-material";

import Button from "@/components/Button";

interface Props {
  name: string;
  onFileChanged: (file: File | undefined) => void;
  value?: string;
}

const FileSelect = (props: Props) => {
  const [file, setFile] = useState<any>(
    props.value && typeof props.value != "string"
      ? URL.createObjectURL(props.value)
      : props.value
  );
  const fileInput: RefObject<HTMLInputElement> = useRef(null);

  const onFileSelected = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setFile(file);
    props.onFileChanged(file);
  };

  const onFileRemoved = () => {
    setFile(undefined);
    props.onFileChanged(undefined);
  };

  if (!file) {
    return (
      <div>
        <Button
          secondary
          className="pl-0"
          onClick={() => fileInput.current && fileInput.current.click()}
        >
          <FileCopy className="!h-6 !w-6 mr-2" />
          Select a file
        </Button>
        <input
          ref={fileInput}
          type="file"
          name={props.name}
          onChange={onFileSelected}
          className="hidden"
        />
      </div>
    );
  }
  return (
    <div className="flex items-center mt-2">
      <div
        className="w-20 h-20 rounded flex items-center justify-center bg-gray-200 overflow-hidden flex-col text-center p-2 cursor-pointer"
        onClick={() =>
          window.open(
            typeof file == "string" ? file : URL.createObjectURL(file),
            "_blank"
          )
        }
      >
        <FileCopy />
        <p className="text-xs mt-2">View file</p>
      </div>
      <div>
        <Button
          color="!text-wf-violet"
          secondary
          className="pb-1 text-sm"
          onClick={() => fileInput.current && fileInput.current.click()}
        >
          <ChangeCircle className="!h-6 !w-6 mr-1" /> Select another
        </Button>
        <Button
          secondary
          className="text-sm"
          color="!text-red-800"
          onClick={() => onFileRemoved()}
        >
          <Delete className="!h-6 !w-6 mr-1" /> Remove file
        </Button>
      </div>

      <input
        ref={fileInput}
        type="file"
        name={props.name}
        onChange={onFileSelected}
        className="hidden"
      />
    </div>
  );
};

export default FileSelect;
