import { GraphQLRuleTester } from "@graphql-eslint/eslint-plugin";
import rule from "../../../lib/rules/payloads-are-unions";

const ruleTester = new GraphQLRuleTester();

ruleTester.runGraphQLTests("payloads-are-unions", rule, {
  valid: [
    {
      code: `
union abcPayload = abcSuccess | BaseUserError
`,
    },
    {
      code: `
union abcPayload = abcSuccess | BaseUserError | abcSpecificError
union bcdPayload = bcdSuccess | BaseUserError
`,
    },
  ],
  invalid: [
    {
      code: `
type abcPayload {
    result: Int
}
`,
      errors: 1,
    },
    {
      code: `
union abcPayload = String | BaseUserError
`,
      errors: 2,
    },
    {
      code: `
union abcPayload = abcSuccess | Int
`,
      errors: 2,
    },
    {
      code: `
union abcPayload = abcSuccess | bcdSuccess | BaseUserError
`,
      errors: 1,
    },
    {
      code: `
union abcPayload = abcSuccess | BaseUserError | Boolean
`,
      errors: 1,
    },
    {
      code: `
union abcPayload = abcResult | BaseUserError
`,
      errors: 2,
    },
  ],
});
