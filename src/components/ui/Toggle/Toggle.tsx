import React from "react";
import "./toggle.module.css";

export default function ToggleButton() {
  return (
    <div className="mb-12 flex w-full items-center justify-center">
      <label htmlFor="toogleA" className="flex cursor-pointer items-center">
        <div className="relative">
          <input id="toogleA" type="checkbox" className="sr-only" />
          <div className="h-4 w-10 rounded-full bg-gray-400 shadow-inner"></div>
          <div className="dot absolute -left-1 -top-1 h-6 w-6 rounded-full bg-white shadow transition"></div>
        </div>
        <div className="ml-3 font-medium text-gray-700">Toggle Me!</div>
      </label>
    </div>
  );
}
