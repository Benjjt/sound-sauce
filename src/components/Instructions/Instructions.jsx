import React from "react";
import "../Instructions/instructions.scss";
import { BsArrow90DegUp } from "react-icons/bs";

export const Instructions = ({ instruction }) => {
  return (
    <>
      {instruction === "shape" && (
        <div className="instructions">
          <BsArrow90DegUp /> First, choose a shape!
        </div>
      )}
    </>
  );
};
