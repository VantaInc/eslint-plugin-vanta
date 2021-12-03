/**
 * @fileoverview Ensure that all GraphQL Connections are Relay compliant.
 * https://relay.dev/graphql/connections.htm#sec-Connection-Types
 */

import {
  GraphQLESLintRule,
  GraphQLESTreeNode,
} from "@graphql-eslint/eslint-plugin";
import { ObjectTypeDefinitionNode } from "graphql";
import { extractNamedType, isListType } from "../utils/graphqlutils";

const rule: GraphQLESLintRule = {
  meta: {
    type: "suggestion",
    docs: {
      description:
        "All Connection GraphQL types must implement the interface specified by the Relay cursor spec.",
      category: "Best Practices",
      url: "https://github.com/VantaInc/eslint-plugin-vanta/blob/main/docs/rules/connections-are-relay-compliant.md",
    },
  },
  create(context) {
    const validateType = (n: GraphQLESTreeNode<ObjectTypeDefinitionNode>) => {
      const node = n.rawNode();

      if (!node.name.value.endsWith("Connection")) {
        return;
      }

      const edgesField = node.fields?.find((f) => f.name.value === "edges");
      if (edgesField === undefined) {
        context.report({
          node: n,
          message: "Connections must contain an edge field",
        });
        return;
      }

      if (!isListType(edgesField.type)) {
        context.report({
          node: n,
          message: "Edges field must be a list",
        });
      }

      const edgeTypeName = extractNamedType(edgesField.type);
      if (!edgeTypeName.name.value.endsWith("Edge")) {
        context.report({
          node: n,
          message: "edge type must have a suffix `Edge`",
        });
      }

      const pageInfoField = node.fields?.find(
        (f) => f.name.value === "pageInfo"
      );
      if (pageInfoField === undefined) {
        context.report({
          node: n,
          message: "Connections must contain a pageInfo field",
        });
        return;
      }
      if (pageInfoField.type.kind !== "NonNullType") {
        context.report({
          node: n,
          message: "pageInfo must be non-nullable",
        });
        return;
      }

      const pageInfoTypeName = extractNamedType(pageInfoField.type);

      if (pageInfoTypeName.name.value !== "PageInfo") {
        context.report({
          node: n,
          message: "pageInfo must be of type PageInfo",
        });
      }
    };

    return { ObjectTypeDefinition: validateType };
  },
};

module.exports = rule;

export default rule;
