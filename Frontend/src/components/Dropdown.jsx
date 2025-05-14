import React, { useRef, useState } from "react";
import { useClickOutside } from "../event/useClickOutside";

const Dropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  // Close the dropdown if clicked outside
  useClickOutside(dropdownRef, () => setIsOpen(false));

  return (
    <div>
      <button onClick={toggleDropdown}>Toggle Dropdown</button>
      {isOpen && (
        <div ref={dropdownRef} style={{ border: "1px solid black", padding: "10px", position: "absolute" }}>
          <p>Dropdown content</p>
        </div>
      )}
    </div>
  );
};

export default Dropdown;
