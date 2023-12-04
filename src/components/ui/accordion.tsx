"use client";

import React, { useState } from "react";

type AccordionProps = {
  title: React.ReactNode;
  isInitiallyOpen?: boolean;
  children: React.ReactNode;
};

import { Transition } from "@headlessui/react";

const Accordion: React.FC<AccordionProps> = ({ title, isInitiallyOpen, children }) => {
  const [isOpen, setIsOpen] = useState(isInitiallyOpen);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      <button onClick={toggleAccordion} className="w-full">
        {title}
      </button>
      <Transition
        show={isOpen}
        enter="transition-opacity duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity duration-300"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div>{children}</div>
      </Transition>
    </div>
  );
};

export default Accordion;
