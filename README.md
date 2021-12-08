# eslint-plugin-vanta

Custom ESLint rules for Vanta. The TypeScript rules assume the existence of certain primitives, like the `Maybe` type, and may not be useful to codebases other than Vanta's. The GraphQL rules
enforce various invariants described in our GraphQL style guide.

# Style guide

The public version of our GraphQL style guide can be found [here](/graphql-style.md).

## Installation

You'll first need to install [ESLint](http://eslint.org):

```
$ npm i eslint --save-dev
```

Next, install `eslint-plugin-vanta`:

```
$ npm install @vanta-inc/eslint-plugin-vanta --save-dev
```

## Usage

Add `vanta` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
  "plugins": ["@vanta-inc/eslint-plugin-vanta"]
}
```

Then configure the rules you want to use under the rules section.

```json
{
  "rules": {
    "@vanta-inc/vanta/rule-name": 2
  }
}
```

## Creating a new rule

- Rule definitions live in `/lib/rules/<rule-name>.ts`
- Tests live in `/tests/lib/rules/<rule-name>.test.ts`
- Documentation lives in `/docs/rules/<rule-name>.md`

Hot tips:

- For an example GraphQL schema rule, see [mutations-return-payload](/lib/rules/mutations-return-payload.ts)
- For an example TypeScript rule, see [prefer-maybe](/lib/rules/prefer-maybe.ts)
- Use https://astexplorer.net/ to explore a TypeScript or GraphQL AST so you don't have to guess which type you're dealing with!
- See also https://eslint.org/docs/developer-guide/selectors to understand ESLint selectors
- Run `npm run build-and-test` to test your rules

## Supported Rules

### TypeScript

- [common-absolute-import](/docs/rules/common-absolute-import.md)
- [server-common-absolute-import](/docs/rules/server-common-absolute-import.md)
- [null-or-undefined-check](/docs/rules/null-or-undefined-check.md)
- [optional-always-maybe](/docs/rules/optional-always-maybe.md)
- [prefer-maybe](/docs/rules/prefer-maybe.md)
- [mongoose-naming-convention](/docs/rules/mongoose-naming-convention.md)

### GraphQL

- [all-lists-in-connections](docs/rules/all-lists-in-connections.md)
- [connections-are-relay-compliant](/docs/rules/connections-are-relay-compliant.md)
- [edges-are-relay-compliant](/docs/rules/edges-are-relay-compliant.md)
- [errors-implement-usererror](docs/rules/errors-implement-usererror.md)
- [mutations-input-type](/docs/rules/mutations-input-type.md)
- [mutations-inputs-unique](/docs/rules/mutations-inputs-unique.md)
- [mutations-payloads-unique](/docs/rules/mutations-payloads-unique.md)
- [mutations-return-payload](/docs/rules/mutations-return-payload.md)
- [payloads-are-unions](/docs/rules/payloads-are-unions.md)
- [public-descendants-public](/docs/rules/public-descendants-public.md)
