import { nodeResolve } from "@rollup/plugin-node-resolve"
import { resolve } from "path"
import serve from "rollup-plugin-serve"
import ts from "rollup-plugin-typescript2"

export default {
  input: "src/index.ts",
  output: {
    file: resolve(__dirname, "dist/bundle.js"),
    sourcemap: true,
    format: "iife",
  },
  plugins: [
    nodeResolve({
      extensions: [".js", ".ts"],
    }),
    ts({
      tsconfig: resolve(__dirname, "tsconfig.json"),
    }),
    serve({
      open: true,
      port: 3000,
      contentBase: "",
      openPage: "/public/index.html",
    }),
  ],
}
