import {
  GraphQLInvalidTestCase,
  GraphQLValidTestCase,
  ParserOptions,
} from "@graphql-eslint/eslint-plugin";

import { GraphQLRuleTester } from "@graphql-eslint/eslint-plugin";
import rule from "../../../lib/rules/edges-are-relay-compliant";

const createValid = (schema: string): GraphQLValidTestCase<any[]> => {
  return { code: schema };
};
const createInvalid = (
  schema: string,
  errors: number = 1
): GraphQLInvalidTestCase<any[]> => {
  return {
    code: schema,
    errors: errors,
  };
};

const ruleTester = new GraphQLRuleTester();

const valid1 = /* GraphQL */ `
  type T1 {
    a: String
  }

  type Edge {
    node: T1
    cursor: String
  }
`;

const valid2 = /* GraphQL */ `
  type T1 {
    a: String
  }

  type Edge {
    node: T1!
    cursor: String
  }
`;

const valid3 = /* GraphQL */ `
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
  }
`;

const invalid1 = /* GraphQL */ `
  type MissingNodeEdge {
    notNode: String
    cursor: String
  }
`;

const invalid2 = /* GraphQL */ `
  type ListNodeEdge {
    node: [String]
    cursor: String
  }
`;

const invalid3 = /* GraphQL */ `
  type NonNullListEdge {
    node: [String]!
    cursor: String
  }
`;

const invalid4 = /* GraphQL */ `
  type MissingCursorEdge {
    node: [String]!
  }
`;

const invalid5 = /* GraphQL */ `
  type NotStringCursorEdge {
    node: String!
    edge: Int
  }
`;

ruleTester.runGraphQLTests("edges-are-relay-compliant", rule, {
  valid: [createValid(valid1), createValid(valid2), createValid(valid3)],
  invalid: [
    createInvalid(invalid1),
    createInvalid(invalid2),
    createInvalid(invalid3),
    createInvalid(invalid4, 2),
    createInvalid(invalid5),
  ],
});
