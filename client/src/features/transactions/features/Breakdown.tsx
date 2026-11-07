import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  type ChartData,
} from 'chart.js';
import { Pie } from 'react-chartjs-2';

import { getPieChartDataByExpenseCategory } from '../graphHelper';
import type { TransactionCategory } from '../../../object-types/transaction/transaction.enums';
import type { TransactionObjectType } from '../../../object-types/transaction/transaction.type';

import ChartDataLabels from 'chartjs-plugin-datalabels';

type Props = {
  expenseData: TransactionObjectType[];
};

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

export const Breakdown: React.FC<Props> = ({ expenseData }) => {
  const { data, colors, categories } =
    getPieChartDataByExpenseCategory(expenseData);

  const generateDataForGraph = (): ChartData<
    'pie',
    string[],
    TransactionCategory
  > => {
    return {
      labels: categories,
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
    <div className="breakdown-container">
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
