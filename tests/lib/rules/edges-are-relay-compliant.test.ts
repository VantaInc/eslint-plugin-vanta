import { ParserOptions } from "@graphql-eslint/eslint-plugin";

import { GraphQLRuleTester } from "@graphql-eslint/eslint-plugin";
import rule from "../../../lib/rules/edges-are-relay-compliant";

const ruleTester = new GraphQLRuleTester();

const useSchema = (
  schema: string
): { code: string; parserOptions: ParserOptions } => {
  return {
    parserOptions: { schema },
    code: schema,
  };
};

ruleTester.runGraphQLTests("edges-are-relay-compliant", rule, {
  valid: [
    useSchema(`
type T1 {
  a: String
}

type Edge {
    node: T1
    cursor: String
}`),
    useSchema(`
type T1 {
  a: String
}

type Edge {
    node: T1!
    cursor: String
}`),
    useSchema(`
type osquery {
  active: Boolean!
  domainId: ID
  hostIdentifier: String!
  id: ID!
  node_key: String!
  platform: String!
}

type EndpointEdge {
  cursor: String!
  node: osquery!
}`),
  ],
  invalid: [
    {
      ...useSchema(`
    type MissingNodeEdge {
        notNode: String
        cursor: String
    }`),

      errors: 1,
    },
    {
      ...useSchema(`
      type ListNodeEdge {
        node: [String]
        cursor: String
      }`),
      errors: 1,
    },
    {
      ...useSchema(`
      type NonNullListEdge {
        node: [String]!
        cursor: String
      }`),
      errors: 1,
    },
    {
      ...useSchema(`
      type MissingCursorEdge {
        node: [String]!
      }`),
      errors: 2,
    },
    {
      ...useSchema(`
      type NotStringCursorEdge {
        node: String!
        edge: Int
      }`),
      errors: 1,
    },
  ],
});
