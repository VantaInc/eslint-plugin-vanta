# Optional properties must be of type Maybe<T>; (optional-always-maybe)

All optional properties and parameters should be of type `Maybe<T>`.

## Rule Details

This rule aims to ensure that we don't treat `null` and `undefined` differently.

Autofixer available.

Examples of **incorrect** code for this rule:

```ts
interface x {
  y?: string;
}

function f(x?: number) {}
```

Examples of **correct** code for this rule:

```ts
interface x {
  y?: Maybe<string>;
}

function f(x?: Maybe<number>) {}
```

## When Not To Use It

With third-party software that needs to differentiate between `null` and `undefined`.
