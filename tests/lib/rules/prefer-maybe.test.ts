/**
 * @fileoverview Prefer isSome(expr) to checking against undefined or null
 * @author Robbie Ostrow
 */

import rule from "../../../lib/rules/prefer-maybe";
import { resolve } from "path";

import { TSESLint } from "@typescript-eslint/experimental-utils";

const ruleTester = new TSESLint.RuleTester({
  parser: resolve(
    __dirname + "../../../../node_modules/@typescript-eslint/parser"
  ),
});

ruleTester.run("prefer-maybe", rule, {
  valid: [
    {
      code: `
export interface fetchUsersVariables {
  userIds: string[];
}`,
    },
    { code: `const x: string | number | string[] = []` },
  ],
  invalid: [
    {
      code: `
export interface fetchUsers_users {
  __typename: "user";
  id: string;
  displayName: string | null;
  givenName: string | null;
  email: string;
  imageUrl: string | null;
}`,
      output: `
export interface fetchUsers_users {
  __typename: "user";
  id: string;
  displayName: Maybe<string>;
  givenName: Maybe<string>;
  email: string;
  imageUrl: Maybe<string>;
}`,
      errors: [
        {
          messageId: "default",
          line: 5,
          column: 16,
        },
        {
          messageId: "default",
          line: 6,
          column: 14,
        },
        {
          messageId: "default",
          line: 8,
          column: 13,
        },
      ],
    },
    {
      code: `
export interface fetchUsers {
  users: (fetchUsers_users | null)[] | null;
}`,
      output: `
export interface fetchUsers {
  users: Maybe<(fetchUsers_users | null)[]>;
}`,
      errors: [
        {
          messageId: "default",
          line: 3,
          column: 10,
        },
        {
          messageId: "default",
          line: 3,
          column: 11,
        },
      ],
    },
    {
      code: `const y: [string | null] = [null, "skfdgjh"]`,
      output: `const y: [Maybe<string>] = [null, "skfdgjh"]`,
      errors: [
        {
          messageId: "default",
          line: 1,
          column: 11,
        },
      ],
    },
    {
      code: `
interface IProps {
  allUsers?: IUser[];
  undeletable?: boolean;
  disabled?: boolean;
  multiselect?: boolean;
  nonUserChoices?: INonUserChoice[];
  prompt?: string;
  selected: string | string[] | null | undefined;
  onSelect(choice: string[] | undefined): void;
}`,
      output: `
interface IProps {
  allUsers?: IUser[];
  undeletable?: boolean;
  disabled?: boolean;
  multiselect?: boolean;
  nonUserChoices?: INonUserChoice[];
  prompt?: string;
  selected: Maybe<string | string[]>;
  onSelect(choice: Maybe<string[]>): void;
}`,
      errors: [
        {
          messageId: "default",
          line: 9,
          column: 13,
        },
        {
          messageId: "default",
          line: 10,
          column: 20,
        },
      ],
    },
    {
      code: `
export const ShouldDisplayTestResult = (
  testResult: ITestResult | undefined,
  showSuccessOnly: boolean
) =>
  testResult !== undefined &&
  testResult.outcome !== "???" &&
  testResult.outcome !== "na" &&
  (!showSuccessOnly || testResult.outcome === "true");`,
      output: `
export const ShouldDisplayTestResult = (
  testResult: Maybe<ITestResult>,
  showSuccessOnly: boolean
) =>
  testResult !== undefined &&
  testResult.outcome !== "???" &&
  testResult.outcome !== "na" &&
  (!showSuccessOnly || testResult.outcome === "true");`,
      errors: [
        {
          messageId: "default",
          line: 3,
          column: 15,
        },
      ],
    },
  ],
});
