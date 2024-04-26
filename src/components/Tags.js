import React from "react";

const Tags = ({ selectedFilter, setSelectedFilter, text }) => {
  const removeHandler = (value) => {
    let removedSelected = selectedFilter.filter((ele) => ele !== value);
    setSelectedFilter((selectedFilter) => removedSelected);
  };

  return (
    <div className="h-[2rem] border rounded-lg flex justify-between items-center gap-2 p-2">
      {text}
      <strong onClick={() => removeHandler(text)} className="cursor-pointer">
        X
      </strong>
    </div>
  );
};

export default Tags;
