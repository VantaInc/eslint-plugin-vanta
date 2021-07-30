/**
 * @fileoverview Ensure that all mutations return a unique type
 * @author Ellen Finch
 */

import {
  GraphQLESLintRule,
  GraphQLESTreeNode,
} from "@graphql-eslint/eslint-plugin";
import { DocumentNode } from "graphql";

const rule: GraphQLESLintRule = {
  meta: {
    type: "suggestion",
    docs: {
      description: "All mutations must return a unique type",
      category: "Best Practices",
      url:
        "https://github.com/VantaInc/eslint-plugin-vanta/blob/master/docs/rules/mutations-return-payload.md",
    },
  },
  create(context) {
    const validatePayload = (node: GraphQLESTreeNode<DocumentNode>) => {
      const typeNames = new Set<string>();
      node.rawNode().definitions?.forEach((definition) => {
        if (
          definition.kind === "ObjectTypeDefinition" ||
          definition.kind === "ObjectTypeExtension"
        ) {
          if (definition.name.value !== "Mutation") {
            return;
          }

          definition.fields?.forEach((field) => {
            if (
              field.type.kind === "ListType" ||
              field.type.kind === "NonNullType"
            ) {
              return;
            }
            const payloadTypeName = field.type.name.value;
            if (typeNames.has(payloadTypeName)) {
              context.report({
                node: node,
                message: `Mutation payload types must be unique; reused name {{name}}`,
                data: {
                  name: payloadTypeName,
                },
              });
              return;
            }
            typeNames.add(payloadTypeName);
          });
        }
      });
    };

    return {
      Document: validatePayload,
    };
  },
};

module.exports = rule;

export default rule;
