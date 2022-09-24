import { chroma } from "./deps.ts";

export const themeColor = (theme: chroma.Scale) =>
	(colorname: string) => {
		const color = chroma(colorname);
		return color.mix(theme(color.luminance()), 0.65, "lch");
	};
