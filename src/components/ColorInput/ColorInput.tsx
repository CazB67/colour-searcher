import { FC, useEffect, useRef } from "react";

export type ColorInputProps = {
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleEnter: (e: React.KeyboardEvent) => void;
  value: string;
  hexValue: string;
  isLoading: boolean;
};

const ColorInput: FC<ColorInputProps> = ({
  value,
  handleChange = () => {},
  handleEnter = () => {},
  isLoading,
  hexValue,
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const colorPicker = document.querySelector("#color-picker");
    if (colorPicker) {
      colorPicker.addEventListener("change", setFocus, false);
    }

    // Cleanup function to remove the event listener
    return () => {
      if (colorPicker) {
        colorPicker.removeEventListener("change", setFocus, false);
      }
    };
  },[]);

  const setFocus = () => {
   if (inputRef.current) inputRef.current.focus()
  }

  return (
    <div className="relative">
      <input
        autoFocus
        ref={inputRef}
        value={value}
        onKeyDown={handleEnter}
        onChange={handleChange}
        className="padding1 borderRadius_6 fullWidth relative noOutline"
        style={{border: `1px solid ${hexValue}`}}
        placeholder="Enter Colour"
        type="search"
      />
      {isLoading && <p className="italics">loading</p>}
      <input
        className={`${
          value.includes("#") || !value ? "absolute-input" : "displayNone"
        }`}
        type="color"
        value={hexValue}
        id="color-picker"
        onChange={handleChange}
      />
    </div>
  );
};

export default ColorInput;
