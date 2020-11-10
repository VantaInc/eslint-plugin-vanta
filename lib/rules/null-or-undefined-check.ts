/**
 * @fileoverview Prefer isSome(expr) to checking against undefined or null
 * @author Robbie Ostrow
 */

import {
  AST_NODE_TYPES,
  TSESTree,
  ESLintUtils,
} from "@typescript-eslint/experimental-utils";

module.exports = ESLintUtils.RuleCreator(
  (ruleName) => `https://github.com/TODO/${ruleName}`
)<[], "generic">({
  name: "null-or-undefined-check",
  meta: {
    fixable: "code",
    docs: {
      category: "Stylistic Issues",
      description: "Use isSome(expr) to check against undefined or null.",
      recommended: false,
    },
    messages: {
      generic: `Use isSome(expr) to check against {{type}}.`,
    },
    type: "suggestion",
    schema: [],
  },
  defaultOptions: [],
  create(context) {
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
          node.left.type === AST_NODE_TYPES.Literal &&
          (node.left.value === null || node.left.value === undefined)
        ) {
          variableExpr = node.right;
        } else if (
          node.right.type === AST_NODE_TYPES.Literal &&
          (node.right.value === null || node.right.value === undefined)
        ) {
          variableExpr = node.left;
        } else {
          return;
        }
        context.report({
          node,
          messageId: "generic",
          data: {
            type: variableExpr.type,
          },
          fix(fixer) {
            return [
              fixer.replaceText(
                node,
                `${isEquals ? "!" : ""}isSome(${variableExpr})`
              ),
            ];
          },
        });
      },
    };
  },
});
