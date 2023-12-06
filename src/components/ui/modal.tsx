import { Dialog, Transition } from "@headlessui/react";
import clsx from "clsx";
import noop from "lodash/noop";
import { FC, Fragment, PropsWithChildren } from "react";

import { XMarkIcon } from "@heroicons/react/20/solid";

interface MyModalProps {
  open: boolean;
  onClose: (shouldRefresh: boolean) => void;
  title: string;
  className?: string;
}

const Modal: FC<PropsWithChildren<PropsWithChildren<MyModalProps>>> = ({
  title,
  open,
  onClose = noop,
  children,
  className = "w-full",
}) => {
  return (
    <Transition
      appear
      show={open}
      as={Fragment}
      enter="transition duration-100 ease-out"
      enterFrom="scale-95 opacity-0"
      enterTo="scale-100 opacity-100"
      leave="transition duration-75 ease-out"
      leaveFrom="scale-100 opacity-100"
      leaveTo="scale-95 opacity-0"
    >
      <Dialog
        className="fixed inset-0 z-50 flex items-center justify-center"
        onClose={() => onClose(false)}
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel
            className={clsx(
              "grid max-h-screen grid-rows-[min-content,minmax(0,100%)] rounded bg-white shadow-xl",
              className,
            )}
          >
            <Dialog.Title
              as="div"
              className="flex items-center justify-between rounded-t bg-accent p-6 text-lg font-medium leading-6 text-white"
            >
              {title}
              <XMarkIcon className="w-6 cursor-pointer" onClick={() => onClose(false)} />
            </Dialog.Title>
            <div className="overflow-y-auto">{children}</div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </Transition>
  );
};

export default Modal;
