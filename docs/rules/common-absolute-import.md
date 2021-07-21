# Import common/ from its absolute path (common-absolute-import)

Always import code from common/ from its absolute path.

## Rule Details

This rule aims to ensure that autoimports always work in CI.

Autofixer available.

Examples of **incorrect** code for this rule:

```js
import { Maybe } from "../../common/src/base/maybe";
```

Examples of **correct** code for this rule:

```js
import { Maybe } from "common/base/maybe";
```

## When Not To Use It

If you have _correct_ import paths that look like "../common/src"
