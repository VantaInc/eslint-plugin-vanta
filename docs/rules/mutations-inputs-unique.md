# Mutations must return unique input types (mutations-inputs-unique)

All mutations must return a unique input type

## Rule Details

Best practice is to have a unique `Input` type for every mutation. This allows us to
modify any mutation input without worrying about breaking others.

Autofixer not available.

Examples of **incorrect** code for this rule:

```graphql
type Mutation {
  sampleMutation(input: SampleMutationInput!): SampleMutationPayload
  secondMutation(input: SampleMutationInput!): SecondMutationPayload
}
```

Examples of **correct** code for this rule:

```graphql
type Mutation {
  sampleMutation(input: SampleMutationInput!): SampleMutationPayload
  secondMutation(input: SecondMutationInput!): SecondMutationPayload
  arglessMutation: ThirdMutationPayload
}
```
