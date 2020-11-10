# Prefer isSome(expr) to checking against undefined or null (null-or-undefined-check)

Never check directly against `undefined` or `null`. Instead, use `isSome`.

## Rule Details

This rule aims to...

Examples of **incorrect** code for this rule:

```js
if (x !== undefined) {
  return x;
}
```

Examples of **correct** code for this rule:

```js
if (isSome(x)) {
  return x;
}
```

## When Not To Use It

If you're dealing with third-party code that logically differentiates between undefined and null.
