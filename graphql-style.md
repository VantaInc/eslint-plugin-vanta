# GraphQL Style/Implementation Guide <!-- omit in toc -->

This style guide describes best practices for Vanta's GraphQL API design and implementation. This is a living document; please feel free to propose changes!

# Table of Contents <!-- omit in toc -->

<!-- TOC generated using [VSCode "Markdown All in One"](https://marketplace.visualstudio.com/items?itemName=yzhang.markdown-all-in-one) -->

- [1. Getting started](#1-getting-started)
- [2. Schema style (implementation-independent rules for our .graphql files)](#2-schema-style-implementation-independent-rules-for-our-graphql-files)
  - [2.1. Guidelines for GraphQL types](#21-guidelines-for-graphql-types)
    - [2.1.1. Prefer custom scalar types with semantic meaning](#211-prefer-custom-scalar-types-with-semantic-meaning)
    - [2.1.2. Prefer non-nullable types](#212-prefer-non-nullable-types)
    - [2.1.3. Prefer ID types over String types for identifiers](#213-prefer-id-types-over-string-types-for-identifiers)
    - [2.1.4. Names should be as specific as possible](#214-names-should-be-as-specific-as-possible)
    - [2.1.5. Use enums when the set of types is constrained](#215-use-enums-when-the-set-of-types-is-constrained)
    - [2.1.6. Make impossible states impossible](#216-make-impossible-states-impossible)
    - [2.1.7. Prefer interfaces to unions when there is shared meaning](#217-prefer-interfaces-to-unions-when-there-is-shared-meaning)
    - [2.1.8. No type should depend on a sibling type to get relevant information](#218-no-type-should-depend-on-a-sibling-type-to-get-relevant-information)
  - [2.2. Guidelines for Errors](#22-guidelines-for-errors)
    - [2.2.1. Use union types to express user errors](#221-use-union-types-to-express-user-errors)
    - [2.2.2. Use the GraphQL `errors` key to return other errors](#222-use-the-graphql-errors-key-to-return-other-errors)
  - [2.3. Guidelines for Mutations](#23-guidelines-for-mutations)
    - [2.3.1. All mutations must be direct children of the root `Mutation` type](#231-all-mutations-must-be-direct-children-of-the-root-mutation-type)
    - [2.3.2. All mutations must return a unique union type with the suffix `Payload`](#232-all-mutations-must-return-a-unique-union-type-with-the-suffix-payload)
    - [2.3.3. Mutations must take a single, unique argument called `input`](#233-mutations-must-take-a-single-unique-argument-called-input)
    - [2.3.4. When in doubt, write 2 mutations](#234-when-in-doubt-write-2-mutations)
    - [2.3.5. Internal mutations should be prefixed with an underscore](#235-internal-mutations-should-be-prefixed-with-an-underscore)
  - [2.4. Guidelines for Queries](#24-guidelines-for-queries)
    - [2.4.1. When in doubt, write 2 queries](#241-when-in-doubt-write-2-queries)
    - [2.4.2. Use default arguments](#242-use-default-arguments)
    - [2.4.3. Offer a plural form for queries](#243-offer-a-plural-form-for-queries)
    - [2.4.4. Everywhere we return a list of non-constant length, paginate](#244-everywhere-we-return-a-list-of-non-constant-length-paginate)
  - [2.5. Pagination](#25-pagination)
    - [2.5.1. Use the Relay spec](#251-use-the-relay-spec)
    - [2.5.2. No more than 100 results per page](#252-no-more-than-100-results-per-page)
    - [2.5.3. Information about relationships between objects should be expressed on the `edges` field](#253-information-about-relationships-between-objects-should-be-expressed-on-the-edges-field)
  - [2.6. Deprecation](#26-deprecation)
- [3. Resolver style (rules for our .ts resolvers)](#3-resolver-style-rules-for-our-ts-resolvers)
  - [3.1. Resolvers should be as lazy as possible](#31-resolvers-should-be-as-lazy-as-possible)
  - [3.2. Use DataLoaders as much as possible](#32-use-dataloaders-as-much-as-possible)
  - [3.3. Every field in every type resolver should be defined.](#33-every-field-in-every-type-resolver-should-be-defined)
  - [3.4. Resolvers should have simple parent types](#34-resolvers-should-have-simple-parent-types)
  - [3.5. Performance](#35-performance)
  - [3.6. Authorization](#36-authorization)
  - [3.7. Do not use GraphQL as an IPC layer](#37-do-not-use-graphql-as-an-ipc-layer)
  - [3.8. Error handling](#38-error-handling)

# 1. Getting started

We use a schema-first design. This means that we explicitly define our entire GraphQL schema in the [Graphql Schema Definition Language](https://graphql.org/learn/schema/) (SDL). This allows us to define our schema independent of the implementation and ensure that we are prioritizing correct API design over convenient implementation.

Without tooling, schema-first API design can be difficult to maintain. To enforce implementation completeness and type correctness, we lean heavily on code generation.

# 2. Schema style (implementation-independent rules for our .graphql files)

> ### Automatically enforced rules
>
> We use [graphql-eslint](https://github.com/graphql-eslint/graphql-eslint) to enforce many style rules across our schema.
>
> In addition to the rules provided by graphql-eslint, we define our own rules in [eslint-plugin-vanta](https://github.com/VantaInc/eslint-plugin-vanta). Don't be afraid to introduce a new lint rule by submitting a PR to that repo and adding it to our linter!
>
> While these are all enforced by our linter, it's worth pointing out a few specific style rules:
>
> - Our GraphQL SDL files are all autoformatted by [Prettier](https://prettier.io/)
> - Descriptions are required on all object types
> - Unreachable types are banned and are automatically removed from the schema

## 2.1. Guidelines for GraphQL types

### 2.1.1. Prefer custom scalar types with semantic meaning

Sometimes a `String` is just a `String`. Often, however, a `String` is a bit of HTML, or a date, or an email address. In these cases, we prefer to define a custom scalar type that has semantic meaning. This allows developers to write validation/serialization logic that is more specific to that type and prevent leaking implementation details to API consumers.

Bad:

```graphql
type Webpage {
  contentHTML: String!
}
```

Good:

```graphql
type Webpage {
  content: HTML!
}
```

See our `DateTime` scalar for a good example of this rule in practice. Some common scalars are available in the [graphql-scalars library](https://www.graphql-scalars.dev/docs/introduction).

### 2.1.2. Prefer non-nullable types

Make fields non-nullable when we don't expect them to be null.

We use nullability to express the notion of optionality. If a field is _really_ nullable – e.g. an optional `displayName`, the schema should reflect that by allowing nullability. However, if a field cannot be resolved because of a failed network call, we prefer to fail the whole request instead of returning a null value.

This means that users may have to retry a whole request even if only one small part of the request fails. However, to prevent repeated null checks on the client-side, this is a tradeoff we're willing to make.

That said, changing a field from non-nullable to nullable is a breaking change, but the opposite isn't – if you're unsure about the nullability of a field, it's ok to make it nullable – we can always add an `!` later.

### 2.1.3. Prefer ID types over String types for identifiers

GraphQL has a built-in type called `ID` that is used to represent a unique identifier. For any non-human-readable ID, use `ID` instead of `String`.

Bad:

```graphql
type User {
  id: String!
  name: String!
}
```

Good:

```graphql
type User {
  id: ID!
  name: String!
}
```

The `id` field must be unique across all objects of a given type. That is, Object A === Object B iff their ids are equal. This is required for caching to work properly.

### 2.1.4. Names should be as specific as possible

It's difficult to change a field name once clients are using it. Make names overly specific so they're unlikely to collide with new concepts that we want to introduce to the graph.

Bad:

```graphql
type Query {
  teams: [Team!]!
}
```

Good:

```graphql
type Query {
  underwaterRugbyTeams: [UnderwaterRugbyTeam!]!
}
```

### 2.1.5. Use enums when the set of types is constrained

Often an input or output type is known to have a fixed set of possible values. In this case, we prefer to define an enum type. This allows safer API use and also generates a stricter TypesScript type for us.

Bad:

```graphql
type Paint {
  color: String!
}
```

Good:

```graphql
enum Color {
  RED
  GREEN
  BLUE
}

type Paint {
  color: Color!
}
```

### 2.1.6. Make impossible states impossible

It should be impossible to define a type with inconsistent information.

For example, the following is not allowed:

```graphql
type Address {
  zipcode: Zipcode
  postalCode: PostalCode
  city: String
  state: String
  province: String
}
```

Since a real address will probably have exactly one of zipcode and postalcode, and one of state or province. Instead, this should be rewritten as

```graphql
union Address = AmericanAddress | CanadianAddress

type AmericanAddress {
  zipcode: Zipcode!
  city: String!
  state: String!
}

type CanadianAddress {
  postalCode: PostalCode!
  city: String!
  province: String!
}
```

Another way to express this idea is: write types such that the number of non-nullable types is minimized. The type system should express constraints without requiring domain-specific knowledge from the api consumer.

This rule applies across our whole schema – several rules regarding [input types](#233-mutations-must-take-a-single-unique-argument-called-input) and [errors](#221-use-union-types-to-express-user-errors) are also implied by this philosophy.

### 2.1.7. Prefer interfaces to unions when there is shared meaning

Union types require the user to specify a case for every possible type. Interfaces allow a user to select fields in common if they don't care about the fields that differ.

Don't overuse interfaces – if a field does not have the same meaning between two types, it shouldn't be a common field on the interface, even if it shares a name. However, when there is a reasonable inheritance-esque relationship, use an interface instead of a union type.

Bad:

```graphql
union Animal = Dog | Cat

type Dog = {
  numLegs: Int!
  barksPerMinute: Int!
  name: String!
}

type Cat = {
  numLegs: Int!
  meowsPerMinute: Int!
  name: String!
}
```

Good:

```graphql
interface Animal {
  name: String!
  numLegs: Int!
}

type Dog implements Animal {
  numLegs: Int!
  barksPerMinute: Int!
  name: String!
}

type Cat implements Animal {
  numLegs: Int!
  meowsPerMinute: Int!
  name: String!
}
```

### 2.1.8. No type should depend on a sibling type to get relevant information

If there is a relationship between two types, expose the relationship in the graph – one should be a child of the other. They can also be children of one another.

In other words, avoid having fields on types that are simply IDs of other types. This allows the client to avoid complicated joins in most cases, and only fetch the necessary data.

Bad:

```graphql
type Cat {
  age: Int
  breed: String!
  name: String!
  nemesisId: String
  houseId: String
}

type Dog {
  age: Int
  breed: String!
  name: String!
  houseId: String
}

type House {
  id: String!
  name: String!
}

type Query {
  cats: [Cat!]!
  dogs: [Dog!]!
  houses: [House!]!
}

# this schema gives you all the information you need,
# but requires you to join after making database queries.
# Additionally, it makes pagination nearly impossible since you
# have to load all of the data to figure out what maps to what.
```

Good:

```graphql
type Cat {
  age: Int
  breed: String!
  name: String!
  nemesis: Dog
  house: House
}

type Dog {
  age: Int
  breed: String!
  name: String!
  house: House
}

type House {
  name: String!
  cats: [Cat!]!
  dogs: [Dog!]!
}

type Query {
  houses: [House!]!
  # and maybe, if we want to get them across all houses
  cats: [Cat!]!
  dogs: [Dog!]!
}

# now we can query using idiomatic graphql. Want to get a house with all its cats? That's just

query {
  houses {
    name
    cats {
      name
    }
  }
}
```

## 2.2. Guidelines for Errors

There are two types of errors that we might encounter when serving a request.

1. Logic errors – errors caused by a user doing something illegal given our business logic. For example, uploading a disallowed file type, insufficient funds for purchase, etc.
2. Generic server errors – errors that have nothing to do with the business logic but nonetheless caused a request to fail. For example, network errors, rate limiting, etc.

Logic errors fall into a few different subtypes:

1. VantaAuthenticationErrors - user is unauthenticated. This is an ApolloError extending the AuthenticationError type.
2. VantaForbiddenErrors - user is unauthorized. This is an ApolloError extending the ForbiddenError type.
3. ResourceNotFoundErrors - a resource we tried to look up doesn't exist. Note that this should also be used for resources that do exist but which the user cannot access. This is a custom ApolloError type.
4. InvalidInputErrors - something about the shape of the input was wrong, for example, SLA value was a negative number, startDate value was after endDate value, etc. Use this for cases where the client could have validated that the input was incorrect. This is an ApolloError extending the UserInputError type.
5. other expected user errors- user tried to do something illegal given our business logic, for example, uploading a disallowed file type. These errors are considered part of our API and should explicitly be part of the schema as types extending BaseUserError.

Queries should only ever use ApolloErrors, never UserErrors. [Queries that take list input and return list output](#244-offer-a-plural-form-for-queries) should not throw resource not found, but should return null values in the list for any missing resources.

Mutations may use ApolloErrors or UserErrors as appropriate.

### 2.2.1. Use union types to express user errors

When there is an expected failure case that we want to expose to the API consumer, we prefer to return a union type that contains all possible errors. This forces the client to decide how to handle the error and jives with our "make impossible states impossible" philosophy.

The error's \_\_typename should be used as the machine-readable error code. The message should be a message that can be shown to the user.
If an error type must expose fields other `message`, then you can define your own type which implements `UserError`.

```graphql
type Mutation {
  register(input: RegisterInput!): RegisterPayload
}

union RegisterPayload =
  RegisterSuccess |
  PasswordTooWeakError

interface UserError {
  message: String!
}

type PasswordTooWeakError implements UserError {
  message: String!
  passwordRules: [String!]!
}

...
```

All error types should extend the `UserError` interface so the client does not have to exhaustively check every possible error type.

For example, a client might make the following request:

```graphql
mutation {
  register(input: $input) {
    ... on RegisterSuccess {
      id
    }
    # Get message and code from all errors
    ... on UserError {
      __typename
      message
    }
    # Get additional specific info about PasswordTooWeak errors
    ... on PasswordTooWeakError {
      passwordRules
    }
  }
}
```

This way, adding new error types to the union doesn't break clients.

> Relevant lint rules:
>
> - [errors-implement-usererror](https://github.com/VantaInc/eslint-plugin-vanta/blob/master/docs/rules/errors-implement-usererror.md) (link to lint rule enforcing A type should extend the `UserError` interface iff its name ends with `Error`)

### 2.2.2. Use the GraphQL `errors` key to return other errors

GraphQL has a special `errors` key that allows us to return errors to the client. When a request is successful, it returns a `data` key that contains the requested data. However, if the request fails, it returns an `errors` key that contains a list of errors.

When we use one of the Apollo error types defined above, this information is returned in the `errors` key.

Unexpected errors should be reported as generic ServerErrors in the `errors` key.

Example developer error for a malformed request:

Query:

```graphql
query q {
  domain {
    idd
  }
}
```

Response:

```javascript
{
  "error": {
    "errors": [
      {
        "message": "Cannot query field \"idd\" on type \"domain\". Did you mean \"id\"?",
        "locations": [
          {
            "line": 3,
            "column": 5
          }
        ],
        "extensions": {
          "code": "GRAPHQL_VALIDATION_FAILED"
        }
      }
    ]
  }
}
```

Example developer error for a generic server error – basically equivalent to a 5xx:

```javascript
{
  "errors": [
    {
      "message": "Server error",
      "extensions": {
        "code": "ServerError"
      }
    }
  ],
  "data": null
}
```

## 2.3. Guidelines for Mutations

### 2.3.1. All mutations must be direct children of the root `Mutation` type

Bad:

```graphql
type Mutation {
  post: PostMutations
}

type PostMutations {
  like(id: ID!): LikePostPayload
  unlike(id: ID!): UnlikePostPayload
  create: CreatePostPayload
}
```

Good:

```graphql
type Mutation {
  likePost(id: ID!): LikePostPayload
  unlikePost(id: ID!): UnlikePostPayload
  createPost: CreatePostPayload
}
```

> **Rationale**:
> The [GraphQL spec](https://spec.graphql.org/) guarantees that mutations run serially, top-to-bottom.
> This means that the following mutation will be executed serially on the server, and the post is guaranteed to be unliked after it is executed:
>
> ```graphql
> mutation brokenLikeThenUnlikePost(id: $id) {
>   # this runs first
>   likePost(id: $id)
>   # then this runs
>   unlikePost(id: $id)
> }
> ```
>
> It may be tempting to namespace mutations to group related actions. However, the serial guarantee only applies to top-level mutations!
>
> ```graphql
> mutation likeThenUnlikePost(id: $id) {
>   post {
>     # This runs in parallel
>     like(id: $id)
>     # with this
>     unlike(id: $id)
>   }
> }
> ```
>
> So it's impossible to predict the outcome of multiple mutations in a single request.
>
> A user can force these to be executed serially by doing something like
>
> ```graphql
> mutation likeThenUnlikePost(id: $id) {
>  # this runs first
>   like: post {
>     like(id: $id)
>   }
>   # then this
>   unlike: post {
>     unlike(id: $id)
>   }
> }
> ```
>
> but we can't enforce that client code does this, so we don't allow it.

### 2.3.2. All mutations must return a unique union type with the suffix `Payload`

Mutations should all return union types named with the suffix `Payload`.

A mutation payload must contain a unique success object type with the suffix `Success`, the base error type `BaseUserError`, and zero or more specific error types that adhere to the [error guidelines](#22-guidelines-for-errors) above.

> This section is still being considered. Depending on implementation complexity, we may want to
> reevaluate whether every payload needs to be a union type and, if so, whether they should all include a `BaseUserError`.

```graphql
type Mutation {
  register(input: RegisterInput!): RegisterPayload
}

union RegisterPayload =
  RegisterSuccess |
  BaseUserError |
  InvalidEmailError |
  PasswordTooWeakError

type RegisterSuccess {
  user: User!
}

type BaseUserError implements UserError {
  message: String!
}

type InvalidEmailError implements UserError {
  ...
}

type PasswordTooWeakError implements UserError {
  ...
}
```

> Relevant lint rules:
>
> - [mutations-return-payload](https://github.com/VantaInc/eslint-plugin-vanta/blob/master/docs/rules/mutations-return-payload.md)
> - [mutations-payloads-unique](https://github.com/VantaInc/eslint-plugin-vanta/blob/master/docs/rules/mutations-payloads-unique.md)
> - [payloads-are-unions](https://github.com/VantaInc/eslint-plugin-vanta/blob/master/docs/rules/payloads-are-unions.md)

### 2.3.3. Mutations must take a single, unique argument called `input`

Having a unique `input` type for each mutation makes it easier for clients to pass objects in as input, and also allows us to add arguments without making a breaking change to the schema.

> Relevant lint rules:
>
> - [mutation-input-type](https://github.com/VantaInc/eslint-plugin-vanta/blob/master/docs/rules/mutations-input-type.md)
> - [mutations-inputs-unique](https://github.com/VantaInc/eslint-plugin-vanta/blob/master/docs/rules/mutations-inputs-unique.md)

### 2.3.4. When in doubt, write 2 mutations

Currently, there is no way to have a union input type. There is a [graphql proposal](https://github.com/graphql/graphql-spec/blob/main/rfcs/InputUnion.md) to add this feature, but it is not currently part of the spec.

In the spirit of the "make impossible states impossible" rule above, mutations (or queries) that require one of several arguments should be split into two mutations.

Bad:

```graphql
type Mutation {
  createUser(input: CreateUserInput!): CreateUserPayload
}

type CreateUserInput: {
  name: string!
  # exactly one of email and phoneNumber is required
  email: string
  phoneNumber: string
}

union CreateUserPayload =
  CreateUserSuccess |
  BaseUserError |
  InvalidEmailError |
  InvalidPhoneNumberError
```

Good:

```graphql
type Mutation {
  createUserByEmail(input: CreateUserByEmailInput!): CreateUserByEmailPayload
  createUserByPhoneNumber(input: CreateUserByPhoneNumberInput!): CreateUserByPhoneNumberPayload
}

type CreateUserByEmailInput: {
  name: String!
  email: String!
}

type CreateUserByPhoneNumberInput: {
  name: String!
  phoneNumber: String!
}

union CreateUserByEmailPayload =
  CreateUserSuccess |
  BaseUserError |
  InvalidEmailError

union CreateUserByPhoneNumberPayload =
  CreateUserSuccess |
  BaseUserError |
  InvalidPhoneNumberError
```

### 2.3.5. Internal mutations should be prefixed with an underscore

Mutations that are accessible only to internal Vanta users should be prefixed with a `_` character.

## 2.4. Guidelines for Queries

### 2.4.1. When in doubt, write 2 queries

See [the equivalent mutation rule](#234-when-in-doubt-write-2-mutations) above.

If a query takes a boolean argument, there's a good chance that it could be better rewritten as two queries.

Bad:

```graphql
type Query {
  getUsers(active: Boolean!): [User!]!
}
```

Good:

```graphql
type Query {
  getActiveUsers: [User!]!
  getInactiveUsers: [User!]!
}
```

### 2.4.2. Use default arguments

We want our API to be self-documenting when possible. Instead of providing a nullable parameter that requires documentation, provide a default value when it makes sense to do so.

Bad:

```graphql
type Query {
  """
  Default sort order is DESC
  """
  allUsers(sort: Order): [User!]!
}
```

Good:

```graphql
type Query {
  allUsers(sort: Order = DESC): [User!]!
}
```

### 2.4.3. Offer a plural form for queries

Usually, when there is a need for a query that selects a single object by some identifier, it is just as useful to have a more powerful query that selects multiple objects at a time.

Default to implementing a plural version of most fields. Dealing with a list can be annoying, so it's ok to also define a singular version when necessary.

Bad (no plural form):

```graphql
type Query {
  getUserById(id: ID!): User
}
```

Good (plural form):

```graphql
type Query {
  # List of users corresponds to the list of IDs. If a user is not found,
  # the value at that id's index is null.
  getUsersById(ids: [ID!]!): [User]!
}
```

Also OK (both, for really common queries)

```graphql
type Query {
  getUsersById(ids: [ID!]!): [User]!
  getUserById(id: ID!): User
}
```

Queries that take a list as a parameter must return a list of the same length, where the index of each result is the same as the index of the corresponding parameter.

### 2.4.4. Everywhere we return a list of non-constant length, paginate

An API consumer might ask for all of the users in their domain or all resources of some type. As our customers become more complex, these queries may return thousands or even hundreds of thousands of results. To guarantee reasonable performance invariants, we must offer paginated fields for all queries that return lists of results. We should not offer non-paginated alternatives.

See the [pagination section](#25-pagination) for details about pagination.

> Relevant lint rules:
>
> - [all-lists-in-connections](https://github.com/VantaInc/eslint-plugin-vanta/blob/master/docs/rules/all-lists-in-connections.md) (List types must be parts of connections or be whitelisted as constant length)

## 2.5. Pagination

### 2.5.1. Use the Relay spec

We use [relay-style pagination](https://relay.dev/graphql/connections.htm). I won’t copy that spec here.

> Relevant lint rules:
>
> - [connections-are-relay-compliant](https://github.com/VantaInc/eslint-plugin-vanta/blob/master/docs/rules/connections-are-relay-compliant.md) (Any type that ends in `Connection` must be a relay connection.)
> - [edges-are-relay-compliant](https://github.com/VantaInc/eslint-plugin-vanta/blob/master/docs/rules/edges-are-relay-compliant.md) (Any type that ends in `edge` must be a relay edge)

### 2.5.2. No more than 100 results per page

The Relay spec allows for a `first` or `last` argument to specify how many results to return. Queries requesting more than 100 results should be rejected.

### 2.5.3. Information about relationships between objects should be expressed on the `edges` field

A connection as described in the cursor spec looks like this:

```graphql
{
  user {
    # type: User
    id
    name
    friends(first: 10, after: "opaqueCursor") {
      edges {
        cursor
        node {
          # also type: User
          id
          name
        }
      }
      pageInfo {
        hasNextPage
      }
    }
  }
}
```

Information about the relationship between the user and their friends should live on the `edges` field, not on the user type:

```graphql
{
  user {
    id
    name
    friends(first: 10, after: "opaqueCursor") {
      edges {
        cursor
        howMet # The relationship between a user and a friend belongs on the edge, not on either user type
        node {
          id
          name
        }
      }
      pageInfo {
        hasNextPage
      }
    }
  }
}
```

## 2.6. Deprecation

Our GraphQL schema is [unversioned](https://graphql.org/learn/best-practices/#versioning). Instead, we continuously evolve our API. While we do our best to plan for the future, we sometimes need to make breaking changes. To do this, we use deprecation:

1. Add a @deprecated directive to the deprecated field or type, along with a reason and a planned removal date.
2. Monitor clients to ensure that the deprecated field is no longer being used.
3. Remove the field from the API

Some examples of breaking changes:-

- Removing a field
- Changing a field from non-nullable to nullable

# 3. Resolver style (rules for our .ts resolvers)

## 3.1. Resolvers should be as lazy as possible

Resolvers should do the meat of their logic as close to each “leaf” (scalar) as possible. If a user doesn't query for a field, we shouldn't do any extra work to compute it. Only when a user explicitly asks for a field should we compute and return it.

> **An example:**
> Consider the following graphql schema:
>
> ```graphql
> type Cat {
>   age: Int
>   breed: String!
>   name: String!
>   nemesis: Dog
> }
> type Dog {
>   age: Int
>   breed: String!
>   name: String!
>   favoriteFoods: [String!]!
> }
> type Query {
>   cats: [Cat!]!
>   dogs: [Dog!]!
> }
> ```
>
> And its corresponding database schema:
>
>     cats
>       id: mongoid
>       age: optionalNumber
>       breed: string
>       name: string
>       nemesisId: string (dogId)
>
>     dogs
>       id: mongoId
>       age: optionalNumber
>       breed: string
>       name: string
>       favoriteFoodsId: foodListId
>
>     foodList
>       id: mongoId
>       foods: string[]
>
> Resolver definitions:
>
> Bad
>
> ```js
> catsResolver:  // query resolver
>   allCats = cats.find()
>   nemeses = dogs.find(id in allCats.map(a => a.nemesisId))
>   // why do the work to get nemeses if we don't always query for it?
>   allCatsWithNemeses = allCats.map(c => c with nemesis)
>   // still need to get favorite food of the dogs here...
>   return allCatsWithNemeses
>
> dogsResolver: // query resolver
>   allDogs = dogs.find()
>   dogsWithFoods = []
>   for (dog in allDogs):
>     favoriteFoods = foodList.find(id: dog.favoriteFoodId)
>     dogsWithFoods.push({...dog, favoriteFoods})
>
> CatResolver: // type resolver
> // doesn't exist, since catsresolver already does this
>
> DogResolver: // type resolver
> // doesn't exist, since dogsresolver already gets all its fields
> ```
>
> Good
>
> ```js
> catsResolver:  // query resolver
>   return cats.find()
>
>
> dogsResolver: // query resolver
>   return dogs.find()
>
> CatResolver: // type resolver, parent is of type mongoCat
> {
>   // can technically omit, but explicit is better than implicit!
>     age: (parent) => parent.age
>     breed (parent) => parent.breed
>     name (parent) => parent.name
>     nemesis (parent, args, req) => GetDogByIdDataloader(req).load(parent.nemesisId)
> }
>
> DogResolver: // type resolver, parent is of type mongoDog
> {
>   age (parent) => parent.age
>   breed (parent) => parent.breed
>   name (parent) => parent.name
>   favoriteFoods (parent, args, req) => GetFavoriteFoodByIdDataLoader(req).load(parent.favoriteFoodsId)
> }
> ```
>
> With the “good” formulation, we could add another query `dogsWhoAreTenYearsoldOrYounger` with essentially a single line of code. With the `bad` formulation, we’d have to rewrite the dogsResolver.

## 3.2. Use DataLoaders as much as possible

Since clients can construct their own queries, they often query for the same bit of data multiple times in a graph. For example, consider the following query:

```graphql
query q {
  users {
    id
    name
    friends {
      id
      name
    }
  }
}
```

A naive implementation would be to do a database call to get the list of users, then another database call per (user, friend) pair to get the friend's name. This means that we need to make up to n^2 database calls to get the data we need!

We're doing a lot of redundant work here, though – we've already fetched all of the friends' names in the initial user list call. But we don't want to rewrite our logic to do extra work in the user list call since that would violate our principle of [laziness](#31-resolvers-should-be-as-lazy-as-possible).

Instead, we use a [DataLoader](https://github.com/graphql/dataloader). A DataLoader is a caching mechanism that allows you to request a single bit of data at each point in the graph, but it batches all of the requests together so redundant requests are only made once.

In most cases where you're making a database call within a resolver, you should be using a DataLoader since a client can request arbitrarily redundant information even if there isn't the n^2 relationship described above:

```graphql
query q {
  users1: getUsers(ids: [1, 2, 3]) {
    id
    name
  }
  users2: getUsers(ids: [2, 3, 4]) {
    id
    name
  }
}
```

> The [DataLoader README](https://github.com/graphql/dataloader#readme) does a more thorough job of explaining how and why to use DataLoaders.

## 3.3. Every field in every type resolver should be defined.

Defining every field is a bit of extra boilerplate, but guarantees type safety and allows us to add new fields extremely easily.

We autogenerate default resolvers for all queries, so this is as simple as importing `<type>DefaultResolvers` from `gqltypes.ts`.

```js
export const user: UserResolvers = {
  // autofill all of the default resolvers, like user.id
  ...userDefaultResolvers,
  // override or create resolvers for fields that need to be created on the fly
  displayName: (user) => user.firstname + " " + user.lastname,
};
```

## 3.4. Resolvers should have simple parent types

Resolvers for non-scalar types should almost always take an unmodified version of the corresponding database type as a parent. That means that any query can do a simple database call to filter the things it needs, then pass those straight down into a type resolver.

## 3.5. Performance

Resolvers should be as thin and light as possible and do a predictable amount of work.

We will introduce strict performance guidelines in the future, but for now, just remember:

- Try to ensure that any given resolver executes in well under 100ms
- Use DataLoaders!
- Resolvers should never do an unbounded amount of work – the amount of work done should be a small polynomial in the size of the input (linear in almost all cases) and the size of the input must be capped.

## 3.6. Authorization

All queries and mutations must have an explicit authorization rule defined.

Individual types and fields can also define authorization rules, but it's less common that this is necessary.

To prevent graph traversal vulnerabilities, ensure that the graph is structured in such a way that sensitive fields are never accessible from non-sensitive fields. See the [@public directive lint rule](https://github.com/VantaInc/eslint-plugin-vanta/blob/master/docs/rules/public-descendants-public.md) for more information.

## 3.7. Do not use GraphQL as an IPC layer

We haven't designed our GraphQL API to work well with inter-service communication. If you need two services to communicate, use a queue or something like gRPC, depending on your requirements.

## 3.8. Error handling

We discuss how errors are exposed to clients in the [Guidelines for Errors](#22-guidelines-for-errors) section. On the server side, we should never return an information-free `ServerError` unless something has really gone wrong.

Resolvers should handle errors that they know about and return non-sensitive `ApolloError`s to the frontend when possible. Only unexpected bugs should be exposed to the user as `ServerError`.
