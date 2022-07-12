import { GraphQLRuleTester } from "@graphql-eslint/eslint-plugin";
import rule from "../../../lib/rules/no-one-line-arrow-functions";

const ruleTester = new GraphQLRuleTester();

ruleTester.runGraphQLTests("no-one-line-arrow-functions", rule, {
  valid: [
    {
      code: `
const x = () => {51};
`,
    },
    {
      code: `
const x = () => { return 51; }
`,
    },
    {
    code: `
const x = () => {
    const y = 5;
    return y;
}
`,
    },
  ],
  invalid: [
    {
      code: `
const x = () => { 51; }
`,
      errors: 1,
    },
    {
      code: `
const x = () => { const y = 5; }
`,
      errors: 1,
    },
  ],
});
