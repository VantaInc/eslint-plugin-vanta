# Mutations must return unique payload types (mutations-payloads-unique)

All mutations must return a unique payload type

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
