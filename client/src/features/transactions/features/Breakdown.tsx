import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  type ChartData,
} from 'chart.js';
import { Pie } from 'react-chartjs-2';

import { getCategoryColors } from '../graphHelper';
import type { TransactionCategory } from '../../../object-types/transaction/transaction.enums';
import type { CategoryTotalObjectType } from '../../../object-types/transaction/transaction.type';

import ChartDataLabels from 'chartjs-plugin-datalabels';

type Props = {
  expenseTotalsByCategory: CategoryTotalObjectType[];
};

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

export const Breakdown: React.FC<Props> = ({ expenseTotalsByCategory }) => {
  const categories = expenseTotalsByCategory.map(
    (categoryTotal) => categoryTotal.category,
  );
  const totals = expenseTotalsByCategory.map(
    (categoryTotal) => categoryTotal.total,
  );
  const colors = getCategoryColors(expenseTotalsByCategory.length);

  const buildChartData = (): ChartData<
    'pie',
    string[],
    TransactionCategory
  > => {
    return {
      labels: categories,
      datasets: [
        {
          data: totals,
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
        data={buildChartData()}
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
