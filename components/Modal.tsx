import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Dialog } from "@headlessui/react";
import { ArrowBack } from "@mui/icons-material";
import { ReactElement } from "react";

interface Props {
  open?: boolean;
  title?: string;
  description?: string;
  children: ReactElement | (ReactElement | undefined | false)[];
  className?: string;
  onClose?: () => void;
  fullHeight?: boolean;
  allowScroll?: boolean;
}

const Modal = (props: Props) => {
  const {
    open,
    title,
    description,
    children,
    className,
    fullHeight,
    allowScroll,
  } = props;

  const router = useRouter();
  const params = useSearchParams();
  const pathname = usePathname();

  const closeModal = () => {
    if (props.onClose) {
      props.onClose();
      return;
    }
    const page = params.get("page");
    const query = page ? `?page=${page}` : "";
    router.push(`${pathname}${query}`);
  };

  return (
    <Dialog
      open={open}
      onClose={closeModal}
      className={`relative z-40 ${className}`}
    >
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex w-screen h-full items-center justify-center p-4">
        <Dialog.Panel
          className={`w-full h-full overflow-y-auto ${
            fullHeight ? "flex flex-col" : ""
          }  max-w-6xl transform overflow-hidden rounded-2xl bg-white p-6 lg:p-12 text-left align-middle shadow-xl transition-all`}
        >
          <button
            className="absolute left-4 top-4 opacity-30 outline-none"
            onClick={closeModal}
          >
            <ArrowBack />
          </button>
          {title && (
            <Dialog.Title className={"font-bold text-xl mt-8"}>
              {title}
            </Dialog.Title>
          )}
          {description && (
            <Dialog.Description className={"opacity-75 text-sm mb-4"}>
              {description}
            </Dialog.Description>
          )}
          <div
            className={`my-2 w-full ${
              fullHeight ? "flex-1 flex flex-col !my-0 overflow-hidden" : ""
            } ${allowScroll ? "!overflow-auto" : ""}`}
          >
            {children}
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default Modal;
