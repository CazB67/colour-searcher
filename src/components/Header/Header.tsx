import ColorWheelIcon from "../../svgs/ColorWheelIcon/ColorWheelIcon";

const Header = () => {
  return (
    <header className="App-header">
      <div className="flexEnd fullHeight flexRow gap_6 fullWidth">
      <ColorWheelIcon />
        <p className="paddingRight_1">Colour Search for HIVO</p>
      </div>
    </header>
  );
};

export default Header;
