import { GraphQLRuleTester } from "@graphql-eslint/eslint-plugin";
import rule from "../../../lib/rules/errors-implement-usererror";

const ruleTester = new GraphQLRuleTester();

ruleTester.runGraphQLTests("errors-extend-usererror", rule, {
  valid: [
    {
      code: `
type BaseUserError implements UserError {
  message: String!
  code: ErrorCode!
}
`,
    },
    {
      code: `
type PasswordTooWeakError implements UserError {
  message: String!
  code: ErrorCode!
  passwordRules: [String!]!
}
`,
    },
    {
      code: `
type NonErrorType implements SomethingElse {
  cat: String!
}
`,
    },
    {
      code: `
type PasswordTooWeakError implements UserError & OtherType {
  message: String!
  code: ErrorCode!
  passwordRules: [String!]!
}
`,
    },
    {
      code: `
type NotAnErrorType {
  otherStuff: String!
}
`,
    },
    {
      code: `
extend type NotErrorType implements SomethingElse {
  passwordRules: [String!]!
}
`,
    },
    {
      code: `
extend type Error implements SomethingElse {
  passwordRules: [String!]!
}
`,
    },
  ],
  invalid: [
    {
      code: `
type NotAnErrorType implements UserError {
  message: String!
  code: ErrorCode!
  otherStuff: String!
}
`,
      errors: 1,
    },
    {
      code: `
type NotAnErrorType implements OtherType & UserError {
  message: String!
  code: ErrorCode!
  otherStuff: String!
}
`,
      errors: 1,
    },

    {
      code: `
type PasswordTooWeakError {
  passwordRules: [String!]!
}
`,
      errors: 1,
    },
    {
      code: `
type PasswordTooWeakError implements OtherType {
  passwordRules: [String!]!
}
`,
      errors: 1,
    },
    {
      code: `
extend type NotErrorType implements UserError {
  passwordRules: [String!]!
}
`,
      errors: 1,
    },
  ],
});
