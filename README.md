# formattr

A fully type-safe and extensible formatting library for TypeScript.


## Installation

```bash
npm install formattr
```

## Usage

```typescript
import createFormatter, {type FormatterDef} from 'formattr';

const dateFormatter = {
  isType: (value): value is Date => value instanceof Date,
  formatters: {
    /**
     * Formats the date as an ISO string.
     * @example
     * f(new Date(2023, 9, 1)).iso() == '2023-10-01T12:00:00.000Z' // true
     */
    iso(value) {
      return value.toISOString()
    },
    /**
     * Formats the date as a locale string.
     * @example
     * f(new Date(2023, 9, 1)).locale() == '10/1/2023' // true
     */
    timestamp(value) {
      return value.getTime()
    },
  }
} satisfies FormatterDef<Date>;

const f = createFormatter([dateFormatter]);
const date = new Date(2023, 9, 1);

console.log(f(date).iso()); // '2023-10-01T12:00:00.000Z'
```

> [!NOTE]
> The documentation for the `.iso()` method is also available in the IDE!<br>
> No need to look it up in the README or other documentation!

## Isn't this convoluted?

Well, yes and no. The library is designed to be fully type-safe and extensible, allowing you to define your own formatters for any type of data. This means you can create complex formatting logic while still maintaining type safety.

## Why not just have a single format object?
```ts
const f = {
  iso: (value: Date) => value.toISOString(),
  // other formatters...
}

f.iso(new Date(2023, 9, 1)); // '2023-10-01T12:00:00.000Z'
```

This is a valid approach but as the number of formatters grows, it is hard to find the right formatter for a specific object.  

```ts
f.data
f.date
f.datetime
f.decimal
```
## Contributing

Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for contribution guidelines.

## License

MIT
