# Types reachable from public fields must be public (public-descendants-public)

All types reachable from fields marked as @public are themselves marked as @public.

## Rule Details

Any field or type that is marked with the `@public` directive must only have descendants that are themselves either marked as public or are scalar types. This rule is used to prevent unintended graph traversal vulnerabilities caused by adding a field that bridges a public type to a private one.

Examples of **incorrect** code for this rule:

```graphql
type T1 {
  val: T2 @public
}

type T2 {
  val: String
}
```

Examples of **correct** code for this rule:

```graphql
type T1 {
  val: T2 @public
}

type T2 @public {
  val: String
}
```
