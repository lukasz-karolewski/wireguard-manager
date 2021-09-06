import React from "react";
import "./toggle.module.css";

export default function ToggleButton() {
  return (
    <div className="flex items-center justify-center w-full mb-12">
      <label htmlFor="toogleA" className="flex items-center cursor-pointer">
        <div className="relative">
          <input id="toogleA" type="checkbox" className="sr-only" />
          <div className="w-10 h-4 bg-gray-400 rounded-full shadow-inner"></div>
          <div className="absolute w-6 h-6 bg-white rounded-full shadow dot -left-1 -top-1 transition"></div>
        </div>
        <div className="ml-3 font-medium text-gray-700">Toggle Me!</div>
      </label>
    </div>
  );
}
