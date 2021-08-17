# All long lists must be paginated (all-lists-in-connections)

## Rule Details

All lists must either be paginated according to the Relay spec or explicitly marked as not needing pagination because they're guaranteed to be small.

Use the `@tinylist` directive to mark a list as small and not in need of pagination.

Examples of **incorrect** code for this rule:

```graphql
type T1 {
  val: [T2]
}
```

Examples of **correct** code for this rule:

_Edges on connections can be lists_

```graphql
type UserConnection {
  pageInfo: PageInfo!
  edges: [UserEdge!]! # this is ok to be a list, since it's an edge on a connection
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
  ...
}
```

_Fields can be whitelisted to be lists_

```graphql
type T1 {
  val: [T2] @tinylist
}
```
