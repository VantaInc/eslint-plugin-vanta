/**
 * @fileoverview Ensure that all mutations return a nullable type with the suffix "Payload"
 */

import { GraphQLESLintRule } from "@graphql-eslint/eslint-plugin";
import { GraphQLESTreeNode } from "@graphql-eslint/eslint-plugin/estree-converter";
import { ObjectTypeDefinitionNode, ObjectTypeExtensionNode } from "graphql";

const rule: GraphQLESLintRule = {
  meta: {
    type: "suggestion",
    docs: {
      // @ts-ignore
      description:
        "All mutations must return a nullable type with the suffix `Payload`",
      category: "Operations",
      url: "https://github.com/VantaInc/eslint-plugin-vanta/blob/main/docs/rules/mutations-return-payload.md",
    },
  },
  create(context) {
    const validatePayload = (
      node:
        | GraphQLESTreeNode<ObjectTypeExtensionNode>
        | GraphQLESTreeNode<ObjectTypeDefinitionNode>
    ) => {
      if (node.name.value !== "Mutation") {
        return;
      }
      node.rawNode().fields?.forEach((field) => {
        if (field.type.kind === "ListType") {
          context.report({
            node,
            message: "Mutation payloads must not be list types",
          });
          return;
        }
        if (field.type.kind === "NonNullType") {
          context.report({
            node,
            message: "Mutation payloads must be nullable",
          });
          return;
        }
        if (!field.type.name.value.endsWith("Payload")) {
          context.report({
            node,
            message: `Mutations must return types with the suffix "Payload"`,
          });
        }
      });
    };

    return {
      ObjectTypeDefinition: validatePayload,
      ObjectTypeExtension: validatePayload,
    };
  },
};

module.exports = rule;

export default rule;
