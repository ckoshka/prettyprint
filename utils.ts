import { chroma } from "./deps.ts";

export const themeColor = (theme: chroma.Scale, mixStrength = 0.65) =>
	(colorname: string) => {
		const color = chroma(colorname);
		return color.mix(theme(color.luminance()), mixStrength, "lch");
	};
