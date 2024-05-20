import { FC } from "react";

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
  return (
    <div className="relative">
      <input
        autoFocus
        value={value}
        onKeyDown={handleEnter}
        onChange={handleChange}
        className="padding1 borderRadius_6 fullWidth relative"
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
