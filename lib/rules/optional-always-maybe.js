"use strict";
/**
 * @fileoverview Ensure that all optional properties and identifiers are of type Maybe<T>.
 * @author Robbie Ostrow
 */
Object.defineProperty(exports, "__esModule", { value: true });
var experimental_utils_1 = require("@typescript-eslint/experimental-utils");
var rule = experimental_utils_1.ESLintUtils.RuleCreator(function (ruleName) {
    return "https://github.com/VantaInc/eslint-plugin-vanta/blob/master/docs/rules/" + ruleName + ".md";
})({
    name: "optional-always-maybe",
    meta: {
        fixable: "code",
        docs: {
            category: "Stylistic Issues",
            description: "Optional properties must be of type Maybe<T>",
            recommended: false,
        },
        messages: {
            default: "`{{property}}` should be changed to `Maybe<{{property}}>`",
        },
        type: "suggestion",
        schema: [],
    },
    defaultOptions: [],
    create: function (context) {
        var sourceCode = context.getSourceCode();
        function introduceMaybe(node) {
            var _a;
            if (!node.optional || !((_a = node.typeAnnotation) === null || _a === void 0 ? void 0 : _a.typeAnnotation)) {
                return;
            }
            var typeAnnotation = node.typeAnnotation.typeAnnotation;
            if (typeAnnotation.type === experimental_utils_1.AST_NODE_TYPES.TSTypeReference &&
                typeAnnotation.typeName.type === experimental_utils_1.AST_NODE_TYPES.Identifier &&
                typeAnnotation.typeName.name === "Maybe") {
                return;
            }
            context.report({
                node: node,
                messageId: "default",
                data: {
                    property: sourceCode.getText(typeAnnotation),
                },
                fix: function (fixer) {
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
exports.default = rule;
