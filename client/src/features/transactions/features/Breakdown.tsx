import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  type ChartData,
} from 'chart.js';
import { Pie } from 'react-chartjs-2';

import type { ExpenseDataType, IncomeDataType } from '../types';
import { getPieChartDataByExpenseCategory } from '../graphHelper';
import type { TransactionCategory } from '../../../object-types/transaction/transaction.enums';

import ChartDataLabels from 'chartjs-plugin-datalabels';

type Props = {
  incomeData: IncomeDataType[];
  expenseData: ExpenseDataType[];
};

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

export const Breakdown: React.FC<Props> = ({ incomeData, expenseData }) => {
  const { data, colors } = getPieChartDataByExpenseCategory(expenseData);

  const generateDataForGraph = (): ChartData<
    'pie',
    string[],
    TransactionCategory
  > => {
    return {
      labels: [...new Set(expenseData.map((item) => item.category))],
      datasets: [
        {
          data,
          backgroundColor: colors,
          borderColor: colors,
          borderWidth: 1,
        },
      ],
    };
  };

  return (
    <div>
      <h2 style={{ textAlign: 'center' }}>Expenses</h2>
      <Pie
        data={generateDataForGraph()}
        options={{
          plugins: {
            datalabels: {
              color: 'black',
              formatter: (value) => `$${value}`,
            },
            legend: {
              position: 'bottom',
              align: 'start',
            },
          },
        }}
      />
    </div>
  );
};
