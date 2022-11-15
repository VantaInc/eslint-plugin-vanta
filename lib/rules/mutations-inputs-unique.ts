/**
 * @fileoverview Ensure that all mutations take a unique type
 */

import { GraphQLESLintRule } from "@graphql-eslint/eslint-plugin";
import { GraphQLESTreeNode } from "@graphql-eslint/eslint-plugin/estree-converter";
import { DocumentNode } from "graphql";
import { extractNamedType } from "../utils/graphqlutils";

const rule: GraphQLESLintRule = {
  meta: {
    type: "suggestion",
    docs: {
      // @ts-ignore
      description: "All mutations must take a unique input type",
      category: "Operations",
      url: "https://github.com/VantaInc/eslint-plugin-vanta/blob/main/docs/rules/mutations-inputs-unique.md",
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
            field.arguments?.forEach((arg) => {
              const inputTypeName = extractNamedType(arg.type).name.value;
              if (typeNames.has(inputTypeName)) {
                context.report({
                  node: node,
                  message: `Mutation input types must be unique; reused type {{type}}`,
                  data: {
                    type: inputTypeName,
                  },
                });
                return;
              }
              typeNames.add(inputTypeName);
            });
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
