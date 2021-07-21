import { GraphQLRuleTester } from "@graphql-eslint/eslint-plugin";
import rule from "../../../lib/rules/mutations-return-payload";

const ruleTester = new GraphQLRuleTester();

ruleTester.runGraphQLTests("mutations-return-payload", rule, {
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
  invalid: bcd
}
`,
      errors: 1,
    },
    {
      code: `
type Mutation {
  invalid: bcd!
}
`,
      errors: 1,
    },
    {
      code: `
type Mutation {
  invalid: [bcdPayload!]!
}
`,
      errors: 1,
    },
    {
      code: `
type Mutation {
  invalid: [bcdPayload]
}
`,
      errors: 1,
    },
    {
      code: `
type Mutation {
  validMutation: abcPayload
}

extend type Mutation {
  invalidOne: bcd
}
`,
      errors: 1,
    },
    {
      code: `
type Mutation {
  invalidMutation: abcPayload!
}

extend type Mutation {
  another: bcd
}
`,
      errors: 2,
    },
  ],
});
