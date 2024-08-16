import { MutableRefObject } from "react";
import { Dialog } from "@headlessui/react";
import Button from "@/components/Button";
import Fields, { CustomEvent, Field } from "@/components/Fields";

interface Props {
  open?: boolean;
  onClose: () => void;
  fields: Field[];
  onInputChange: (event: CustomEvent) => void;
  saveDisabled?: boolean;
  onSave: () => void;
  header: string;
  description: string;
  values: any;
  loading?: boolean;
  initialFocus?: MutableRefObject<HTMLElement | null>;
}

const VESDialog = (props: Props) => {
  const {
    open,
    onClose,
    fields,
    onInputChange,
    saveDisabled,
    onSave,
    header,
    description,
    values,
    loading,
    initialFocus,
  } = props;
  return (
    <Dialog
      open={open}
      onClose={onClose}
      className="relative z-50"
      initialFocus={initialFocus}
    >
      <div className="fixed inset-0 bg-black/30" />
      <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
        <Dialog.Panel
          className={
            "w-full max-h-full overflow-y-auto max-w-lg transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all"
          }
        >
          <Dialog.Title className={"font-bold text-xl"}>{header}</Dialog.Title>
          <Dialog.Description className={"opacity-75 text-sm mb-4"}>
            {description}
          </Dialog.Description>
          <Fields
            fields={fields}
            onInputChange={onInputChange}
            values={values}
          />
          <div className="flex justify-between mt-4">
            <Button className="!bg-gray-200 !text-gray-800" onClick={onClose}>
              Cancel
            </Button>
            <Button
              loading={loading}
              disabled={loading || saveDisabled}
              onClick={onSave}
            >
              Save
            </Button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default VESDialog;
