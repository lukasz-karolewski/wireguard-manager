import NiceModal, { useModal } from "@ebay/nice-modal-react";
import type React from "react";

import { Button } from "~/components/ui/button";
import Modal from "~/components/ui/modal";

interface Props {
  actionName: string;
  message: React.ReactNode;
  title: string;
}

const ConfirmModal = NiceModal.create<Props>(({ actionName, message, title }) => {
  const modal = useModal();

  return (
    <Modal
      className="w-1/2"
      onClose={() => {
        modal.remove();
      }}
      open={modal.visible}
      title={title}
    >
      <div className="p-4">{message}</div>
      <div className="flex justify-end gap-4 bg-slate-100 p-4 ">
        <Button
          onClick={() => {
            modal.resolve();
            modal.remove();
          }}
          variant="destructive"
        >
          {actionName}
        </Button>
        <Button autoFocus={true} onClick={modal.remove} variant="ghost">
          Cancel
        </Button>
      </div>
    </Modal>
  );
});

export default ConfirmModal;
