"use client";

import NiceModal from "@ebay/nice-modal-react";
import { useRouter } from "next/navigation";
import type { FC } from "react";

import { Button } from "~/components/ui/button";

import { AddEditClientModal } from "./AddEditClientModal";

export const AddClientButton: FC = () => {
  const router = useRouter();

  async function showAddClientModal() {
    await NiceModal.show(AddEditClientModal);
    router.refresh();
  }

  return <Button onClick={showAddClientModal}>Add</Button>;
};
