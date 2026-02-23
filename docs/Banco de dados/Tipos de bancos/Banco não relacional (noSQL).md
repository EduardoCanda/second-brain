Bancos não relacionais não seguem um padrão de estrutura como os relacionais.

Os dados podem conter diversos tipos e quantidades, guardados de maneira não tabular.

Por exemplo:
```bash
 {
    _id: ObjectId("4556712cd2b2397ce1b47661"),
    name: { first: "Thomas", last: "Anderson" },
    date_of_birth: new Date('Sep 2, 1964'),
    occupation: [ "The One"],
    steps_taken : NumberLong(4738947387743977493)
}
```

