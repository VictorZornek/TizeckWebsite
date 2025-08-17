import theme from "./theme";

type Keys = keyof typeof theme.BREAKPOINTS;

export const up = (key: Keys) => `@media (min-width:${theme.BREAKPOINTS[key]}px)`;

export const down = (key: Keys) => `@media (max-width:${theme.BREAKPOINTS[key]}px)`;