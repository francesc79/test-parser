# test-parser

JavaScript parser library.
The parser takes an object parameter and returns a value of property identified by a query string.

## Installing

```bash
npm install
```

## Building

```bash
npm run build
```

## Testing

```bash
npm test
```

## Documentation

```bash
npm run doc
```

## How to use

```bash
let context = {name:'pluto'};
let query = 'name';
console.log ("val:" + Parser.parse(context, query));
```
