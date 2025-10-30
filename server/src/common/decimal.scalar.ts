import Decimal from 'decimal.js';
import {
  GraphQLError,
  GraphQLScalarLiteralParser,
  GraphQLScalarSerializer,
  GraphQLScalarType,
  GraphQLScalarValueParser,
  Kind,
} from 'graphql';

export class SafeDecimal extends Decimal {
  constructor(value: any) {
    super(value ?? 0);
  }
}

const serialize: GraphQLScalarSerializer<string> = (output) => {
  if (Decimal.isDecimal(output)) {
    return output.toString();
  }

  if (typeof output === 'string' || typeof output === 'number') {
    return output.toString();
  }

  throw new GraphQLError(
    'GraphQL serializer expected a `Decimal` object, string, or number',
  );
};

const parseValue: GraphQLScalarValueParser<Decimal> = (input) => {
  console.log('ON PARSING: ', typeof input);
  if (typeof input === 'string' || typeof input === 'number') {
    return new Decimal(input);
  }
  throw new GraphQLError('GraphQL parser expected a string');
};

const parseLiteral: GraphQLScalarLiteralParser<Decimal> = (ast) => {
  console.log('ON PARSE LITERAL: ', ast);
  if (ast.kind === Kind.STRING && ast.value) {
    return new Decimal(ast.value);
  }
  throw new GraphQLError('GraphQL ast parser expected a string');
};

export const CustomDecimalScalar = new GraphQLScalarType({
  name: 'Decimal',
  serialize,
  parseValue,
  parseLiteral,
});
