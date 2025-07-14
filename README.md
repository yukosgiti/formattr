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
  }
} satisfies FormatterDef<Date>;

const f = createFormatter([dateFormatter]);
const date = new Date(2023, 9, 1);

console.log(f(date).iso()); // '2023-10-01T12:00:00.000Z'
```

## Contributing

Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for contribution guidelines.

## License

MIT
