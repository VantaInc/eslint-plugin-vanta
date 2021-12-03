/**
 * @fileoverview Prefer isSome(expr) to checking against undefined or null
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
  name: "null-or-undefined-check",
  meta: {
    fixable: "code",
    docs: {
      description: "Use isSome(expr) to check against undefined or null.",
      recommended: "error",
    },
    messages: {
      default: `{{original}} should be {{replacement}}`,
    },
    type: "suggestion",
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    const sourceCode = context.getSourceCode();

    return {
      BinaryExpression(node): void {
        let isEquals: boolean;
        if (node.operator === "==" || node.operator === "===") {
          isEquals = true;
        } else if (node.operator === "!=" || node.operator === "!==") {
          isEquals = false;
        } else {
          return;
        }
        let variableExpr: TSESTree.Expression;
        if (
          (node.left.type === AST_NODE_TYPES.Literal &&
            node.left.value === null) ||
          sourceCode.getText(node.left) === "undefined" // undefined is unfortunately an identifier type; assume that it isn't overridden
        ) {
          variableExpr = node.right;
        } else if (
          (node.right.type === AST_NODE_TYPES.Literal &&
            node.right.value === null) ||
          sourceCode.getText(node.right) === "undefined"
        ) {
          variableExpr = node.left;
        } else {
          return;
        }
        const text = sourceCode.getText(variableExpr);
        const replacement = `${isEquals ? "!" : ""}isSome(${text})`;
        const original = sourceCode.getText(node);
        context.report({
          node,
          data: {
            original,
            replacement,
          },
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
