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
  requireGraphQLSchemaFromContext,
} from "../utils/graphqlutils";
import {
  GraphQLEnumType,
  GraphQLObjectType,
  GraphQLInterfaceType,
  GraphQLScalarType,
  GraphQLUnionType,
  TypeNode,
  ListTypeNode,
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

      const validNodeType = (type: TypeNode): boolean => {
        if (type.kind !== "NamedType") {
          return false;
        }

        const nodeFieldType = schema.getType(type.name.value);

        const validNodeFieldType =
          nodeFieldType instanceof GraphQLScalarType ||
          nodeFieldType instanceof GraphQLEnumType ||
          nodeFieldType instanceof GraphQLObjectType ||
          nodeFieldType instanceof GraphQLInterfaceType ||
          nodeFieldType instanceof GraphQLUnionType;
        return validNodeFieldType;
      };

      const isValidNodeType =
        nodeField.type.kind === "NonNullType"
          ? validNodeType(nodeField.type.type)
          : validNodeType(nodeField.type);
      if (!isValidNodeType) {
        context.report({
          node: n,
          message: "Node field is not an acceptable type",
        });
        return;
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
