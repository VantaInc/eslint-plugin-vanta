# Follow naming conventions for Mongoose models and schemas.

Identifiers for mongoose models and schemas should always be appropriately suffixed with 'Fields', 'Doc', or 'Model', and must share the same prefix.

## Rule Details

For a collection X, we use the following naming conventions:

```
XFields = typeof schema;
XDoc = XFields & mongoose.Document;
XModel = model<XDoc>(schema, options);
```

Examples of **incorrect** code for this rule:

```ts
type CollectionDoc = Collection & mongoose.Document;
```

```ts
type CollectionDocument = CollectionFields & mongoose.Document;
```

```ts
const Collection = model<CollectionDoc>("Collection", CollectionSchema);
```

```ts
type CollectionDoc = ColectionFields & mongoose.Document;
```

```ts
const ColectionModel = model<CollectionDoc>("Collection", CollectionSchema);
```

Examples of **correct** code for this rule:

```ts
type CollectionFields = typeof CollectionSchema;
type CollectionDoc = CollectionFields & mongoose.Document;
const collectionModel = model<CollectionDoc>(schema, options);
```
