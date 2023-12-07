import NiceModal, { useModal } from "@ebay/nice-modal-react";
import React from "react";

import { Button } from "~/components/ui/button";
import Modal from "~/components/ui/modal";

interface Props {
  title: string;
  message: React.ReactNode;
  actionName: string;
}

const ConfirmModal = NiceModal.create<Props>(({ title, message, actionName }) => {
  const modal = useModal();

  return (
    <Modal
      open={modal.visible}
      onClose={() => {
        modal.remove();
      }}
      title={title}
      className="w-1/2"
    >
      <div className="p-4">{message}</div>
      <div className="flex justify-end gap-4 bg-slate-100 p-4 ">
        <Button
          variant="destructive"
          onClick={() => {
            modal.resolve();
            modal.remove();
          }}
        >
          {actionName}
        </Button>
        <Button variant="ghost" onClick={modal.remove} autoFocus={true}>
          Cancel
        </Button>
      </div>
    </Modal>
  );
});

export default ConfirmModal;
