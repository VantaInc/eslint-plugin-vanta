import { GraphQLRuleTester } from "@graphql-eslint/eslint-plugin";
import rule from "../../../lib/rules/connections-are-relay-compliant";

const ruleTester = new GraphQLRuleTester();

ruleTester.runGraphQLTests("connections-are-relay-compliant", rule, {
  valid: [
    {
      code: `
type Connection {
  edges: [testEdge]
  pageInfo: PageInfo!
}
`,
    },
    {
      code: `
type Connection {
  edges: [testEdge!]!
  pageInfo: PageInfo!
}
`,
    },
    {
      code: `
type Connection {
  edges: [testEdge]!
  pageInfo: PageInfo!
}
`,
    },
    {
      code: `
type Connection {
  edges: [testEdge!]
  pageInfo: PageInfo!
}
`,
    },
  ],
  invalid: [
    {
      code: `
    type MissingEdgesConnection {
      pageInfo: PageInfo!
    }`,
      errors: 1,
    },
    {
      code: `
      type EdgesNotListConnection {
        edges: testEdge
        pageInfo: PageInfo!
      }`,
      errors: 1,
    },
    {
      code: `
      type MissingPageInfoConnection {
        edges: [testEdge]
      }`,
      errors: 1,
    },

    {
      code: `
      type PageInfoNotNonnullableConnection {
        edges: [testEdge]
        pageInfo: PageInfo
      }`,
      errors: 1,
    },
    {
      code: `
      type PageInfoNotObjectTypeConnection {
        edges: [test]
        pageInfo: [test]!
      }`,
      errors: 2,
    },
    {
      code: `
      type EdgeDoesntEndWithEdgeConnection {
        edges: [testEdgeNot!]
        pageInfo: PageInfo!
      }`,
      errors: 1,
    },
    {
      code: `
      type PageInfoWrongTypeConnection {
        edges: [testNotEdge!]
        pageInfo: notPageInfo!
      }
`,
      errors: 1,
    },
  ],
});
