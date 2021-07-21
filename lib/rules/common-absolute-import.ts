/**
 * @fileoverview Prefer Maybe<T> to T | null or T | undefined.
 * @author Robbie Ostrow
 */

import { ESLintUtils } from "@typescript-eslint/experimental-utils";

const rule = ESLintUtils.RuleCreator(
  (ruleName) =>
    `https://github.com/VantaInc/eslint-plugin-vanta/blob/master/docs/rules/${ruleName}.md`
)<unknown[], "default">({
  name: "common-absolute-import",
  meta: {
    fixable: "code",
    docs: {
      category: "Possible Errors",
      description: "Import common/ from its absolute path",
      recommended: "error",
    },
    messages: {
      default: "Import code in common/ from its absolute path",
    },
    type: "suggestion",
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    const badCommonImportRegex = /\.\.\/.*\/?(common\/)src\/(.*)/s;
    return {
      ImportDeclaration(node) {
        if (typeof node.source.value !== "string") {
          return;
        }
        const matches = node.source.value.match(badCommonImportRegex);
        if (!matches) {
          return;
        }
        const replacement = node.source.value.replace(
          badCommonImportRegex,
          "$1$2"
        );
        context.report({
          node,
          messageId: "default",
          fix(fixer) {
            return [
              fixer.replaceTextRange(
                [node.source.range[0] + 1, node.source.range[1] - 1],
                replacement
              ),
            ];
          },
        });
      },
    };
  },
});

module.exports = rule;

export default rule;
