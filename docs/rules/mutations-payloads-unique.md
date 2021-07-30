# Mutations must return payload types (mutations-return-payload)

All mutations must return a nullable type with the suffix `Payload`.

## Rule Details

Best practice is to have a unique `Payload` type for every mutation. This allows us to
modify any mutation payload without worrying about breaking others.

Autofixer not available.

Examples of **incorrect** code for this rule:

```graphql
type Mutation {
  sampleMutation: SampleMutationPayload
  secondMutation: SampleMutationPayload
}
```

Examples of **correct** code for this rule:

```graphql
type Mutation {
  sampleMutation: SampleMutationPayload
  secondMutation: SecondMutationPayload
}
```
