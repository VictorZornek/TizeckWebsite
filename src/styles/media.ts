import { theme } from "./theme";

type Keys = keyof typeof theme.BREAKPOINTS;

export const up = (k: Keys) => `@media (min-width:${theme.BREAKPOINTS[k]}px)`;
export const down = (k: Keys) => `@media (max-width:${theme.BREAKPOINTS[k]}px)`;
