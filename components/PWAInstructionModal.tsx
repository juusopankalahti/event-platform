import { IosShare } from "@mui/icons-material";

import Modal from "@/components/Modal";
import Button from "@/components/Button";
import { Event } from "@/types";

interface Props {
  event: Event;
  setAppDialogSeen: () => void;
  appDialogLoading: boolean;
}

const PWAInstructionModal = (props: Props) => {
  const { event, setAppDialogSeen, appDialogLoading } = props;
  return (
    <Modal
      open={true}
      title={`Welcome to ${event.name}!`}
      description="Just one more step before getting started."
      fullHeight
      allowScroll
      onClose={setAppDialogSeen}
    >
      <div className="flex-1">
        <p className="text-sm font-bold">
          To get the most out of the networking platform, please add the
          application on your Home Screen. This enables push notifications and
          makes it easier to access the platform. Here's how to do this:
        </p>
        <p className="mt-4">
          1. Tap on the <IosShare /> icon on the bottom of the page.
        </p>
        <p className="mt-2">2. Select 'Add to Home Screen' from the menu.</p>
        <p className="mt-2">
          3. Use the platform from the shortcut on your Home Screen. If a login
          is needed, use the login code from the e-mail you received.
        </p>
        <p className="mt-2">
          4. Allow push notifications and start networking! 🎉
        </p>
      </div>
      <div className="w-full flex items-center justify-end mt-8">
        <Button loading={appDialogLoading} onClick={setAppDialogSeen}>
          Close
        </Button>
      </div>
    </Modal>
  );
};

export default PWAInstructionModal;
