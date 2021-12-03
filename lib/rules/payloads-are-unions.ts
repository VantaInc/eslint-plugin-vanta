import {
  GraphQLESLintRule,
  GraphQLESTreeNode,
} from "@graphql-eslint/eslint-plugin";
import { TypeDefinitionNode } from "graphql/language/ast";

const rule: GraphQLESLintRule = {
  meta: {
    type: "suggestion",
    docs: {
      description:
        "Payloads are unions of a success type and one or more error types",
      category: "Best Practices",
      url: "https://github.com/VantaInc/eslint-plugin-vanta/blob/main/docs/rules/payloads-are-unions.md",
    },
  },
  create(context) {
    const validateDefinitionPayload = (
      node: GraphQLESTreeNode<TypeDefinitionNode>
    ) => {
      if (node.name.value.endsWith("Payload")) {
        if (node.type !== "UnionTypeDefinition") {
          context.report({
            node,
            message: "Types that end with 'Payload' must be unions",
          });
          return;
        }

        const successTypes =
          node.types?.filter((type) => type.name.value.endsWith("Success")) ??
          [];
        if (successTypes.length !== 1) {
          context.report({
            node,
            message:
              "Payloads must include exactly one 'Success' type, found {{count}}",
            data: {
              count: `${successTypes.length}`,
            },
          });
        }

        if (!node.types?.some((type) => type.name.value === "BaseUserError")) {
          context.report({
            node,
            message: "Payloads must include BaseUserError",
          });
        }

        if (
          !node.types?.every(
            (type) =>
              type.name.value.endsWith("Success") ||
              type.name.value.endsWith("Error")
          )
        ) {
          context.report({
            node,
            message:
              "Payloads should be unions of only Success and Error types",
          });
        }
      }
    };

    // lint all kinds that fall under TypeDefinitionNode
    // sadly TypeDefinitionNode: validateDefinitionPayload doesn't work
    return {
      ScalarTypeDefinition: validateDefinitionPayload,
      ObjectTypeDefinition: validateDefinitionPayload,
      InterfaceTypeDefinition: validateDefinitionPayload,
      UnionTypeDefinition: validateDefinitionPayload,
      EnumTypeDefinition: validateDefinitionPayload,
      InputObjectTypeDefinition: validateDefinitionPayload,
    };
  },
};

module.exports = rule;

export default rule;
