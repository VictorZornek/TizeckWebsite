# Responsiveness Guidelines

This project uses a responsive design system built on `styled-components`.

## Breakpoints

```
xs: 320px
sm: 375px
md: 768px
lg: 1024px
xl: 1280px
xxl: 1440px
```

Use the utilities from `@/styles/media`:

```ts
import { up, down } from "@/styles/media";

${up("lg")} { ... } // min-width media query
${down("md")} { ... } // max-width media query
```

## Container

Wrap page sections with the `Container` component to center content and limit width:

```tsx
import { Container } from "@/components/Container";
```

## Grid utilities

For lists of cards use a responsive grid:

```css
.wrapper {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.6rem;
  ${up("md")} { grid-template-columns: repeat(2, 1fr); }
  ${up("lg")} { grid-template-columns: repeat(3, 1fr); }
  ${up("xl")} { grid-template-columns: repeat(4, 1fr); }
}
```

## Fluid typography

Typography uses `clamp()` to scale between mobile and desktop:

```css
h1 { font-size: clamp(2rem, 1.2rem + 2vw, 3.2rem); }
p { font-size: clamp(1.4rem, 1rem + 0.5vw, 1.8rem); }
```

## Checklist

- [x] 320px
- [x] 375px
- [x] 768px
- [x] 1024px
- [x] 1280px
- [x] 1440px
