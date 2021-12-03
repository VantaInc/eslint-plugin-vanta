/**
 * @fileoverview Ensure that all optional properties and identifiers are of type Maybe<T>.
 */

import {
  AST_NODE_TYPES,
  TSESTree,
  ESLintUtils,
} from "@typescript-eslint/experimental-utils";

const rule = ESLintUtils.RuleCreator(
  (ruleName) =>
    `https://github.com/VantaInc/eslint-plugin-vanta/blob/main/docs/rules/${ruleName}.md`
)<unknown[], "default">({
  name: "optional-always-maybe",
  meta: {
    fixable: "code",
    docs: {
      description: "Optional properties must be of type Maybe<T>",
      recommended: "error",
    },
    messages: {
      default: "`{{property}}` should be changed to `Maybe<{{property}}>`",
    },
    type: "suggestion",
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    const sourceCode = context.getSourceCode();

    function introduceMaybe(
      node: TSESTree.TSPropertySignature | TSESTree.Identifier
    ): void {
      if (!node.optional || !node.typeAnnotation?.typeAnnotation) {
        return;
      }

      const typeAnnotation = node.typeAnnotation.typeAnnotation;

      if (
        typeAnnotation.type === AST_NODE_TYPES.TSTypeReference &&
        typeAnnotation.typeName.type === AST_NODE_TYPES.Identifier &&
        typeAnnotation.typeName.name === "Maybe"
      ) {
        return;
      }

      context.report({
        node,
        messageId: "default",
        data: {
          property: sourceCode.getText(typeAnnotation),
        },
        fix(fixer) {
          return [
            fixer.insertTextBefore(typeAnnotation, "Maybe<"),
            fixer.insertTextAfter(typeAnnotation, ">"),
          ];
        },
      });
    }

    return {
      TSPropertySignature: introduceMaybe,
      Identifier: introduceMaybe,
    };
  },
});

module.exports = rule;

export default rule;
