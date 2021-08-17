/**
 * @fileoverview Lint rule to ensure that all lists are either paginated as part of connections, or marked as explicitly not needing pagination.
 * @author Robbie Ostrow
 */

import { GraphQLESLintRule } from "@graphql-eslint/eslint-plugin";

import { DirectiveNode } from "graphql";
import { isListType } from "../utils/graphqlutils";

const SHORT_LIST_DIRECTIVE = "tinylist";

const rule: GraphQLESLintRule = {
  meta: {
    type: "problem",
    docs: {
      description: `Ensures that all list types are edges in connections, or marked as ${SHORT_LIST_DIRECTIVE}`,
      category: "Best Practices",
      url: "https://github.com/VantaInc/eslint-plugin-vanta/blob/master/docs/rules/all-lists-in-connections.md",
    },
  },
  create(context) {
    const hasShortListDirective = (
      directives: readonly DirectiveNode[] | undefined
    ): boolean => {
      return Boolean(
        directives?.find((x) => x.name.value === SHORT_LIST_DIRECTIVE)
      );
    };

    return {
      FieldDefinition(node) {
        // if it has the directive, it's allowed to be a list
        if (hasShortListDirective(node.directives)) {
          return;
        }

        // if it's an edge type on a connection, it's allowed to be a list
        // node typings don't include parent but it's there!
        const nodeParentName: string = (node as any).parent.name.value;
        if (
          node.name.value === "edges" &&
          nodeParentName.endsWith("Connection")
        ) {
          return;
        }

        if (isListType(node.rawNode().type)) {
          context.report({
            node,
            message: `Lists must be paginated or marked as guaranteed to be short using the directive @${SHORT_LIST_DIRECTIVE}.`,
          });
          return;
        }
      },
    };
  },
};

module.exports = rule;

export default rule;
