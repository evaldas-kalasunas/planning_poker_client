import { useState } from "react";

const useCustomInputHook = initialValue => {
  const [value, setValue] = useState(initialValue);
  const handleChange = e => {
    setValue( e && e.target ? e.target.value : e );
  };
  const reset = () => {
    setValue("");
  };
  return [value, handleChange, reset];
};

export default useCustomInputHook;