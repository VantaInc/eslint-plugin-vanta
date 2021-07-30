# Mutations must take single input types (mutation-input-type)

All mutations must take no arguments or a single non-nullable argument named
input of a type with the suffix `Input`.

## Rule Details

Best practice is to have a unique `Input` type for every mutation. This is easier
to use on the client side and allows us to add new fields to a mutation
input without breaking the API.

If a mutation really doesn't need arguments (eg only needs domain/user from the
login context) that's fine too.

Autofixer not available.

Examples of **incorrect** code for this rule:

```graphql
type Mutation {
  sampleMutation(arg1: Int, arg2: String): SampleMutationPayload
}
```

```graphql
type Mutation {
  sampleMutation(input: [SampleMutationInput]): SampleMutationPayload
}
```

```graphql
type Mutation {
  sampleMutation(parameters: SampleMutationInput!): SampleMutationPayload
}
```

Examples of **correct** code for this rule:

```graphql
type Mutation {
  sampleMutation(input: SampleMutationInput!): SampleMutationPayload
  arglessMutation: ArglessMutationPayload
}
```

## When Not To Use It

If you have a mutation that you're sure will never need to change.
