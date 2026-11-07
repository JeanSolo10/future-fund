import { GraphQLError, Kind } from 'graphql';
import { CalendarDateScalar } from './calendar-date.scalar';

describe('CalendarDateScalar', () => {
  describe('serialize', () => {
    it('returns the calendar day of a Date at UTC midnight', () => {
      const storedDate = new Date('2026-11-01T00:00:00.000Z');

      expect(CalendarDateScalar.serialize(storedDate)).toBe('2026-11-01');
    });

    it('throws when the value is not a Date', () => {
      expect(() => CalendarDateScalar.serialize('2026-11-01')).toThrow(
        GraphQLError,
      );
    });
  });

  describe('parseValue', () => {
    it('turns YYYY-MM-DD into a Date at UTC midnight', () => {
      expect(CalendarDateScalar.parseValue('2026-11-01')).toEqual(
        new Date('2026-11-01T00:00:00.000Z'),
      );
    });

    it.each([
      ['a timestamp', '2026-10-31T23:00:00.000Z'],
      ['a missing leading zero', '2026-11-1'],
      ['a US-style date', '11/01/2026'],
      ['a day that does not exist', '2026-02-30'],
    ])('rejects %s', (_description, input) => {
      expect(() => CalendarDateScalar.parseValue(input)).toThrow(GraphQLError);
    });

    it('rejects a value that is not a string', () => {
      expect(() => CalendarDateScalar.parseValue(20261101)).toThrow(
        GraphQLError,
      );
    });
  });

  describe('parseLiteral', () => {
    it('turns a string literal into a Date at UTC midnight', () => {
      expect(
        CalendarDateScalar.parseLiteral({
          kind: Kind.STRING,
          value: '2026-11-01',
        }),
      ).toEqual(new Date('2026-11-01T00:00:00.000Z'));
    });

    it('rejects a literal that is not a string', () => {
      expect(() =>
        CalendarDateScalar.parseLiteral({ kind: Kind.INT, value: '20261101' }),
      ).toThrow(GraphQLError);
    });
  });
});
