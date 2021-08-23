# Payloads are unions of a success type and one or more error types (payloads-are-unions)

A mutation payload must contain a unique success object type with the suffix Success, the base error type BaseUserError, and zero or more specific error types.

## Rule Details

Autofixer not available.

Examples of **incorrect** code for this rule:

```graphql
type Mutation {
  sampleMutation: SampleMutationPayload
}

type SampleMutationPayload {
  result: String
}
```

```graphql
type Mutation {
  sampleMutation: SampleMutationPayload
}

union SampleMutationPayload = String | BaseUserError
```

```graphql
type Mutation {
  sampleMutation: SampleMutationPayload
}

union SampleMutationPayload = MutationSuccess | Int
```

Examples of **correct** code for this rule:

```graphql
type Mutation {
  register(input: RegisterInput!): RegisterPayload
}

union RegisterPayload =
    RegisterSuccess
  | BaseUserError
  | InvalidEmailError
  | PasswordTooWeakError
```
