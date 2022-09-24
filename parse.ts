import { ansi, chroma, colors } from "./deps.ts";
import {
	Border,
	BorderStyles,
	Br,
	Cls,
	Color,
	ColorPalette,
	Component,
	Line,
	LineSegment,
	Shade,
} from "./types.ts";

const fontMap = {
	"italic": colors.italic,
	"bold": colors.bold,
	"underlined": colors.underline,
};

export const adjustColor = (color: chroma.Color) =>
	(shade: Shade | string) => color.luminance(Number(shade) / 200);

export const repeat = (char: string) =>
	(times: number) => Array.from({ length: times }).map(() => char).join("");

export const addBorder = (borderMap: BorderStyles) =>
	(border: Border | string) =>
		border == "solid"
			? (t: string) =>
				repeat(borderMap.solid.horiz)(t.length + 2) + "\n" +
				borderMap.solid.vert + t + borderMap.solid.vert + "\n" +
				repeat(borderMap.solid.horiz)(t.length + 2)
			: border == "dotted"
			? (t: string) =>
				repeat(borderMap.dotted.horiz)(t.length + 2) + "\n" +
				borderMap.dotted.vert + t + borderMap.dotted.vert + "\n" +
				repeat(borderMap.dotted.horiz)(t.length + 2)
			: (t: string) => t;

const oneOf = (sxs: string[]) => (s: string) => sxs.includes(s);

export const interpretLineSegment = (borderMap: BorderStyles) =>
	(palette: ColorPalette) =>
		(seg: LineSegment): string => {
			const styleParts = seg[0].split(" ");
			let final = seg[1];

			const border = styleParts.find(
				oneOf(["solid", "dotted", "none"]),
			) || "none";

			final = addBorder(borderMap)(border)(final);

			const font = styleParts.find(
				oneOf(Object.keys(fontMap)),
			) as keyof typeof fontMap;

			final = font ? fontMap[font](final) : final;

			const shade = styleParts.find(
				(n) => !isNaN(Number(n)),
			);

			const tone = styleParts.find(
				oneOf([
					"primary",
					"secondary",
					"accent",
					"neutral",
					"base",
					"tertiary",
				]),
			) as Color;

			if (tone) {
				let color: chroma.Color;
				if (shade) {
					color = adjustColor(palette[tone])(shade);
				} else {
					color = palette[tone];
				}

				const [r, g, b] = color.rgb();
				final = colors.rgb24(final, { r, g, b });
			}

			return final;
		};

export const isLineSegment = (k: unknown): k is LineSegment =>
	k instanceof Array
		? k[0] instanceof Array ? false : k.length == 2 ? true : false
		: false;

export const isLineSegmentArray = (k: unknown): k is LineSegment[] =>
	k instanceof Array
		? k[0] instanceof Array && !(k[0][0] instanceof Array) ? true : false
		: false;

export const isBr = (k: unknown): k is typeof Br => k == Br;
export const isCls = (k: unknown): k is typeof Cls => k == Cls;
export const isLine = (k: unknown): k is Line =>
	isLineSegment(k) || isLineSegmentArray(k) || isBr(k) || isCls(k);

export const interpretLine = (borderMap: BorderStyles) =>
	(palette: ColorPalette) =>
		(line: Line) =>
			isLineSegment(line)
				? interpretLineSegment(borderMap)(palette)(line)
				: isLineSegmentArray(line)
				? line.map(interpretLineSegment(borderMap)(palette))
					.reduce(
						(prev, curr) => prev + curr,
						"",
					)
				: isBr(line)
				? ""
				: isCls(line)
				? ansi.clearScreen + ansi.cursorTo(1, 1)
				: "";

export const interpretComponent = (
	{ borders, palette }: { borders: BorderStyles; palette: ColorPalette },
) => (component: Component): string =>
	component
		.map((c) =>
			isLine(c)
				? interpretLine(borders)(palette)(c)
				: interpretComponent({ borders, palette })(c)
		)
		.reduce(
			(prev, curr) => prev + "\n" + curr,
			"",
		);
