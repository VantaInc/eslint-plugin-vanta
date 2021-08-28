/**
 * @fileoverview Ensure that all GraphQL Edges are Relay compliant.
 * https://relay.dev/graphql/connections.htm#sec-Edge-Types
 * @author Neil Patil
 */

import {
  GraphQLESLintRule,
  GraphQLESTreeNode,
} from "@graphql-eslint/eslint-plugin";
import { ObjectTypeDefinitionNode, ObjectTypeExtensionNode } from "graphql";
import {
  extractNamedType,
  isListType,
  requireGraphQLSchemaFromContext,
} from "../utils/graphqlutils";
import {
  GraphQLEnumType,
  GraphQLObjectType,
  GraphQLInterfaceType,
  GraphQLScalarType,
  GraphQLUnionType,
  TypeNode,
} from "graphql";

const rule: GraphQLESLintRule = {
  meta: {
    type: "suggestion",
    docs: {
      description:
        "All Edge GraphQL types must implement the interface specified by the Relay cursor spec.",
      category: "Best Practices",
      url: "https://github.com/VantaInc/eslint-plugin-vanta/blob/master/docs/rules/edges-are-relay-compliant.md",
    },
  },
  create(context) {
    const validateType = (n: GraphQLESTreeNode<ObjectTypeDefinitionNode>) => {
      const node = n.rawNode();

      const schema = requireGraphQLSchemaFromContext(
        "edges-are-relay-compliant",
        context
      );

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
