import { GraphQLESLintRuleContext } from "@graphql-eslint/eslint-plugin";
import { NamedTypeNode, GraphQLSchema, TypeNode } from "graphql";

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

/**
 * If you need the whole GraphQL schema as part of a lint rule, use this function.
 * Based on a function in https://github.com/dotansimha/graphql-eslint/blob/master/packages/plugin/src/utils.ts
 */
export function requireGraphQLSchemaFromContext(
  ruleName: string,
  context: GraphQLESLintRuleContext
): GraphQLSchema {
  if (!context.parserServices?.schema) {
    throw new Error(
      `Rule '${ruleName}' requires 'parserOptions.schema' to be set. See http://bit.ly/graphql-eslint-schema for more info`
    );
  }

  if (!context.parserServices.hasTypeInfo) {
    throw new Error(
      `Rule '${ruleName}' requires 'parserOptions.schema' to be set and schema to be loaded. See http://bit.ly/graphql-eslint-schema for more info`
    );
  }

  return context.parserServices.schema;
}
