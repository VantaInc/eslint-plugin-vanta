/**
 * @fileoverview Prefer isSome(expr) to checking against undefined or null
 * @author Robbie Ostrow
 */

import {
  AST_NODE_TYPES,
  TSESTree,
  ESLintUtils,
} from "@typescript-eslint/experimental-utils";

const rule = ESLintUtils.RuleCreator(
  (ruleName) => `https://github.com/TODO/${ruleName}`
)<unknown[], "default">({
  name: "null-or-undefined-check",
  meta: {
    fixable: "code",
    docs: {
      category: "Stylistic Issues",
      description: "Use isSome(expr) to check against undefined or null.",
      recommended: false,
    },
    messages: {
      default: `Use isSome(expr) to check against undefined or null.`,
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
        context.report({
          node,
          messageId: "default",
          fix(fixer) {
            return [
              fixer.replaceText(node, `${isEquals ? "!" : ""}isSome(${text})`),
            ];
          },
        });
      },
    };
  },
});

module.exports = rule;

export default rule;
