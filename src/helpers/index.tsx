import { ColoursEntry } from "../types/types";

export const rgbToHsl = (r: number, g: number, b: number) => {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h: number = 0;
  let s: number;
  let l: number;
  l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  h = Math.round(h * 360);
  s = Math.round(s * 100);
  l = Math.round(l * 100);
  return { h, s, l };
};

export const isValidHSL = (input: string) => {
  const regex = /^hsl\(\s*(\d{1,3})\s*,\s*(\d{1,3})%\s*,\s*(\d{1,3})%\s*\)$/;
  const result = regex.exec(input);
  if (result) {
    const [, h, s, l] = result.map(Number);
    return h <= 360 && s <= 100 && l <= 100;
  }
  return false;
};

export const isValidRGB = (input: string) => {
  const pattern =
    /^rgb\(\s*(25[0-5]|2[0-4][0-9]|[01]?[0-9]{1,2})\s*,\s*(25[0-5]|2[0-4][0-9]|[01]?[0-9]{1,2})\s*,\s*(25[0-5]|2[0-4][0-9]|[01]?[0-9]{1,2})\s*\)$/;
  return pattern.test(input);
};

export const isValidHex = (input: string) => {
  const regex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
  const result = regex.exec(input);
  if (result?.length) return true;
  else return false;
};

export const hexToRgb = (hex: string) => {
  hex = hex.replace("#", "");
  if (hex.length === 3) {
    hex = hex
      .split("")
      .map((char) => char + char)
      .join("");
  }
  const int = parseInt(hex, 16);
  return [(int >> 16) & 255, (int >> 8) & 255, int & 255];
};

export const colorDistance = (rgb1: number[], rgb2: number[]) => {
  return Math.sqrt(
    Math.pow(rgb1[0] - rgb2[0], 2) +
      Math.pow(rgb1[1] - rgb2[1], 2) +
      Math.pow(rgb1[2] - rgb2[2], 2)
  );
};

export const distance = (color1: ColoursEntry, color2: ColoursEntry) => {
  return (
    Math.pow(color1.R - color2.R, 2) +
    Math.pow(color1.G - color2.G, 2) +
    Math.pow(color1.B - color2.B, 2)
  );
};

export const rgbStringToRgb = (rgb: string) => {
  const result = rgb.match(/\d+/g);
  if (result) {
    return result.map(Number);
  } else {
    // Handle the case where rgb.match returns null
    return [];
  }
};

export const hslStringToRgb = (hsl: string): number[] => {
  // Parse HSL string to extract components
  const match = hsl.match(/hsl\((\d+),\s*([\d.]+)%,\s*([\d.]+)%\)/);
  if (!match) return [];

  const hue = parseInt(match[1]) / 360; // Convert hue to range [0, 1]
  const saturation = parseInt(match[2]) / 100; // Convert saturation to range [0, 1]
  const lightness = parseInt(match[3]) / 100; // Convert lightness to range [0, 1]

  // Convert HSL to RGB
  let r, g, b;
  if (saturation === 0) {
    r = g = b = lightness; // achromatic
  } else {
    const hueToRgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    const q =
      lightness < 0.5
        ? lightness * (1 + saturation)
        : lightness + saturation - lightness * saturation;
    const p = 2 * lightness - q;

    r = hueToRgb(p, q, hue + 1 / 3);
    g = hueToRgb(p, q, hue);
    b = hueToRgb(p, q, hue - 1 / 3);
  }

  // Convert RGB to [0, 255] range and return as array
  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
};
