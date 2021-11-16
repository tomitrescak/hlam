module.exports = function (w) {
  return {
    files: [
      "components/**/*.ts",
      "!components/**/*.test.ts",
      "components/**/*.json",
      "components/**/*.txt",
      "components/**/*.pddl",
    ],
    tests: ["components/**/*.test.ts"],
    compilers: {
      "**/*.ts": w.compilers.typeScript({ module: "commonjs" }),
    },
    env: {
      type: "node",
    },
  };
};
