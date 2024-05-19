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
     <><input value={value} onKeyDown={handleEnter} onChange={handleChange} className="padding1 borderRadius_6 fullWidth" placeholder="Enter Colour" type="search" />{isLoading && <p className="italics">loading</p>}</>
    );
  };
  
  export default ColorInput;
  