import Header from "../../components/Header/Header";
import TitleComponent from "../../components/TitleComponent/TitleComponent";
import { useCallback, useEffect, useState } from "react";
import { getColour } from "../../services";
import ColourTable from "../../components/ColourTable/ColourTable";
import { ColoursEntry } from "../../types/types";
import {
  colorDistance,
  distance,
  hexToRgb,
  hslStringToRgb,
  isValidHex,
  isValidHSL,
  isValidRGB,
  rgbStringToRgb,
  rgbToHsl,
} from "../../helpers";
import ColorInput from "../../components/ColorInput/ColorInput";
import InfoComponent from "../../components/InfoComponent/InfoComponent";

const HomePage = () => {
  const [allColours, setAllColours] = useState<ColoursEntry[]>([]);
  const [sortedColours, setSortedColours] = useState<ColoursEntry[]>([]);
  const [isInvalid, setIsInvalid] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [hexValue, setHexValue] = useState("#152eff");
  const [fetchError, setFetchError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const fetchColours = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await getColour();
      if (response) setIsLoading(false);
      if (response === "error") return setFetchError(true);
      convertHexToRgb(response);
      setFetchError(false);
    } catch (err) {
      setIsLoading(false);
      console.error(err);
    }
  }, []);

  useEffect(() => {
    if (!inputValue) setSortedColours([]);
    if (!inputValue && isInvalid) setIsInvalid(false);
  }, [allColours, inputValue, isInvalid]);

  useEffect(() => {
    if (!allColours?.length) fetchColours();
  }, [allColours?.length, fetchColours]);

  const findColour = (e: React.KeyboardEvent) => {
    if (e.key !== "Enter") return;
    const trimmedValue = inputValue.replace(/ /g, "");
    const reduce = allColours.reduce((prev: any[], cur: ColoursEntry) => {
      if (
        cur.color
          .toLowerCase()
          .replace(/ /g, "")
          .includes(trimmedValue.toLowerCase()) ||
        cur.hex.replace(/ /g, "").includes(trimmedValue) ||
        cur.RGB.replace(/ /g, "").includes(trimmedValue) ||
        cur.HSL.replace(/ /g, "").includes(trimmedValue)
      ) {
        prev.push(cur);
      }
      return prev;
    }, []);

    if (reduce.length < 1) findClosestColor();
    else {
      setIsInvalid(false);
      sortColours(reduce);
    }
  };

  const findClosestColor = () => {
    const parsedColor = parseColor();

    if (!parsedColor) return;

    const closestColor = getClosestColor(parsedColor);

    return sortColours([closestColor.closestColor]);
  };

  const parseColor = () => {
    if (inputValue.includes("#")) {
      if (isValidHex(inputValue)) {
        setIsInvalid(false);
        return hexToRgb(inputValue);
      } else {
        setIsInvalid(true);
        return null;
      }
    } else if (inputValue.includes("rgb")) {
      if (isValidRGB(inputValue)) {
        setIsInvalid(false);
        return rgbStringToRgb(inputValue);
      } else {
        setIsInvalid(true);
        return null;
      }
    } else if (inputValue.includes("hsl")) {
      if (isValidHSL(inputValue)) {
        setIsInvalid(false);
        return hslStringToRgb(inputValue);
      } else {
        setIsInvalid(true);
        return null;
      }
    } else {
      setIsInvalid(true);
      return null;
    }
  };

  const getClosestColor = (parsedColor: number[]) => {
    return allColours.reduce(
      (prev: any, cur: ColoursEntry) => {
        const colorRgb = rgbStringToRgb(cur.RGB);

        if (colorRgb) {
          const distance = colorDistance(parsedColor, colorRgb);
          if (distance < prev.minDistance) {
            prev.minDistance = distance;
            prev.closestColor = cur; // Update the closest color
          }
        }
        return prev;
      },
      { minDistance: Infinity, closestColor: null }
    );
  };

  const sortColours = (colours: ColoursEntry[]) => {
    const coloursCopy = [...allColours];
    const sort = coloursCopy.sort((a, b) => {
      return distance(a, colours[0]) - distance(b, colours[0]);
    });
    const selectedColourIndex = sort.findIndex(
      (y) => y.color === colours[0].color
    );
    const result = findAndSurrounding(sort, selectedColourIndex);
    setSortedColours(result);
  };

  // Get 50 elements before and 50 elements after the matching index
  const getSurroundingElements = (
    sortedArray: ColoursEntry[],
    index: number,
    count: number
  ) => {
    const start = Math.max(0, index - count);
    const end = Math.min(sortedArray.length, index + count + 1);
    return sortedArray.slice(start, end);
  };

  // Find matching HSL and get surrounding elements
  const findAndSurrounding = (
    sortedArray: ColoursEntry[],
    matchingIndex: number
  ) => {
    const surroundingElements = getSurroundingElements(
      sortedArray,
      matchingIndex,
      50
    );

    // Place the matching element at the top
    const matchingElement = sortedArray[matchingIndex];
    surroundingElements.splice(surroundingElements.indexOf(matchingElement), 1); // Remove the matching element from the array
    return [matchingElement, ...surroundingElements]; // Return the matching element at the top
  };

  const convertHexToRgb = (colours: ColoursEntry[]) => {
    const addRGB = colours.reduce(
      (prev: any[], cur: { color: string; hex: string }) => {
        const r = parseInt(cur.hex.slice(1, 3), 16);
        const g = parseInt(cur.hex.slice(3, 5), 16);
        const b = parseInt(cur.hex.slice(5, 7), 16);
        const rgbObject = { r, g, b };

        const rgbString = `rgb(${rgbObject.r}, ${rgbObject.g}, ${rgbObject.b})`;
        const hslObject = rgbToHsl(r, g, b);
        const hslString = `hsl(${hslObject.h}, ${hslObject.s}%, ${hslObject.l}%)`;
        const R = rgbObject.r;
        const G = rgbObject.g;
        const B = rgbObject.b;

        const colorWithRGBandHSL = {
          ...cur,
          RGB: rgbString,
          HSL: hslString,
          R,
          G,
          B,
        };
        prev.push(colorWithRGBandHSL);
        return prev;
      },
      []
    );
    setAllColours(addRGB);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    if (e.target.value.includes("#")) setHexValue(e.target.value);
  };

  const switchHeader = () => {
    if (isInvalid && inputValue) return "Colour is invalid";
    else if (fetchError) return "Error fetching colours";
    else if (inputValue && sortedColours.length > 0)
      return `Results for ${inputValue}`;
    else if (!inputValue && sortedColours.length < 1) return "All Colours";
  };

  const switchColours = () => {
    if (sortedColours.length > 0) return sortedColours;
    else return allColours;
  };

  return (
    <div className="fullHeight">
      <Header />
      <main className="flexStart fullHeight flexColumn padding_2">
        <div className="padding1_0 flexStart flexColumn">
          <TitleComponent />
          <InfoComponent />
          <ColorInput
            handleEnter={findColour}
            isLoading={isLoading}
            value={inputValue}
            handleChange={handleChange}
            hexValue={hexValue}
          />
        </div>
        <h3>{switchHeader()}</h3>
        <button
          className={`${
            fetchError
              ? "fullWidth cursorPointer borderRadius_6 padding1"
              : "displayNone"
          }`}
          onClick={() => fetchColours()}
        >
          Click to Retry
        </button>
        {!isInvalid && !fetchError && <ColourTable colours={switchColours()} />}
      </main>
    </div>
  );
};

export default HomePage;
