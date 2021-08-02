import { GraphQLRuleTester } from "@graphql-eslint/eslint-plugin";
import rule from "../../../lib/rules/mutations-input-type";

const ruleTester = new GraphQLRuleTester();

ruleTester.runGraphQLTests("mutations-input-type", rule, {
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
  arglessMutation: arglessPayload
}

extend type Mutation {
  anotherOne(input: anotherInput!): bcdPayload
}
`,
    },
  ],
  invalid: [
    {
      code: `
type Mutation {
  invalid(arg1: Boolean, arg2: String): bcdPayload
}
`,
      errors: 1,
    },
    {
      code: `
type Mutation {
  invalid(input: [abcInput]): bcdPayload
}
`,
      errors: 1,
    },
    {
      code: `
type Mutation {
  invalid(input: abcInput): bcdPayload
}
`,
      errors: 1,
    },
    {
      code: `
type Mutation {
  invalid(arg: abcInput!): bcdPayload
}
`,
      errors: 1,
    },
    {
      code: `
type Mutation {
  invalid(input: abcArgument!): bcdPayload
}
`,
      errors: 1,
    },
    {
      code: `
type Mutation {
  validMutation(input: validInput!): abcPayload
}

extend type Mutation {
  invalidOne(arg1: Boolean, arg2: String): bcdPayload
}
`,
      errors: 1,
    },
    {
      code: `
type Mutation {
  invalidMutation(input: abcArgument!): abcPayload
}

extend type Mutation {
  another(input: bcdInput!, otherInfo: String): bcdPayload
}
`,
      errors: 2,
    },
  ],
});
