import {
  GraphQLRuleTester,
  ParserOptions,
} from "@graphql-eslint/eslint-plugin";
import rule from "../../../lib/rules/public-descendants-public";

const ruleTester = new GraphQLRuleTester();

const useSchema = (
  schema: string
): { code: string; parserOptions: ParserOptions } => {
  return {
    parserOptions: { schema },
    code: schema,
  };
};

ruleTester.runGraphQLTests("public-descendants-public", rule, {
  valid: [
    useSchema(`
type T1 {
  val: T2 @public
}

type T2 @public {
  val: String
}
`),
    useSchema(`
type T1 {
  val: T2
}

type T2 @public {
  val: String
}
`),
    useSchema(`
type T1 {
  val: T2
}

type T2 {
  val: String
}
`),
    useSchema(`
type T1 {
  val: T2 @public
}

type T2 @public {
  val: T3
}

type T3 @public {
  val: String
}
`),

    useSchema(`
type T1 {
  val: T2
}

type T2 {
  val: T3 @public
}

type T3 @public {
  val: String
}
`),
    useSchema(`
type T1 {
  val: T2
}

type T2 {
  val: T3 @public
}

type T3 @public {
  val: String
}
`),
    useSchema(`
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
`),
  ],
  invalid: [
    {
      ...useSchema(`
type T1 {
  val: T2 @public
}

type T2 {
  val: String
}
`),
      errors: 1,
    },
    {
      ...useSchema(`
type T1 {
  val: T2 @public
}

type T2 {
  val: String @public
}
`),
      errors: 1,
    },
    {
      ...useSchema(`
type T1 {
  val: T2 @public
}

type T2 @public {
  val: T3
}

type T3 {
  val: String
}
`),
      errors: 1,
    },
    {
      ...useSchema(`
type T1 {
  val: T2
}

type T2 {
  val: T3 @public
}

type T3 {
  val: String
}
`),
      errors: 1,
    },
  ],
});
