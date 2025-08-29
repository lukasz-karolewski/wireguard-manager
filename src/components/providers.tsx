"use client";
import NiceModal from "@ebay/nice-modal-react";
import type React from "react";

const NiceModalProviderWrapper: React.FC<React.PropsWithChildren> = ({ children }) => {
  return <NiceModal.Provider>{children}</NiceModal.Provider>;
};

export default NiceModalProviderWrapper;
