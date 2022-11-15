import {
  GraphQLInvalidTestCase,
  GraphQLRuleTester,
  GraphQLValidTestCase,
  ParserOptions,
} from "@graphql-eslint/eslint-plugin";
import rule from "../../../lib/rules/public-descendants-public";

const createValid = (schema: string): GraphQLValidTestCase<any[]> => {
  return { parserOptions: <ParserOptions>{ schema }, code: schema };
};
const createInvalid = (schema: string): GraphQLInvalidTestCase<any[]> => {
  return {
    parserOptions: <ParserOptions>{ schema },
    code: schema,
    errors: 1,
  };
};

const ruleTester = new GraphQLRuleTester();

const test1 = /* GraphQL */ `
  directive @public(
    detail: String = "No authentication required for this action"
  ) on FIELD_DEFINITION | OBJECT | UNION | ENUM

  type T1 {
    val: T2 @public
  }
  type T2 @public {
    val: String
  }
`;

const test2 = /* GraphQL */ `
  directive @public(
    detail: String = "No authentication required for this action"
  ) on FIELD_DEFINITION | OBJECT | UNION | ENUM

  type T1 {
    val: T2
  }
  type T2 @public {
    val: String
  }
`;

const test3 = /* GraphQL */ `
  directive @public(
    detail: String = "No authentication required for this action"
  ) on FIELD_DEFINITION | OBJECT | UNION | ENUM

  type T1 {
    val: T2
  }
  type T2 {
    val: String
  }
`;

const test4 = /* GraphQL */ `
  directive @public(
    detail: String = "No authentication required for this action"
  ) on FIELD_DEFINITION | OBJECT | UNION | ENUM

  type T1 {
    val: T2 @public
  }
  type T2 @public {
    val: T3
  }
  type T3 @public {
    val: String
  }
`;

const test5 = /* GraphQL */ `
  directive @public(
    detail: String = "No authentication required for this action"
  ) on FIELD_DEFINITION | OBJECT | UNION | ENUM

  type T1 {
    val: T2
  }
  type T2 {
    val: T3 @public
  }
  type T3 @public {
    val: String
  }
`;

const test6 = /* GraphQL */ `
  directive @public(
    detail: String = "No authentication required for this action"
  ) on FIELD_DEFINITION | OBJECT | UNION | ENUM

  type T1 @public {
    val: T2
    val2: T3
  }
  type T2 @public {
    val: String
  }
  type T3 @public {
    val: String
  }
`;

const test7 = /* GraphQL */ `
  directive @public(
    detail: String = "No authentication required for this action"
  ) on FIELD_DEFINITION | OBJECT | UNION | ENUM
  """
  compliance principle
  """
  type compliancePrinciple @public {
    name: String!
    shorthand: String
    section: String!
    optional: Boolean!
    requirements: [complianceRequirement!]!
  }

  """
  compliance requirement
  """
  type complianceRequirement @public {
    name: String!
    section: String!
    shorthand: String
    controls: [complianceControl!]!
  }

  """
  compliance control
  """
  type complianceControl @public {
    key: String!
    control: String!
    name: String!
    tests(domainId: String!): [complianceTest!]!
  }

  """
  compliance test
  """
  type complianceTest @public {
    name: String!
    defaultRemediation: String!
    severity: String!
    test: String!
    testId: String!
  }
`;

const invalid1 = /* GraphQL */ `
  directive @public(
    detail: String = "No authentication required for this action"
  ) on FIELD_DEFINITION | OBJECT | UNION | ENUM

  type T1 {
    val: T2 @public
  }

  type T2 {
    val: String
  }
`;

const invalid2 = /* GraphQL */ `
  directive @public(
    detail: String = "No authentication required for this action"
  ) on FIELD_DEFINITION | OBJECT | UNION | ENUM

  type T1 {
    val: T2 @public
  }

  type T2 {
    val: String @public
  }
`;

const invalid3 = /* GraphQL */ `
  directive @public(
    detail: String = "No authentication required for this action"
  ) on FIELD_DEFINITION | OBJECT | UNION | ENUM

  type T1 {
    val: T2 @public
  }

  type T2 @public {
    val: T3
  }

  type T3 {
    val: String
  }
`;

const invalid4 = /* GraphQL */ `
  directive @public(
    detail: String = "No authentication required for this action"
  ) on FIELD_DEFINITION | OBJECT | UNION | ENUM

  type T1 {
    val: T2
  }

  type T2 {
    val: T3 @public
  }

  type T3 {
    val: String
  }
`;

ruleTester.runGraphQLTests("public-descendants-public", rule, {
  valid: [
    createValid(test1),
    createValid(test2),
    createValid(test3),
    createValid(test4),
    createValid(test5),
    createValid(test6),
    createValid(test7),
  ],
  invalid: [
    createInvalid(invalid1),
    createInvalid(invalid2),
    createInvalid(invalid3),
    createInvalid(invalid4),
  ],
});
