import React from "react";
import { IoIosSearch } from "react-icons/io";

function Form({ onSubmit, onRef }) {
  return (
    <form onSubmit={onSubmit}>
      <input
        // onChange={props.onEnteredValue}
        ref={onRef}
        type="text"
        placeholder="enter country name..."
      />
      <button>
        <IoIosSearch />
      </button>
    </form>
  );
}

export default Form;
