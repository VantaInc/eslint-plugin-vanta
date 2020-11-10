"use strict";
/**
 * @fileoverview Prefer isSome(expr) to checking against undefined or null
 * @author Robbie Ostrow
 */
Object.defineProperty(exports, "__esModule", { value: true });
var experimental_utils_1 = require("@typescript-eslint/experimental-utils");
var rule = experimental_utils_1.ESLintUtils.RuleCreator(function (ruleName) { return "https://github.com/TODO/" + ruleName; })({
    name: "null-or-undefined-check",
    meta: {
        fixable: "code",
        docs: {
            category: "Stylistic Issues",
            description: "Use isSome(expr) to check against undefined or null.",
            recommended: false,
        },
        messages: {
            default: "Use isSome(expr) to check against undefined or null.",
        },
        type: "suggestion",
        schema: [],
    },
    defaultOptions: [],
    create: function (context) {
        var sourceCode = context.getSourceCode();
        return {
            BinaryExpression: function (node) {
                var isEquals;
                if (node.operator === "==" || node.operator === "===") {
                    isEquals = true;
                }
                else if (node.operator === "!=" || node.operator === "!==") {
                    isEquals = false;
                }
                else {
                    return;
                }
                var variableExpr;
                if ((node.left.type === experimental_utils_1.AST_NODE_TYPES.Literal &&
                    node.left.value === null) ||
                    sourceCode.getText(node.left) === "undefined" // undefined is unfortunately an identifier type; assume that it isn't overridden
                ) {
                    variableExpr = node.right;
                }
                else if ((node.right.type === experimental_utils_1.AST_NODE_TYPES.Literal &&
                    node.right.value === null) ||
                    sourceCode.getText(node.right) === "undefined") {
                    variableExpr = node.left;
                }
                else {
                    return;
                }
                var text = sourceCode.getText(variableExpr);
                context.report({
                    node: node,
                    messageId: "default",
                    fix: function (fixer) {
                        return [
                            fixer.replaceText(node, (isEquals ? "!" : "") + "isSome(" + text + ")"),
                        ];
                    },
                });
            },
        };
    },
});
module.exports = rule;
exports.default = rule;