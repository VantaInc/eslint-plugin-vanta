/**
 * @fileoverview Prefer Maybe<T> to T | null or T | undefined.
 */

import {
  AST_NODE_TYPES,
  ESLintUtils,
} from "@typescript-eslint/experimental-utils";

const NOTHING_TYPES = [
  AST_NODE_TYPES.TSNullKeyword,
  AST_NODE_TYPES.TSUndefinedKeyword,
];

const rule = ESLintUtils.RuleCreator(
  (ruleName) =>
    `https://github.com/VantaInc/eslint-plugin-vanta/blob/main/docs/rules/${ruleName}.md`
)<unknown[], "default">({
  name: "prefer-maybe",
  meta: {
    fixable: "code",
    docs: {
      description: "Prefer Maybe<T> to T | null or T | undefined.",
      recommended: "error",
    },
    messages: {
      default: "Prefer Maybe<T> to T | null or T | undefined.",
    },
    type: "suggestion",
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    const sourceCode = context.getSourceCode();

    return {
      TSUnionType(node) {
        const unionWithoutNothing = node.types.filter(
          (t) => !NOTHING_TYPES.includes(t.type)
        );
        if (node.types.length === unionWithoutNothing.length) {
          return;
        }
        const unionWithoutNothingString = unionWithoutNothing
          .map((t) => sourceCode.getText(t))
          .join(" | ");

        const replacement = `Maybe<${unionWithoutNothingString}>`;

        context.report({
          node,
          messageId: "default",
          fix(fixer) {
            return [fixer.replaceText(node, replacement)];
          },
        });
      },
    };
  },
});

module.exports = rule;

export default rule;
