import terser from "@rollup/plugin-terser";
// import copy from 'rollup-plugin-copy';

export default {
  input: "src/index.js",
  output: [
    {
      file: "dist/PodsTooltip.js",
      format: "esm",
      name: "PodsTooltip",
      sourcemap: true,
    },
    {
      file: "dist/PodsTooltip.min.js",
      format: "esm",
      name: "PodsTooltip",
      plugins: [terser()],
      sourcemap: true,
    },
  ],
  // plugins: [
  //   copy({
  //     targets: [
  //       { src: 'src/types.js', dest: 'dist'}
  //     ]
  //   })
  // ]
};
