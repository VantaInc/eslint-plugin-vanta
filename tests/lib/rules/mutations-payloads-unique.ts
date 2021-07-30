import { GraphQLRuleTester } from "@graphql-eslint/eslint-plugin";
import rule from "../../../lib/rules/mutations-payloads-unique";

const ruleTester = new GraphQLRuleTester();

ruleTester.runGraphQLTests("mutations-payloads-unique", rule, {
  valid: [
    {
      code: `
type Mutation {
  validMutation: abcPayload
  anotherOne: bcdPayload
}
`,
    },
    {
      code: `
type Mutation {
  validMutation: abcPayload
}

extend type Mutation {
  anotherOne: bcdPayload
}
`,
    },
  ],
  invalid: [
    {
      code: `
type Mutation {
  firstMutation: abcPayload
  secondMutation: abcPayload
}
`,
      errors: 1,
    },
    {
      code: `
type Mutation {
  firstMutation: abcPayload
  secondMutation: bcdPayload
  thirdMutation: abcPayload
}
`,
      errors: 1,
    },
    {
      code: `
    type Mutation {
      firstMutation: abcPayload
    }

    extend type Mutation {
      secondMutation: abcPayload}
    `,
      errors: 1,
    },
    {
      code: `
    type Mutation {
      firstMutation: abcPayload
      secondMutation: bcdPayload
      thirdMutation: abcPayload
    }

    extend type Mutation {
      fourthMutation: bcdPayload
    }
    `,
      errors: 2,
    },
  ],
});
