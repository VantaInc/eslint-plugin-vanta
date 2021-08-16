import { GraphQLRuleTester } from "@graphql-eslint/eslint-plugin";
import rule from "../../../lib/rules/all-lists-in-connections";

const ruleTester = new GraphQLRuleTester();

ruleTester.runGraphQLTests("all-lists-in-connections", rule, {
  valid: [
    {
      code: `
type T {
  users: Int!
}
`,
    },
    {
      code: `
type T {
  users: UserConnection
}

type UserConnection {
  pageInfo: PageInfo!
  edges: [UserEdge!]!
  totalCount: Int!
}

type PageInfo {
  endCursor: String
  hasNextPage: Boolean!
  hasPreviousPage: Boolean!
  startCursor: String
}

type UserEdge {
  cursor: String!
  node: User!
}

type User {
  id: ID!
  name: String
}
`,
    },
    {
      code: `
type T {
  users: [User!]! @tinylist
}

type User {
  id: ID!
  name: String
}
`,
    },
  ],
  invalid: [
    {
      code: `
type T {
  users: [User!]!
}

type User {
  id: ID!
  name: String
}
`,
      errors: 1,
    },
    {
      code: `
type T {
  users: [User!]!
  users1: [User]
}

type User {
  id: ID!
  name: String
}
`,
      errors: 2,
    },
    {
      code: `
type T {
  users: [User!]! @tinylist
  users1: [User!]
}

type User {
  id: ID!
  name: String
}
`,
      errors: 1,
    },
    {
      code: `
type T {
  users: UserConnection
}

type UserConnection {
  pageInfo: PageInfo!
  edges: [UserEdge!]!
  notEdges: [UserEdge!]! # this shouldn't be a list
  totalCount: Int!
}

type PageInfo {
  endCursor: String
  hasNextPage: Boolean!
  hasPreviousPage: Boolean!
  startCursor: String
}

type UserEdge {
  cursor: String!
  node: User!
}

type User {
  id: ID!
  name: String
}
`,
      errors: 1,
    },
  ],
});
