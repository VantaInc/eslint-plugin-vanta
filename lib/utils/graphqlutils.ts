import { GraphQLESLintRuleContext } from "@graphql-eslint/eslint-plugin";
import { NamedTypeNode, GraphQLSchema, TypeNode } from "graphql";

/**
 * Given a TypeNode, determine whether it is a list type, ignoring
 * nullability.
 */
export const isListType = (type: TypeNode): boolean => {
  if (type.kind === "ListType") {
    return true;
  }
  if (type.kind === "NonNullType") {
    return isListType(type.type);
  }
  return false;
};

/**
 * Given a TypeNode, extract the base NamedType.
 *
 * ExtractNamedType strips off ListTypes and NonNullTypes –
 * calling with the type T, T!, [T], [T!], [T!]! all return T.
 */
export const extractNamedType = (type: TypeNode): NamedTypeNode => {
  if (type.kind === "NamedType") {
    return type;
  }
  if (type.kind === "ListType") {
    return extractNamedType(type.type);
  }
  if (type.kind === "NonNullType") {
    return extractNamedType(type.type);
  }
  throw new Error("Unsupported type: " + type);
};
