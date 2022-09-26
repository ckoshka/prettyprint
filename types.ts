import { chroma } from "./deps.ts";

export type Color = "primary" | "secondary" | "tertiary" | "accent" | "neutral" | "base";

export type FontStyle = "italic" | "bold" | "underlined";

export type Shade =
	| "0"
	| "10"
	| "20"
	| "30"
	| "40"
	| "50"
	| "60"
	| "70"
	| "80"
	| "90"
	| "100";

export type Border = "solid" | "dotted" | "none";

export type Opt<S extends string> = `${S}` | `${S} ` | "";

export type LineSegment = [
	`${Opt<Color>}${Opt<Shade>}${Opt<FontStyle>}${Opt<Border>}`,
	string,
];

export type Line = LineSegment | LineSegment[] | typeof Br | typeof Cls;

export type Component = (Line | Component)[];

export type Renderable = {
	data: Component;
	sticky: boolean;
}

export const Br = Symbol("linebreak");
export const Cls = Symbol('clearscreen');

export type StyledPrinterEffect = {
	render: (a0: Renderable) => void | Promise<void>;
};

export type ColorPalette = Record<Color, chroma.Color>;

export type BorderStyle = {
	vert: string;
	horiz: string;
};

export type BorderStyles = {
	solid: BorderStyle;
	dotted: BorderStyle;
};