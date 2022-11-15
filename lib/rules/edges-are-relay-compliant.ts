/**
 * @fileoverview Ensure that all GraphQL Edges are Relay compliant.
 * https://relay.dev/graphql/connections.htm#sec-Edge-Types
 */

import { GraphQLESLintRule } from "@graphql-eslint/eslint-plugin";
import { ObjectTypeDefinitionNode, ObjectTypeExtensionNode } from "graphql";
import { extractNamedType, isListType } from "../utils/graphqlutils";
import { TypeNode } from "graphql";
import { GraphQLESTreeNode } from "@graphql-eslint/eslint-plugin/estree-converter";

const rule: GraphQLESLintRule = {
  meta: {
    type: "suggestion",
    docs: {
      // @ts-ignore
      description:
        "All Edge GraphQL types must implement the interface specified by the Relay cursor spec.",
      category: "Schema",
      url: "https://github.com/VantaInc/eslint-plugin-vanta/blob/main/docs/rules/edges-are-relay-compliant.md",
    },
  },
  create(context) {
    const validateType = (n: GraphQLESTreeNode<ObjectTypeDefinitionNode>) => {
      const node = n.rawNode();

      if (!node.name.value.endsWith("Edge")) {
        return;
      }

      const nodeField = node.fields?.find((f) => f.name.value === "node");
      if (nodeField === undefined) {
        context.report({
          node: n,
          message: "Edges must contain a node field",
        });
        return;
      }

      if (isListType(nodeField.type)) {
        context.report({
          node: n,
          message: "Node field cannot be a list",
        });
      }

      const cursorField = node.fields?.find((f) => f.name.value === "cursor");
      if (cursorField === undefined) {
        context.report({
          node: n,
          message: "Edges must contain a cursor field",
        });
        return;
      }

      const isString = (type: TypeNode): boolean => {
        const namedType = extractNamedType(type);
        return namedType.name.value === "String";
      };

      const isCursorFieldSerializable =
        cursorField.type.kind === "NonNullType"
          ? isString(cursorField.type.type)
          : isString(cursorField.type);
      if (!isCursorFieldSerializable) {
        context.report({
          node: n,
          message: "Cursor field must be a string or serializable to string",
        });
        return;
      }
    };

    return { ObjectTypeDefinition: validateType };
  },
};

module.exports = rule;

export default rule;
