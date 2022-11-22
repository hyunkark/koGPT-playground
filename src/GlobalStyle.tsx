import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  *, *::before, *::after {
    box-sizing: border-box;
  }

  @font-face {
    font-family: 'Mona Sans';
    src:
      url('Mona-Sans.woff2') format('woff2 supports variations'),
      url('Mona-Sans.woff2') format('woff2-variations');
    font-weight: 200 900;
    font-stretch: 75% 125%;
  }

  body {
    font-family: 'Mona Sans', sans-serif;
    line-height: 1.5;
  }
`;

export default GlobalStyle;
