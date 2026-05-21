"use client";

import NiceModal from "@ebay/nice-modal-react";
import { useRouter } from "next/navigation";
import type { FC } from "react";

import { Button } from "~/components/ui/button";

import { AddEditSiteModal } from "./AddEditSiteModal";

export const AddSiteButton: FC = () => {
  const router = useRouter();

  async function showAddSiteModal() {
    await NiceModal.show(AddEditSiteModal);
    router.refresh();
  }

  return <Button onClick={showAddSiteModal}>Add</Button>;
};
