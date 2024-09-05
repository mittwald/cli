/** @type {import("ts-jest").JestConfigWithTsJest} * */
export default {
  testEnvironment: "node",
  extensionsToTreatAsEsm: [".ts", ".tsx"],
  moduleNameMapper: {
    "(.+)\\.js": "$1",
  },
  transform: {
    "^.+.tsx?$": [
      "ts-jest",
      {
        useESM: true,
        tsconfig: {
          allowImportingTsExtensions: true,
        },
      },
    ],
  },
};
