import { themeColor } from "../utils.ts";
import { chroma } from "../deps.ts";
import { interpretComponent } from "../parse.ts";
import { Br } from "../types.ts";

const theme = themeColor(
	chroma.scale(["blue", "purple", "magenta", "pink"]).correctLightness(),
);

const style = interpretComponent({
	borders: {
		dotted: {
			vert: "•",
			horiz: "•",
		},
		solid: {
			vert: "|",
			horiz: "—",
		},
	},
	palette: {
		accent: theme("blue"),
		primary: theme("cyan"),
		secondary: theme("purple"),
		neutral: theme("white"),
		base: theme("white"),
		tertiary: theme("orange"),
	},
});

[
	style([
		["accent 70 dotted", "a line on its own"],
		[
			["primary italic", "Some lines can be "],
			["primary bold", "composed of "],
			["secondary 30 underlined", "several segments"],
		],
		Br,
		["neutral", "and include linebreaks"],
	]),
].map((x) => console.log(x));
