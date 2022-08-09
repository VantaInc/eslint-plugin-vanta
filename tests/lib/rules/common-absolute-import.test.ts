/**
 * @fileoverview Ensure that imports from common/ are absolute instead of relative.
 */

import rule from "../../../lib/rules/common-absolute-import";
import { resolve } from "path";

import { TSESLint } from "@typescript-eslint/utils";

const ruleTester = new TSESLint.RuleTester({
  parser: resolve(
    __dirname + "../../../../node_modules/@typescript-eslint/parser"
  ),
});

ruleTester.run("common-absolute-import", rule, {
  valid: [
    {
      code: `import * as _ from "lodash"`,
    },
    {
      code: `import { Maybe } from "common/base/types/maybe"`,
    },
    {
      code: `import * as maybe from "common/base/types/maybe"`,
    },
    {
      code: `import { Maybe } from "../common/base/types/maybe"`,
    },
  ],
  invalid: [
    {
      code: `import { Maybe } from "../common/src/base/types/maybe"`,
      output: `import { Maybe } from "common/base/types/maybe"`,
      errors: [{ messageId: "default", line: 1, column: 1 }],
    },
    {
      code: `import { Maybe } from "../../../../common/src/base/types/maybe"`,
      output: `import { Maybe } from "common/base/types/maybe"`,
      errors: [{ messageId: "default", line: 1, column: 1 }],
    },
    {
      code: `import { Maybe } from "common/src/base/types/maybe"`,
      output: `import { Maybe } from "common/base/types/maybe"`,
      errors: [{ messageId: "default", line: 1, column: 1 }],
    },
    {
      code: `
import {
  Maybe,
  Maybe2
} from "../common/src/base/types/maybe"`,
      output: `
import {
  Maybe,
  Maybe2
} from "common/base/types/maybe"`,
      errors: [{ messageId: "default", line: 2, column: 1 }],
    },
  ],
});
