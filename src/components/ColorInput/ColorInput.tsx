import { FC } from "react";

export type ColorInputProps = {
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleEnter: (e: React.KeyboardEvent) => void;
  value: string;
  isLoading: boolean;
};

const ColorInput: FC<ColorInputProps> = ({
  value,
  handleChange = () => {},
  handleEnter = () => {},
  isLoading
}) => {

    return (
     <div className="relative"><input value={value} onKeyDown={handleEnter} onChange={handleChange} className="padding1 borderRadius_6 fullWidth relative" placeholder="Enter Colour" type="search" />{isLoading && <p className="italics">loading</p>}<input className="absolute-input" type="color" value="#ff0000" id="color-picker" /></div>
    );
  };
  
  export default ColorInput;
  