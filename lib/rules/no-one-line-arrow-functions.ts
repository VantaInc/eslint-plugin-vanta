/**
 * @fileoverview Ensure that short functions have an explicit return statement
 */

 import {
    GraphQLESLintRule,
  } from "@graphql-eslint/eslint-plugin";
import { ArrowFunctionExpression } from "@typescript-eslint/types/dist/ast-spec";
  
  const rule: GraphQLESLintRule = {
    meta: {
      type: "suggestion",
      docs: {
        description:
          "This short function is missing a return statement, please add an empty return statement at the end",
        category: "Best Practices",
        url: "https://github.com/VantaInc/eslint-plugin-vanta/blob/main/docs/rules/no-one-line-arrow-functions.md",
      },
    },
    create(context) {
      const validatePayload = (
        node: ArrowFunctionExpression
        // node:
        //   | GraphQLESTreeNode<ArrowFunction>
        //   | GraphQLESTreeNode<ObjectTypeDefinitionNode>
      ) => {
        const arrowBody = node.body;
        if (arrowBody.type !== "BlockStatement") {
          return;
        }
        if (arrowBody.body.length === 1) {
            // Need to make sure it's not an expression statement, it should be a return
            if (arrowBody.body[0].type === "ReturnStatement") {
                return;
            }
            context.report({
                node,
                message: "Expect a one-line arrow function to have a return statement"
            })
        }}
  
      return {
        ArrowFunctionExpression: validatePayload,
      };
    },
  };
  
  module.exports = rule;
  
  export default rule;
  