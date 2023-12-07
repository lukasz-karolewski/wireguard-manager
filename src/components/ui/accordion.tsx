"use client";

import React, { useState } from "react";

type AccordionProps = {
  title: React.ReactNode;
  actions?: React.ReactNode;
  isInitiallyOpen?: boolean;
  children: React.ReactNode;
};

import { Transition } from "@headlessui/react";

const Accordion: React.FC<AccordionProps> = ({ title, actions, isInitiallyOpen, children }) => {
  const [isOpen, setIsOpen] = useState(isInitiallyOpen);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      <div className="flex items-center justify-between bg-gray-200 px-4 py-2">
        <button onClick={toggleAccordion} className="">
          {title}
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
