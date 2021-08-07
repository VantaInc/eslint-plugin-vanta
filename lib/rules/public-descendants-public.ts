/**
 * @fileoverview Lint rule to ensure that all types reachable from fields marked as @public are themselves marked as @public.
 * @author Robbie Ostrow
 */

import { GraphQLESLintRule } from "@graphql-eslint/eslint-plugin";

import { FieldDefinitionNode, GraphQLScalarType } from "graphql";
import {
  extractNamedType,
  requireGraphQLSchemaFromContext,
} from "../utils/graphqlutils";

const PUBLIC_DIRECTIVE = "public";

const rule: GraphQLESLintRule = {
  meta: {
    type: "problem",
    docs: {
      description: "TODO",
      category: "Best Practices",
      url: "https://github.com/VantaInc/eslint-plugin-vanta/blob/master/docs/rules/public-descendants-public.md",
    },
  },
  create(context) {
    const schema = requireGraphQLSchemaFromContext(
      "public-descendants-public",
      context
    );

    const fieldPointsToPublicTypeOrScalar = (node: FieldDefinitionNode) => {
      const typeName = extractNamedType(node.type).name.value;
      const type = schema.getType(typeName);
      if (!type) {
        return true; // type not found; assume OK
      }
      const typeIsScalar = type instanceof GraphQLScalarType;
      const typeHasPublicDirective = Boolean(
        type.astNode?.directives?.find((x) => x.name.value === PUBLIC_DIRECTIVE)
      );
      return typeHasPublicDirective || typeIsScalar;
    };

    return {
      FieldDefinition(node) {
        if (!node.directives?.find((x) => x.name.value === PUBLIC_DIRECTIVE)) {
          return;
        }

        if (!fieldPointsToPublicTypeOrScalar(node.rawNode())) {
          context.report({
            node,
            message: `Types accessible by @${PUBLIC_DIRECTIVE} fields must be marked @${PUBLIC_DIRECTIVE}`,
          });
        }
      },

      ObjectTypeDefinition(node) {
        if (!node.directives?.find((x) => x.name.value === PUBLIC_DIRECTIVE)) {
          return;
        }
        node.rawNode().fields?.forEach((field) => {
          if (!fieldPointsToPublicTypeOrScalar(field)) {
            context.report({
              node,
              message: `Types accessible from @${PUBLIC_DIRECTIVE} types must themselves be marked @${PUBLIC_DIRECTIVE}`,
            });
          }
        });
      },

      ObjectTypeExtension(node) {
        if (!node.directives?.find((x) => x.name.value === PUBLIC_DIRECTIVE)) {
          return;
        }
        context.report({
          node,
          message: `@${PUBLIC_DIRECTIVE} directive not supported on type extensions`,
        });
      },
    };
  },
};

module.exports = rule;

export default rule;
