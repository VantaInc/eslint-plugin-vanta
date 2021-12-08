/**
 * @fileoverview Follow naming conventions for Mongoose models and schemas.
 * For a collection X, we use the following naming conventions:
 *
 * XFields = typeof schema;
 * XDoc = XFields & mongoose.Document;
 * XModel = model<XDoc>(schema, options);
 */

import rule from "../../../lib/rules/mongoose-naming-convention";
import { resolve } from "path";

import { TSESLint } from "@typescript-eslint/experimental-utils";

const ruleTester = new TSESLint.RuleTester({
  parser: resolve(
    __dirname + "../../../../node_modules/@typescript-eslint/parser"
  ),
});

ruleTester.run("mongoose-naming-convention", rule, {
  valid: [
    {
      code: `type Foo = Bar & otherModule.Document;`,
    },
    {
      code: `type CollectionDoc = CollectionFields & mongoose.Document;`,
    },
    {
      code: `type CollectionDoc<S,G> = CollectionFields<S,G> & mongoose.Document;`,
    },
    {
      code: `type CollectionDoc<S,G> = {} & mongoose.Document;`,
    },
    {
      code: `const UserModel = model<UserDoc>("User", UserSchema);`,
    },
    {
      code: `const DocumentModel = model<DocumentDoc>("Document", DocumentSchema);`,
    },
  ],
  invalid: [
    {
      code: `type Collection = CollectionFields & mongoose.Document;`,
      errors: [
        {
          messageId: "mongooseDocumentNaming",
          line: 1,
          column: 6,
        },
      ],
    },
    {
      code: `type Collection = CollectionFields & Document;`,
      errors: [
        {
          messageId: "mongooseDocumentNaming",
          line: 1,
          column: 6,
        },
      ],
    },
    {
      code: `type CollectionDoc = Collection & mongoose.Document;`,
      errors: [
        {
          messageId: "mongooseFieldsNaming",
          line: 1,
          column: 22,
        },
      ],
    },
    {
      code: `type CollectionDoc = ColectionFields & mongoose.Document;`,
      errors: [
        {
          messageId: "mongooseDocumentFieldsMismatch",
          line: 1,
          column: 22,
        },
      ],
    },
    {
      code: `const User = model<UserDoc>("User", UserSchema);`,
      errors: [
        {
          messageId: "mongooseModelNaming",
          line: 1,
          column: 7,
        },
      ],
    },
    {
      code: `const UserModel = model<UserDocument>("User", UserSchema);`,
      errors: [
        {
          messageId: "mongooseModelDocumentTypeNaming",
          line: 1,
          column: 25,
        },
      ],
    },
    {
      code: `const UserModel = model<OtherDoc>("User", UserSchema);`,
      errors: [
        {
          messageId: "mongooseModelDocumentTypeMismatch",
          line: 1,
          column: 25,
        },
      ],
    },
  ],
});
