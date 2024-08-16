import { ChangeEvent, RefObject, useRef, useState } from "react";
import {
  ChangeCircle,
  Delete,
  PhotoSizeSelectActual,
} from "@mui/icons-material";

import Button from "@/components/Button";

interface Props {
  name: string;
  onPhotoChanged: (photo: File | undefined) => void;
  value?: string;
  shape?: string;
}

const PhotoSelect = (props: Props) => {
  const [photo, setPhoto] = useState<any>(
    props.value && typeof props.value != "string"
      ? URL.createObjectURL(props.value)
      : props.value
  );

  const fileInput: RefObject<HTMLInputElement> = useRef(null);

  const onPhotoSelected = (e: ChangeEvent<HTMLInputElement>) => {
    const photoFile = e.target.files?.[0];
    if (photoFile) {
      const photo = URL.createObjectURL(photoFile);
      setPhoto(photo);
      props.onPhotoChanged(photoFile);
    }
  };

  const onPhotoRemoved = () => {
    setPhoto(undefined);
    props.onPhotoChanged(undefined);
  };

  if (!photo) {
    return (
      <div>
        <Button
          secondary
          className="pl-0"
          onClick={() => fileInput.current && fileInput.current.click()}
        >
          <PhotoSizeSelectActual className="!h-6 !w-6 mr-2" />
          Select a photo
        </Button>
        <input
          ref={fileInput}
          type="file"
          name={props.name}
          accept={"image/png, image/jpeg"}
          onChange={onPhotoSelected}
          className="hidden"
        />
      </div>
    );
  }
  return (
    <div className="flex items-center mt-2">
      <div
        className={`w-20 h-20 ${
          props.shape == "box" ? "rounded p-2" : "rounded-full"
        } overflow-hidden flex items-center justify-center bg-gray-200`}
      >
        <img
          src={photo}
          className={`h-auto w-full overflow-hidden ${
            props.shape == "box"
              ? "object-contain rounded"
              : "!h-full !object-cover"
          }`}
        />
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
          onClick={() => onPhotoRemoved()}
        >
          <Delete className="!h-6 !w-6 mr-1" /> Remove picture
        </Button>
      </div>

      <input
        ref={fileInput}
        type="file"
        name={props.name}
        accept={"image/png, image/jpeg"}
        onChange={onPhotoSelected}
        className="hidden"
      />
    </div>
  );
};

export default PhotoSelect;
