/**
 * @fileoverview Lint rule to ensure that all types reachable from fields marked as @public are themselves marked as @public.
 */

import {
  GraphQLESLintRule,
  requireGraphQLSchemaFromContext,
} from "@graphql-eslint/eslint-plugin";

import {
  DirectiveNode,
  FieldDefinitionNode,
  GraphQLEnumType,
  GraphQLScalarType,
} from "graphql";
import { extractNamedType } from "../utils/graphqlutils";

const PUBLIC_DIRECTIVE = "public";
const RULE_ID = "public-descendants-public";

const rule: GraphQLESLintRule<any[], true> = {
  meta: {
    type: "problem",
    docs: {
      category: "Schema",
      // @ts-ignore
      description:
        "Ensures that all types reachable from fields marked as @public are themselves marked as @public.",
      url: "https://github.com/VantaInc/eslint-plugin-vanta/blob/main/docs/rules/public-descendants-public.md",
      requiresSchema: true,
    },
    messages: {
      [RULE_ID]:
        "All types reachable from fields marked as @public must be also marked as @public",
    },
  },
  create(context) {
    const schema = requireGraphQLSchemaFromContext(RULE_ID, context);

    const hasPublicDirective = (
      directives: readonly DirectiveNode[] | undefined
    ): boolean => {
      return Boolean(
        directives?.find((x) => x.name.value === PUBLIC_DIRECTIVE)
      );
    };

    const fieldPointsToPublicTypeOrScalar = (node: FieldDefinitionNode) => {
      const typeName = extractNamedType(node.type).name.value;
      const type = schema.getType(typeName);
      if (!type) {
        return true; // type not found; assume OK
      }
      // need to check a whitelist since the version of graphql we're using
      // seems to not work with the instanceOf checks. Hoping we can get rid of
      // this in the future.
      const builtinScalars = ["Int", "Float", "String", "Boolean", "ID"];
      const customScalarsAndEnums = [
        "DateTime",
        "reportStandard",
        "testOutcome",
      ];
      const typeIsScalar =
        type instanceof GraphQLScalarType ||
        type instanceof GraphQLEnumType ||
        builtinScalars.includes(typeName) ||
        customScalarsAndEnums.includes(typeName);
      return hasPublicDirective(type.astNode?.directives) || typeIsScalar;
    };

    return {
      FieldDefinition(node) {
        if (!hasPublicDirective(node.directives)) {
          return;
        }

        if (!fieldPointsToPublicTypeOrScalar(node.rawNode())) {
          context.report({
            node,
            message: `Types accessible by @${PUBLIC_DIRECTIVE} fields must be marked @${PUBLIC_DIRECTIVE}.`,
          });
        }
      },

      ObjectTypeDefinition(node) {
        if (!hasPublicDirective(node.directives)) {
          return;
        }
        node.rawNode().fields?.forEach((field) => {
          if (!fieldPointsToPublicTypeOrScalar(field)) {
            context.report({
              node,
              message: `Types accessible from @${PUBLIC_DIRECTIVE} types must themselves be marked @${PUBLIC_DIRECTIVE}. Unmarked field: ${field.name.value}`,
            });
          }
        });
      },

      ObjectTypeExtension(node) {
        if (!hasPublicDirective(node.directives)) {
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
