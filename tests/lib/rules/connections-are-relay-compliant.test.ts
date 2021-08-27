import { GraphQLRuleTester } from "@graphql-eslint/eslint-plugin";
import rule from "../../../lib/rules/connections-are-relay-compliant";

const ruleTester = new GraphQLRuleTester();

ruleTester.runGraphQLTests("connections-are-relay-compliant", rule, {
  valid: [
    {
      code: `
type Connection {
  edges: [testEdge]
  pageInfo: testPageInfo!
}            
`,
    },
  ],
  invalid: [
    {
      code: `
    type MissingEdgesConnection {
      pageInfo: test!
    }`,
      errors: 1,
    },
    {
      code: `
      type EdgesNotListConnection {
        edges: test
        pageInfo: test!
      }`,
      errors: 1,
    },
    {
      code: `
      type MissingPageInfoConnection {
        edges: [test]
      }`,
      errors: 1,
    },

    {
      code: `
      type PageInfoNotNonnullableConnection {
        edges: [test]
        pageInfo: test
      }`,
      errors: 1,
    },
    {
      code: `
      type PageInfoNotObjectTypeConnection {
        edges: [test]
        pageInfo: [test]!
      }`,
      errors: 1,
    },
  ],
});
