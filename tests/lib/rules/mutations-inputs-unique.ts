import { GraphQLRuleTester } from "@graphql-eslint/eslint-plugin";
import rule from "../../../lib/rules/mutations-inputs-unique";

const ruleTester = new GraphQLRuleTester();

ruleTester.runGraphQLTests("mutations-inputs-unique", rule, {
  valid: [
    {
      code: `
type Mutation {
  validMutation(input: validInput!): abcPayload
  anotherOne(input: anotherInput!): bcdPayload
}
`,
    },
    {
      code: `
type Mutation {
  validMutation(input: validInput!): abcPayload
}

extend type Mutation {
  anotherOne(input: anotherInput!): bcdPayload
}
`,
    },
    {
      code: `
type Mutation {
    validMutation(input: validInput!): abcPayload
    anotherOne(input: anotherInput!): bcdPayload
    thirdOne: cdePayload
}
`,
    },
    {
      code: `
  type Mutation {
      validMutation: abcPayload
      anotherOne: bcdPayload
  }
  `,
    },
  ],
  invalid: [
    {
      code: `
type Mutation {
  firstMutation(input: Input!): abcPayload
  secondMutation(input: Input!): bcdPayload
}
`,
      errors: 1,
    },
    {
      code: `
type Mutation {
  firstMutation(input: abcInput!): abcPayload
  secondMutation(input: bcdInput!): bcdPayload
  thirdMutation(input: abcInput!): cdePayload
}
`,
      errors: 1,
    },
    {
      code: `
    type Mutation {
      firstMutation(input: Input!): abcPayload
    }

    extend type Mutation {
      secondMutation(input: Input!): cdePayload}
    `,
      errors: 1,
    },
    {
      code: `
    type Mutation {
      firstMutation(input: abcInput!): abcPayload
      secondMutation(input: bcdInput!): bcdPayload
      thirdMutation(input: abcInput!): cdePayload
    }

    extend type Mutation {
      fourthMutation(input: bcdInput!): defPayload
    }
    `,
      errors: 2,
    },
  ],
});
