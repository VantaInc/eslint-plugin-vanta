/**
 * @fileoverview Ensure that all GraphQL errors implement the `UserError` interface.
 */

import {
  GraphQLESLintRule,
  GraphQLESLintRuleListener,
} from "@graphql-eslint/eslint-plugin";
import { GraphQLESTreeNode } from "@graphql-eslint/eslint-plugin/estree-converter";
import {
  ObjectTypeDefinitionNode,
  ObjectTypeExtensionNode,
} from "graphql/language/ast";

const rule: GraphQLESLintRule = {
  meta: {
    type: "suggestion",
    docs: {
      // @ts-ignore
      description:
        "A type should implement the UserError interface if and only if its name ends with Error.",
      category: "Schema",
      url: "https://github.com/VantaInc/eslint-plugin-vanta/blob/main/docs/rules/errors-implement-usererror.md",
    },
  },
  create(context): GraphQLESLintRuleListener<false> {
    const validateDefinitionPayload = (
      node: GraphQLESTreeNode<ObjectTypeDefinitionNode>
    ) => {
      if (
        node.name.value.endsWith("Error") &&
        (!node.interfaces ||
          node.interfaces?.every(
            (int) => int.kind !== "NamedType" || int.name.value !== "UserError"
          ))
      ) {
        context.report({
          node,
          message: "Types that end with 'Error' must implement UserError",
        });
      }
      if (
        !node.name.value.endsWith("Error") &&
        node.interfaces &&
        node.interfaces?.some(
          (int) => int.kind === "NamedType" && int.name.value === "UserError"
        )
      ) {
        context.report({
          node,
          message:
            "Types that do not end in 'Error' cannot implement UserError",
        });
      }
    };

    const validateExtensionPayload = (
      node: GraphQLESTreeNode<ObjectTypeExtensionNode>
    ) => {
      if (
        !node.name.value.endsWith("Error") &&
        node.interfaces &&
        node.interfaces?.some(
          (int) => int.kind === "NamedType" && int.name.value === "UserError"
        )
      ) {
        context.report({
          node,
          message:
            "Types that do not end in 'Error' cannot implement UserError",
        });
      }
    };

    return {
      ObjectTypeDefinition: validateDefinitionPayload,
      ObjectTypeExtension: validateExtensionPayload,
    };
  },
};

module.exports = rule;

export default rule;
