/**
 * @fileoverview Ensure that imports from server-common/ are absolute instead of relative.
 */

 import rule from "../../../lib/rules/server-common-absolute-import";
 import { resolve } from "path";
 
 import { TSESLint } from "@typescript-eslint/utils";
 
 const ruleTester = new TSESLint.RuleTester({
   parser: resolve(
     __dirname + "../../../../node_modules/@typescript-eslint/parser"
   ),
 });
 
 ruleTester.run("server-common-absolute-import", rule, {
   valid: [
     {
       code: `import * as _ from "lodash"`,
     },
     {
       code: `import { Maybe } from "server-common/base/types/maybe"`,
     },
     {
       code: `import * as maybe from "server-common/base/types/maybe"`,
     },
     {
       code: `import { Maybe } from "../server-common/base/types/maybe"`,
     },
   ],
   invalid: [
     {
       code: `import { Maybe } from "../server-common/src/base/types/maybe"`,
       output: `import { Maybe } from "server-common/base/types/maybe"`,
       errors: [{ messageId: "default", line: 1, column: 1 }],
     },
     {
       code: `import { Maybe } from "../../../../server-common/src/base/types/maybe"`,
       output: `import { Maybe } from "server-common/base/types/maybe"`,
       errors: [{ messageId: "default", line: 1, column: 1 }],
     },
     {
      code: `import { Maybe } from "server-common/src/base/types/maybe"`,
      output: `import { Maybe } from "server-common/base/types/maybe"`,
      errors: [{ messageId: "default", line: 1, column: 1 }],
    },
    {
       code: `
 import {
   Maybe,
   Maybe2
 } from "../server-common/src/base/types/maybe"`,
       output: `
 import {
   Maybe,
   Maybe2
 } from "server-common/base/types/maybe"`,
       errors: [{ messageId: "default", line: 2, column: 2 }],
     },
   ],
 });
