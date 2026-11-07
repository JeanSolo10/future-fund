import Decimal from 'decimal.js';
import type { TransactionCategory } from '../../object-types/transaction/transaction.enums';
import type { TransactionObjectType } from '../../object-types/transaction/transaction.type';

const listOfColors = [
  'rgba(231, 76, 60, 1)' /* Red */,
  'rgba(52, 152, 219, 1)' /* Blue */,
  'rgba(46, 204, 113, 1)' /* Green */,
  'rgba(230, 126, 34, 1)' /* Orange */,
  'rgba(26, 188, 156, 1)' /* Turquoise */,
  'rgba(241, 196, 15, 1)' /* Yellow */,
  'rgba(155, 89, 182, 1)' /* Purple */,
  'rgba(236, 240, 241, 1)' /* Light Gray */,
  'rgba(149, 165, 166, 1)' /* Gray */,
  'rgba(192, 57, 43, 1)' /* Dark Red */,
  'rgba(41, 128, 185, 1)' /* Dark Blue */,
  'rgba(39, 174, 96, 1)' /* Dark Green */,
  'rgba(243, 156, 18, 1)' /* Dark Orange */,
  'rgba(142, 68, 173, 1)' /* Dark Purple */,
  'rgba(22, 160, 133, 1)' /* Dark Turquoise */,
  'rgba(211, 84, 0, 1)' /* Burnt Orange */,
  'rgba(44, 62, 80, 1)' /* Dark Slate */,
  'rgba(127, 140, 141, 1)' /* Medium Gray */,
  'rgba(189, 195, 199, 1)' /* Silver */,
  'rgba(255, 87, 34, 1)' /* Deep Orange */,
];

/**
 * Aggregates expenses by category and returns formatted data for a pie chart.
 * Groups expenses by their category, sums the amounts per category, and returns
 * the totals along with corresponding colors for visualization.
 * @param {TransactionObjectType[]} expenses array of expenses to aggregate
 * @returns {{data: string[], colors: string[], categories: TransactionCategory[]}} Object containing:
 * - data: array of total amounts per category as strings
 * - colors: array of RGBA color strings (one per unique category)
 * - categories: array of categories, in the same order as data
 */

export const getPieChartDataByExpenseCategory = (
  expenses: TransactionObjectType[],
) => {
  const sortedExpenses = [...expenses].sort((a, b) => {
    const nameA = a.name.toLocaleLowerCase();
    const nameB = b.name.toLocaleLowerCase();

    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }
    return 0;
  });

  const totalByCategory = new Map<TransactionCategory, Decimal>();

  for (const expense of sortedExpenses) {
    const runningTotal =
      totalByCategory.get(expense.category) ?? new Decimal(0);
    totalByCategory.set(expense.category, runningTotal.plus(expense.amount));
  }

  return {
    data: [...totalByCategory.values()].map((total) => total.toString()),
    colors: listOfColors.slice(0, totalByCategory.size),
    categories: [...totalByCategory.keys()],
  };
};
