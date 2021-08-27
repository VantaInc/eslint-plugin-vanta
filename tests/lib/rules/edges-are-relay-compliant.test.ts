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
}
`),
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
      errors: 1,
    },
    {
      ...useSchema(`
      type NotStringCursorEdge {
        node: [String]!
        edge: Int
      }`),
      errors: 1,
    }
  ],
});
