# Connections are Relay compliant

All Connections must be compliant with the Relay GraphQL pagination spec.

## Rule Details

Details [here](https://relay.dev/graphql/connections.htm#sec-Connection-Types).

Autofixer not available.

Examples of **incorrect** code for this rule:

```graphql
type SampleConnection {
  notEdges: [SampleEdge]
  notPageInfo: [SamplePageInfo]
}
```

```graphql
type SampleConnection {
  edges: SampleEdge
  pageInfo: SamplePageInfo
}
```

Examples of **correct** code for this rule:

```graphql
type SampleConnection {
  edges: [SampleEdge]
  pageInfo: SamplePageInfo!
}
```
