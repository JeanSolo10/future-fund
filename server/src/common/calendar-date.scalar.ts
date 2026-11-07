import {
  GraphQLError,
  GraphQLScalarLiteralParser,
  GraphQLScalarSerializer,
  GraphQLScalarType,
  GraphQLScalarValueParser,
  Kind,
} from 'graphql';
import { DateTime } from 'luxon';

const CALENDAR_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

const toUtcMidnight = (value: string): Date => {
  const date = DateTime.fromISO(value, { zone: 'utc' });

  if (!CALENDAR_DATE_PATTERN.test(value) || !date.isValid) {
    throw new GraphQLError(
      `CalendarDate expects a real date formatted YYYY-MM-DD, received "${value}"`,
    );
  }

  return date.toJSDate();
};

const serialize: GraphQLScalarSerializer<string> = (output) => {
  if (output instanceof Date) {
    const calendarDate = DateTime.fromJSDate(output, {
      zone: 'utc',
    }).toISODate();

    if (calendarDate) {
      return calendarDate;
    }
  }

  throw new GraphQLError('CalendarDate serializer expected a valid Date');
};

const parseValue: GraphQLScalarValueParser<Date> = (input) => {
  if (typeof input === 'string') {
    return toUtcMidnight(input);
  }

  throw new GraphQLError('CalendarDate parser expected a string');
};

const parseLiteral: GraphQLScalarLiteralParser<Date> = (ast) => {
  if (ast.kind === Kind.STRING) {
    return toUtcMidnight(ast.value);
  }

  throw new GraphQLError('CalendarDate ast parser expected a string');
};

export const CalendarDateScalar = new GraphQLScalarType({
  name: 'CalendarDate',
  description: 'A calendar day with no time or timezone, formatted YYYY-MM-DD',
  serialize,
  parseValue,
  parseLiteral,
});
