"use client";

import React, { ComponentPropsWithoutRef, useState } from "react";

interface AccordionProps extends ComponentPropsWithoutRef<"div"> {
  actions?: React.ReactNode;
  children?: React.ReactNode;
  header: React.ReactNode | string;
  isInitiallyOpen?: boolean;
}

import { Transition } from "@headlessui/react";

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
    <div className={className}>
      <div className="flex items-center justify-between p-6">
        <button
          className="flex-1 text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg"
          onClick={toggleAccordion}
        >
          {typeof header === "string" ? (
            <h2 className="font-semibold text-gray-900">{header}</h2>
          ) : (
            header
          )}
        </button>
        {actions && <div className="ml-4">{actions}</div>}
      </div>
      <Transition
        enter="transition-all duration-200 ease-out"
        enterFrom="max-h-0 opacity-0"
        enterTo="max-h-screen opacity-100"
        leave="transition-all duration-200 ease-in"
        leaveFrom="max-h-screen opacity-100"
        leaveTo="max-h-0 opacity-0"
        show={isOpen}
      >
        <div className="overflow-hidden">{children}</div>
      </Transition>
    </div>
  );
};

export default Accordion;
