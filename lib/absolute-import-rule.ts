/**
 * @fileoverview Generic class that creates rules to enforce imports from {folder} are absolute
 */

import { ESLintUtils } from "@typescript-eslint/utils";

const absoluteImportRule = (folder: string) => {
  const ruleName = `${folder}-absolute-import`;

  const rule = ESLintUtils.RuleCreator(
    () =>
      `https://github.com/VantaInc/eslint-plugin-vanta/blob/main/docs/rules/${ruleName}.md`
  )<unknown[], "default">({
    name: `${folder}-absolute-import`,
    meta: {
      fixable: "code",
      docs: {
        description: `Import ${folder} from its absolute path`,
        recommended: "error",
      },
      messages: {
        default: `Import code in ${folder} from its absolute path`,
      },
      type: "suggestion",
      schema: [],
    },
    defaultOptions: [],
    create(context) {
      const badCommonImportRegex = new RegExp(
        `(\.\.\/)*?(${folder}\/)src\/(.*)`
      );
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
            "$2$3"
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

  return rule;
};

module.exports = absoluteImportRule;

export default absoluteImportRule;
