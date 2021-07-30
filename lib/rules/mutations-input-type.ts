/**
 * @fileoverview Ensure that all mutations take a single non-nullable input type with the suffix "Input" or have no arguments
 * @author Ellen Finch
 */

import {
  GraphQLESLintRule,
  GraphQLESTreeNode,
} from "@graphql-eslint/eslint-plugin";
import { ObjectTypeDefinitionNode, ObjectTypeExtensionNode } from "graphql";

const rule: GraphQLESLintRule = {
  meta: {
    type: "suggestion",
    docs: {
      description:
        "All mutations must take a single non-nullable input type with the suffix `Input` or have no arguments",
      category: "Best Practices",
      url:
        "https://github.com/VantaInc/eslint-plugin-vanta/blob/master/docs/rules/mutations-input-type.md",
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
        if ((field.arguments?.length ?? 0) > 1) {
          context.report({
            node,
            message: "Mutations must take zero or one argument",
          });
          return;
        }
        field.arguments?.forEach((arg) => {
          if (arg.name.value !== "input") {
            context.report({
              node,
              message: "Mutations must take a single argument named input",
            });
            return;
          }
          if (arg.type.kind === "ListType") {
            context.report({
              node,
              message: "Mutation input must not be list type",
            });
            return;
          }
          if (arg.type.kind !== "NonNullType") {
            context.report({
              node,
              message: "Mutation input must be non-nullable",
            });
            return;
          }
          if (
            arg.type.type.kind !== "NamedType" ||
            !arg.type.type.name.value.endsWith("Input")
          ) {
            context.report({
              node,
              message: "Mutation input must be a type with suffix `Input`",
            });
            return;
          }
        });
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
