"use client";

import React, { ComponentPropsWithoutRef, useState } from "react";

interface AccordionProps extends ComponentPropsWithoutRef<"div"> {
  actions?: React.ReactNode;
  children?: React.ReactNode;
  header: string;
  isInitiallyOpen?: boolean;
}

import { Transition } from "@headlessui/react";
import { clsx } from "clsx";

const Accordion: React.FC<AccordionProps> = ({
  actions,
  children,
  className,
  header,
  isInitiallyOpen = false,
}) => {
  const [isOpen, setIsOpen] = useState(isInitiallyOpen);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      <div className={clsx("flex items-center justify-between bg-gray-200 p-4", className)}>
        <button className="" onClick={toggleAccordion}>
          <h2>{header}</h2>
        </button>
        {actions}
      </div>
      <Transition
        enter="transition-opacity duration-100"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity duration-100"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
        show={isOpen}
      >
        <div>{children}</div>
      </Transition>
    </div>
  );
};

export default Accordion;
