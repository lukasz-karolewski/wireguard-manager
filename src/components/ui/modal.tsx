import { Dialog, DialogPanel, DialogTitle, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/20/solid";
import { clsx } from "clsx";
import noop from "lodash/noop";
import { type FC, Fragment, type PropsWithChildren } from "react";

interface MyModalProps {
  className?: string;
  onClose: (shouldRefresh: boolean) => void;
  open: boolean;
  title: string;
}

const Modal: FC<PropsWithChildren<PropsWithChildren<MyModalProps>>> = ({
  children,
  className = "w-full",
  onClose = noop,
  open,
  title,
}) => {
  return (
    <Transition
      appear
      as={Fragment}
      enter="transition duration-100 ease-out"
      enterFrom="scale-95 opacity-0"
      enterTo="scale-100 opacity-100"
      leave="transition duration-75 ease-out"
      leaveFrom="scale-100 opacity-100"
      leaveTo="scale-95 opacity-0"
      show={open}
    >
      <Dialog
        className="fixed inset-0 z-50 flex items-center justify-center"
        onClose={() => {
          onClose(false);
        }}
      >
        <div aria-hidden="true" className="fixed inset-0 bg-black/30" />

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel
            className={clsx(
              "grid max-h-screen grid-rows-[min-content_minmax(0,100%)] rounded-sm bg-white shadow-xl",
              className,
            )}
          >
            <DialogTitle
              as="div"
              className="flex items-center justify-between rounded-t bg-accent p-6 text-lg font-medium leading-6 text-white"
            >
              {title}
              <XMarkIcon
                className="w-6 cursor-pointer"
                onClick={() => {
                  onClose(false);
                }}
              />
            </DialogTitle>
            <div className="overflow-y-auto">{children}</div>
          </DialogPanel>
        </div>
      </Dialog>
    </Transition>
  );
};

export default Modal;
