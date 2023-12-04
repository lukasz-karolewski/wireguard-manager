import NiceModal, { useModal } from "@ebay/nice-modal-react";

import { Button } from "~/components/ui/button";
import Modal from "~/components/ui/modal";

interface Props {
  client_name: string;
}

const ConfirmClientRemoveModal = NiceModal.create<Props>(({ client_name }) => {
  const modal = useModal();

  return (
    <Modal
      open={modal.visible}
      onClose={() => {
        modal.remove();
      }}
      title="Confirm Client Removal"
    >
      <div className="p-4">
        <p>
          You are about to remove the client <strong>{client_name}</strong>.
        </p>
        This action <strong>cannot</strong> be undone. Are you sure?
      </div>
      <div className="flex justify-end gap-4 bg-slate-100 p-4 ">
        <Button
          variant="destructive"
          onClick={() => {
            modal.resolve();
            modal.remove();
          }}
        >
          Remove
        </Button>
        <Button variant="ghost" onClick={modal.remove}>
          Cancel
        </Button>
      </div>
    </Modal>
  );
});

export default ConfirmClientRemoveModal;
