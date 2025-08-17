import styled from "styled-components";
import { up } from "@/styles/media";

export const Container = styled.div`
  width: 100%;
  margin: 0 auto;
  padding-inline: 1.6rem;
  ${up("lg")} { max-width: 1024px; padding-inline: 2rem; }
  ${up("xl")} { max-width: 1280px; }
  ${up("xxl")} { max-width: 1440px; }
`;
