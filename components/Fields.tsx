import { Switch } from "@headlessui/react";

import Select from "@/components/Select";
import Input from "@/components/Input";
import PhotoSelect from "@/components/PhotoSelect";
import FileSelect from "@/components/FileSelect";
import Textarea from "@/components/Textarea";
import AutoFill from "@/components/AutoFill";
import { ReactElement } from "react";

type FieldOption = {
  id: string;
  name: string;
};

export interface Field {
  id: string;
  label: string;
  type?:
    | "file"
    | "autofill"
    | "select"
    | "custom"
    | "image"
    | "imageBox"
    | "textarea"
    | "toggle";
  description?: string;
  component?: () => ReactElement;
  options?: () => FieldOption[];
  placeholder?: string;
}

export interface CustomEvent {
  target: { name?: string; value?: any; [key: string]: any };
  [key: string]: any;
}

interface Props {
  fields: Field[];
  values: any;
  onInputChange: (event: CustomEvent) => void;
}

const Fields = (props: Props) => {
  const { fields, values, onInputChange } = props;
  return (
    <div className="w-full">
      {fields.map((field) => {
        switch (field.type) {
          case "custom":
            return (
              <div key={field.id} className="mb-2 relative">
                <p className="text-sm font-bold">{field.label}</p>
                {field.component && field.component()}
              </div>
            );
          case "select":
            return (
              <div key={field.id} className="mb-2 relative">
                <p className="text-sm font-bold">{field.label}</p>
                <Select
                  options={field.options ? field.options() : []}
                  initialValue={values[field.id]}
                  onChange={onInputChange}
                  name={field.id}
                />
              </div>
            );
          case "autofill":
            return (
              <div key={field.id} className="mb-2 relative">
                <p className="text-sm font-bold">{field.label}</p>
                <AutoFill
                  options={field.options ? field.options() : []}
                  initialValue={values[field.id]}
                  onChange={onInputChange}
                  name={field.id}
                  placeholder={field.placeholder}
                />
              </div>
            );
          case "file":
            return (
              <div key={field.id} className="mb-2">
                <p className="text-sm font-bold mb-1">{field.label}</p>
                <FileSelect
                  name={field.id}
                  onFileChanged={(file) =>
                    onInputChange({
                      target: { name: field.id, value: file },
                    })
                  }
                  value={values[field.id]}
                />
              </div>
            );
          case "image":
            return (
              <div key={field.id} className="mb-2">
                <p className="text-sm font-bold mb-1">{field.label}</p>
                <PhotoSelect
                  name={field.id}
                  onPhotoChanged={(photo) =>
                    onInputChange({
                      target: { name: field.id, value: photo },
                    })
                  }
                  value={values[field.id]}
                />
              </div>
            );
          case "imageBox":
            return (
              <div key={field.id} className="mb-2">
                <p className="text-sm font-bold mb-1">{field.label}</p>
                <PhotoSelect
                  shape="box"
                  name={field.id}
                  onPhotoChanged={(photo) =>
                    onInputChange({
                      target: { name: field.id, value: photo },
                    })
                  }
                  value={values[field.id]}
                />
              </div>
            );
          case "toggle":
            return (
              <div
                key={field.id}
                className="mb-2 mt-4 flex justify-between items-center"
              >
                <div className="mb-1">
                  <p className="text-sm font-bold">{field.label}</p>
                  {field.description && (
                    <p className="text-xs text-gray-400">{field.description}</p>
                  )}
                </div>
                <Switch
                  checked={!!values[field.id]}
                  onChange={(value) =>
                    onInputChange({ target: { name: field.id, value } })
                  }
                  className={`${
                    !!values[field.id] ? "bg-wf-violet" : "bg-gray-200"
                  } relative inline-flex h-6 w-11 items-center rounded-full flex-shrink-0 ml-4`}
                >
                  <span
                    className={`${
                      !!values[field.id] ? "translate-x-6" : "translate-x-1"
                    } inline-block h-4 w-4 transform rounded-full bg-white transition`}
                  />
                </Switch>
              </div>
            );
          case "textarea":
            return (
              <div key={field.id} className="mb-2">
                <p className="text-sm font-bold mb-1">{field.label}</p>
                <Textarea
                  key={field.id}
                  name={field.id}
                  placeholder={field.label}
                  onChange={onInputChange}
                  value={values[field.id]}
                />
              </div>
            );
          default:
            return (
              <div key={field.id} className="mb-2">
                <p className="text-sm font-bold mb-1">{field.label}</p>
                <Input
                  key={field.id}
                  name={field.id}
                  placeholder={field.label}
                  onChange={onInputChange}
                  value={values[field.id]}
                />
              </div>
            );
        }
      })}
    </div>
  );
};

export default Fields;
