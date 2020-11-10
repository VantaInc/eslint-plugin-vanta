# Prefer isSome(expr) to checking against undefined or null (null-or-undefined-check)

Never check directly against `undefined` or `null`. Instead, use `isSome`.

## Rule Details

This rule aims to ensure that we don't treat `undefined` and `null` differently in our code, since doing so tends to cause confusion.

Autofixer available.

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

If you're dealing with third-party code that needs to differentiate between undefined and null.
