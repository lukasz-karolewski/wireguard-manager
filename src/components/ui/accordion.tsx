"use client";

import React, { useState } from "react";

interface AccordionProps extends React.ComponentPropsWithoutRef<"div"> {
  header: string;
  actions?: React.ReactNode;
  isInitiallyOpen?: boolean;
  children: React.ReactNode;
}

import { Transition } from "@headlessui/react";
import clsx from "clsx";

const Accordion: React.FC<AccordionProps> = ({
  header,
  actions,
  isInitiallyOpen = false,
  children,
  className,
}) => {
  const [isOpen, setIsOpen] = useState(isInitiallyOpen);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      <div className={clsx("flex items-center justify-between bg-gray-200 px-4 py-2", className)}>
        <button onClick={toggleAccordion} className="">
          <h2>{header}</h2>
        </button>
        {actions}
      </div>
      <Transition
        show={isOpen}
        enter="transition-opacity duration-100"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity duration-100"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div>{children}</div>
      </Transition>
    </div>
  );
};

export default Accordion;
