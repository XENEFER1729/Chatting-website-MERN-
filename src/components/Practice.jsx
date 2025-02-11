import React, { useRef } from 'react';

const Practice = () => {

  const inputRef = useRef(null);

  const handleClick = () => {
    inputRef.current.focus();  // Focus the input field
  };

  return (
    <div>
      <input ref={inputRef} type="text" placeholder="Type here..." />
      <button onClick={handleClick}>Focus Input</button>
    </div>
  );
};

export default Practice;