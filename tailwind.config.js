import { defineConfig } from "vite-plugin-windicss"
import colors from "windicss/colors"
import lineClampPlugin from "windicss/plugin/line-clamp"

export default defineConfig({
  plugins: [lineClampPlugin],
  theme: {
    colors: {
      black: colors.black,
      white: colors.white,
      gray: colors.warmGray,
      red: colors.red,
      yellow: colors.yellow,
      green: colors.green,
      blue: colors.blue
    },
    fontFamily: {
      sans: ["Rubik", "sans-serif"],
      mono: ["IBM Plex Mono", "monospace"]
    },
    fontWeight: {
      normal: 400,
      bold: 700
    },
    flexGrow: {
      0: 0,
      DEFAULT: 1,
      2: 2
    },
    extend: {
      boxShadow: {
        umd: "0 -4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
      }
    }
  }
})
