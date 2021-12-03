/**
 * @fileoverview Follow naming conventions for Mongoose models and schemas.
 * For a collection X, we use the following naming conventions:
 *
 * XFields = typeof schema;
 * XDoc = XFields & mongoose.Document;
 * XModel = model<XDoc>(schema, options);
 */

import {
  AST_NODE_TYPES,
  TSESTree,
  ESLintUtils,
} from "@typescript-eslint/experimental-utils";

const MONGOOSE_DOCUMENT_TYPE_NODE_IDENTIFIERS = new Set([
  "mongoose.Document",
  "Document",
]);
const MONGOOSE_MODEL_TYPE_NODE_IDENTIFIERS = new Set([
  "mongoose.model",
  "model",
  "mongoose.Model",
  "Model",
]);

const EXPECTED_TYPE_ALIAS_SUFFIX = "Doc";
const EXPECTED_INTERSECTION_TYPE_NAME_SUFFIX = "Fields";
const EXPECTED_MODEL_VARIABLE_SUFFIX = "Model";

const rule = ESLintUtils.RuleCreator(
  (ruleName) =>
    `https://github.com/VantaInc/eslint-plugin-vanta/blob/master/docs/rules/${ruleName}.md`
)<
  unknown[],
  | "mongooseDocumentNaming"
  | "mongooseFieldsNaming"
  | "mongooseDocumentFieldsMismatch"
  | "mongooseModelNaming"
  | "mongooseModelDocumentTypeNaming"
  | "mongooseModelDocumentTypeMismatch"
>({
  name: "mongoose-naming-convention",
  meta: {
    docs: {
      description:
        "Follow naming conventions for Mongoose modules and schemas.",
      recommended: "error",
    },
    messages: {
      mongooseDocumentNaming:
        "Type alias names for mongoose documents must be suffixed with 'Doc', got {{typeAliasName}}",
      mongooseFieldsNaming:
        "Types intersected with mongoose.Document must be suffixed with 'Fields', got {{typeName}}",
      mongooseDocumentFieldsMismatch:
        "Prefixes of type alias name for mongoose documents must match the prefixes of types unioned, got {{typeAliasNamePrefix}} and {{fieldTypeNamePrefix}}",
      mongooseModelNaming:
        "Mongoose models must be suffixed with 'Model', got {{variableName}}",
      mongooseModelDocumentTypeNaming:
        "Mongoose model initialized with type that is not suffixed by 'Doc', got {{documentTypeName}}",
      mongooseModelDocumentTypeMismatch:
        "Prefixes of variable declaration for mongoose models must match the prefix of document type, got {{variableDeclarationNamePrefix}} and {{documentTypeNamePrefix}}",
    },
    type: "suggestion",
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    const sourceCode = context.getSourceCode();

    return {
      "TSTypeAliasDeclaration > TSIntersectionType > TSTypeReference": (
        node: TSESTree.TSTypeReference
      ): void => {
        if (
          !MONGOOSE_DOCUMENT_TYPE_NODE_IDENTIFIERS.has(sourceCode.getText(node))
        ) {
          return;
        }
        const typeAliasDeclaration = context
          .getAncestors()
          .slice(-2)[0] as TSESTree.TSTypeAliasDeclaration;
        const typeAliasName = typeAliasDeclaration.id.name;
        if (!typeAliasName.endsWith(EXPECTED_TYPE_ALIAS_SUFFIX)) {
          context.report({
            node: typeAliasDeclaration.id,
            messageId: "mongooseDocumentNaming",
            data: {
              typeAliasName: typeAliasDeclaration.id.name,
            },
          });
          return;
        }
        const typeAliasNamePrefix = typeAliasName.slice(
          0,
          -EXPECTED_TYPE_ALIAS_SUFFIX.length
        );
        const intersection = context
          .getAncestors()
          .slice(-1)[0] as TSESTree.TSIntersectionType;
        const siblingTypes = intersection.types.filter(
          (type) =>
            !MONGOOSE_DOCUMENT_TYPE_NODE_IDENTIFIERS.has(
              sourceCode.getText(type)
            ) && type.type === AST_NODE_TYPES.TSTypeReference
        );
        siblingTypes.forEach((sibling) => {
          const siblingTypeName = sourceCode.getText(
            (sibling as TSESTree.TSTypeReference).typeName
          );
          if (
            !siblingTypeName.endsWith(EXPECTED_INTERSECTION_TYPE_NAME_SUFFIX)
          ) {
            context.report({
              node: sibling,
              messageId: "mongooseFieldsNaming",
              data: {
                typeName: sourceCode.getText(sibling),
              },
            });
            return;
          }
          const siblingTypeNamePrefix = siblingTypeName.slice(
            0,
            -EXPECTED_INTERSECTION_TYPE_NAME_SUFFIX.length
          );
          if (typeAliasNamePrefix !== siblingTypeNamePrefix) {
            context.report({
              node: sibling,
              messageId: "mongooseDocumentFieldsMismatch",
              data: {
                typeAliasNamePrefix,
                fieldTypeNamePrefix: siblingTypeNamePrefix,
              },
            });
            return;
          }
        });
        return;
      },
      "VariableDeclarator > CallExpression > TSTypeParameterInstantiation > TSTypeReference":
        (node: TSESTree.TSTypeReference): void => {
          const callExpressionNode = context
            .getAncestors()
            .slice(-2)[0] as TSESTree.CallExpression;
          if (
            !MONGOOSE_MODEL_TYPE_NODE_IDENTIFIERS.has(
              sourceCode.getText(callExpressionNode.callee)
            )
          ) {
            return;
          }
          const variableDeclaratorNode = context
            .getAncestors()
            .slice(-3)[0] as TSESTree.VariableDeclarator;
          const variableDeclarationName = sourceCode.getText(
            variableDeclaratorNode.id
          );
          if (
            !variableDeclarationName.endsWith(EXPECTED_MODEL_VARIABLE_SUFFIX)
          ) {
            context.report({
              node: variableDeclaratorNode.id,
              messageId: "mongooseModelNaming",
              data: {
                variableName: sourceCode.getText(variableDeclaratorNode.id),
              },
            });
            return;
          }
          const documentTypeName = sourceCode.getText(node);
          if (!documentTypeName.endsWith(EXPECTED_TYPE_ALIAS_SUFFIX)) {
            context.report({
              node,
              messageId: "mongooseModelDocumentTypeNaming",
              data: {
                documentTypeName,
              },
            });
            return;
          }
          const variableDeclarationNamePrefix = variableDeclarationName.slice(
            0,
            -EXPECTED_MODEL_VARIABLE_SUFFIX.length
          );
          const documentTypeNamePrefix = documentTypeName.slice(
            0,
            -EXPECTED_TYPE_ALIAS_SUFFIX.length
          );
          if (variableDeclarationNamePrefix !== documentTypeNamePrefix) {
            context.report({
              node,
              messageId: "mongooseModelDocumentTypeMismatch",
              data: {
                variableDeclarationNamePrefix,
                documentTypeNamePrefix,
              },
            });
            return;
          }
        },
    };
  },
});

module.exports = rule;

export default rule;
