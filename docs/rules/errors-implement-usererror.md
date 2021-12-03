# Errors should implement UserError

A type should implement the UserError interface if and only if its name ends with Error.

## Rule Details

Examples of *correct* code for this rule:

```graphql
type BaseUserError implements UserError {
  message: String!
  code: ErrorCode!
}
```

```graphql
type PasswordTooWeakError implements UserError {
  message: String!
  code: ErrorCode!
  passwordRules: [String!]!
}
```

Examples of *incorrect* code for this rule:

```graphql
type NotAnErrorType implements UserError {
  message: String!
  code: ErrorCode!
  otherStuff: String!
}
```

```graphql
type PasswordTooWeakError {
  passwordRules: [String!]!
}
```

## When Not To Use It
Do not use this for developer errors. Then again, you should probably revisit the [GraphQL style guide](https://github.com/VantaInc/obsidian/blob/main/web/server/src/graphql/style.md#22-guidelines-for-errors) if you're adding developer error graphql types.
