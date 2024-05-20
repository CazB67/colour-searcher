import { FC } from "react";
import { ColoursEntry } from "../../types/types";

export type ColorTableProps = {
  colours: ColoursEntry[];
};

const ColourTable: FC<ColorTableProps> = ({ colours }) => {
  return (
    <section className="fullWidth fullHeight padding1_0">
      <table className="fullWidth">
        <thead>
          <tr>
            <th></th>
            <th>Name</th>
            <th>Hex</th>
            <th>RGB</th>
            <th>HSL</th>
          </tr>
        </thead>
        <tbody>
          {colours.map((item) => (
            <tr key={item.color}>
              <td>
                <div
                  className="borderRadius_6 iconSquare"
                  style={{ background: item.hex }}
                ></div>
              </td>
              <td>{item?.color}</td>
              <td>{item?.hex}</td>
              <td>{item?.RGB}</td>
              <td>{item?.HSL}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};

export default ColourTable;
