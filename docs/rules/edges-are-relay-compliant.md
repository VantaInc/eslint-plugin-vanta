# Edges are Relay compliant

All Edges must be compliant with the Relay GraphQL pagination spec.

## Rule Details

Details [here](https://relay.dev/graphql/connections.htm#sec-Edge-Types).

Autofixer not available.

Examples of **incorrect** code for this rule:

```graphql
type SampleEdge {
  notNode: T1
  notCursor: Int
}
```

```graphql
type SampleEdge {
  node: [T1]
  cursor: Int
}
```

Examples of **correct** code for this rule:

```graphql
type SampleEdge {
  node: T1
  cursor: String
}
```