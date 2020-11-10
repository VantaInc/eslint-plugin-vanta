/**
 * @fileoverview Prefer isSome(expr) to checking against undefined or null
 * @author Robbie Ostrow
 */

import rule from "../../../lib/rules/null-or-undefined-check";
import { resolve } from "path";

import { TSESLint } from "@typescript-eslint/experimental-utils";

const ruleTester = new TSESLint.RuleTester({
  parser: resolve(
    __dirname + "../../../../node_modules/@typescript-eslint/parser"
  ),
});

ruleTester.run("null-or-undefined-check", rule, {
  valid: [
    {
      code: "isSome(x)",
    },
    {
      code: "x == true",
    },
    {
      code: "isSome(undefined)",
    },
  ],
  invalid: [
    {
      code: "x == null",
      output: "!isSome(x)",
      errors: [
        {
          messageId: "default",
          line: 1,
          column: 1,
        },
      ],
    },
    {
      code: "x === null",
      output: "!isSome(x)",
      errors: [
        {
          messageId: "default",
          line: 1,
          column: 1,
        },
      ],
    },
    {
      code: "null == x",
      output: "!isSome(x)",
      errors: [
        {
          messageId: "default",
          line: 1,
          column: 1,
        },
      ],
    },
    {
      code: "null === x",
      output: "!isSome(x)",
      errors: [
        {
          messageId: "default",
          line: 1,
          column: 1,
        },
      ],
    },
    {
      code: "x == undefined",
      output: "!isSome(x)",
      errors: [
        {
          messageId: "default",
          line: 1,
          column: 1,
        },
      ],
    },
    {
      code: "x === undefined",
      output: "!isSome(x)",
      errors: [
        {
          messageId: "default",
          line: 1,
          column: 1,
        },
      ],
    },
    {
      code: "x !== undefined",
      output: "isSome(x)",
      errors: [
        {
          messageId: "default",
          line: 1,
          column: 1,
        },
      ],
    },
    {
      code: "x !== null",
      output: "isSome(x)",
      errors: [
        {
          messageId: "default",
          line: 1,
          column: 1,
        },
      ],
    },
    {
      code: `
const x = null;
if (x == null) {
  return x;
}`,
      output: `
const x = null;
if (!isSome(x)) {
  return x;
}`,
      errors: [
        {
          messageId: "default",
          line: 3,
          column: 5,
        },
      ],
    },
    {
      code: `
if (x == undefined || Math.random() > 0.5 || z == null) {
  console.log("yo");
}`,
      output: `
if (!isSome(x) || Math.random() > 0.5 || !isSome(z)) {
  console.log("yo");
}`,
      errors: [
        {
          messageId: "default",
          line: 2,
          column: 5,
        },
        {
          messageId: "default",
          line: 2,
          column: 46,
        },
      ],
    },
  ],
});
