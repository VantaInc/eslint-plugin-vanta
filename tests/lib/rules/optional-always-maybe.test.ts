/**
 * @fileoverview Prefer isSome(expr) to checking against undefined or null
 */

import rule from "../../../lib/rules/optional-always-maybe";
import { resolve } from "path";

import { TSESLint } from "@typescript-eslint/experimental-utils";

const ruleTester = new TSESLint.RuleTester({
  parser: resolve(
    __dirname + "../../../../node_modules/@typescript-eslint/parser"
  ),
});

ruleTester.run("optional-always-maybe", rule, {
  valid: [
    {
      code: `
export interface fetchUsersVariables {
  userIds: Maybe<string[]>;
}`,
    },
    {
      code: `
export interface fetchUsersVariables {
  userIds?: Maybe<string[]>;
}`,
    },
    {
      code: `
function a(b: int, x?: Maybe<string>) {
  return 1;
}`,
    },
    {
      code: `
const a = (b: Maybe<int>, x?: Maybe<string>) => {
  return 1;
}`,
    },
  ],
  invalid: [
    {
      code: `
interface IProps {
  allUsers?: IUser[];
  undeletable?: boolean;
  disabled?: Maybe<boolean>;
  multiselect?: boolean;
  nonUserChoices?: INonUserChoice[];
  prompt?: string;
  selected: string | string[] | null | undefined;
  onSelect(choice: string[] | undefined): void;
}`,
      output: `
interface IProps {
  allUsers?: Maybe<IUser[]>;
  undeletable?: Maybe<boolean>;
  disabled?: Maybe<boolean>;
  multiselect?: Maybe<boolean>;
  nonUserChoices?: Maybe<INonUserChoice[]>;
  prompt?: Maybe<string>;
  selected: string | string[] | null | undefined;
  onSelect(choice: string[] | undefined): void;
}`,
      errors: [
        {
          messageId: "default",
          line: 3,
          column: 3,
        },
        {
          messageId: "default",
          line: 4,
          column: 3,
        },
        {
          messageId: "default",
          line: 6,
          column: 3,
        },
        {
          messageId: "default",
          line: 7,
          column: 3,
        },
        {
          messageId: "default",
          line: 8,
          column: 3,
        },
      ],
    },
    {
      code: `
type x = {
  w: string,
  y?: string,
  z?: Maybe<number>,
}`,
      output: `
type x = {
  w: string,
  y?: Maybe<string>,
  z?: Maybe<number>,
}`,
      errors: [{ messageId: "default", line: 4, column: 3 }],
    },
    {
      code: `
function a(b: int, x?: string) {
  return 1;
}`,
      output: `
function a(b: int, x?: Maybe<string>) {
  return 1;
}`,
      errors: [{ messageId: "default", line: 2, column: 20 }],
    },
    {
      code: `
const a = (b: int, x?: string) => {
  return 1;
}`,
      output: `
const a = (b: int, x?: Maybe<string>) => {
  return 1;
}`,
      errors: [{ messageId: "default", line: 2, column: 20 }],
    },
  ],
});
