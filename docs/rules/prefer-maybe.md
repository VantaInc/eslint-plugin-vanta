# Prefer Maybe<T> to T | null or T | undefined (prefer-maybe)

Don't inculde `null` or `undefined` in a union. Instad, wrap the type in `Maybe`.

## Rule Details

This rule aims to ensure that we don't treat `null` and `undefined` differently.

Autofixer available.

Examples of **incorrect** code for this rule:

```js
const x: string | null = "hello";
```

Examples of **correct** code for this rule:

```js
const x: Maybe<string> = "hello";
```

## When Not To Use It

With third-party software that needs to differentiate between `null` and `undefined`.

## Further Reading
