# Mutations must return payload types (mutations-return-payload)

All mutations must return a nullable type with the suffix `Payload`.

## Rule Details

Best practice is to have a unique `Payload` type for every mutation. This allows us to add new fields to a mutation
response without breaking the API.

Autofixer not available.

Examples of **incorrect** code for this rule:

```graphql
type Mutation {
  sampleMutation: Int
}
```

```graphql
type Mutation {
  sampleMutation: SampleMutationPayload!
}
```

```graphql
type Mutation {
  sampleMutation: [SampleMutationPayload]
}
```

Examples of **correct** code for this rule:

```graphql
type Mutation {
  sampleMutation: SampleMutationPayload
}
```

## When Not To Use It

If you have a mutation that you're sure will never need to change.
