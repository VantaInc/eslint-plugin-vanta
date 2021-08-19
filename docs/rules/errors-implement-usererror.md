# Errors should implement UserError

A type should implement the UserError interface if and only if its name ends with Error.

## Rule Details

Examples of *correct* code for this rule:

```graphql
type Mutation {
  sampleMutation(arg1: Int, arg2: String): SampleMutationPayload
}
```


## When Not To Use It

