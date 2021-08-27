/**
 * @fileoverview Ensure that all GraphQL Connections are Relay compliant.
 * https://relay.dev/graphql/connections.htm#sec-Connection-Types
 * @author Neil Patil
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
        "All Connection GraphQL types must implement the interface specified by the Relay cursor spec.",
      category: "Best Practices",
      url: "https://github.com/VantaInc/eslint-plugin-vanta/blob/master/docs/rules/connections-are-relay-compliant.md",
    },
  },
  create(context) {
    const validateType = (
      n: GraphQLESTreeNode<ObjectTypeDefinitionNode>
    ) => {
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
      console.log(edgesField);
      if (edgesField.type.kind !== "ListType") {
        context.report({
          node: n,
          message: "Edges field must be a list",
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
      if (pageInfoField.type.type.kind !== "NamedType") {
        context.report({
          node: n,
          message: "pageInfo must be an object type",
        });
      }
    };

    return { ObjectTypeDefinition: validateType };
  },
};

module.exports = rule;

export default rule;
