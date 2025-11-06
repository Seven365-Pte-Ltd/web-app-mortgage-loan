import { useState } from "react";

export type OptionValueChart = "Today" | "This Week" | "This Month" | "This Year";

interface ChartOptions {
  selectedOptionChart: OptionValueChart;
  optionsChart: OptionValueChart[];
  handleOptionClickChart: (optionChart: OptionValueChart) => void;
}

const useChartOptions = (initialOptionChart: OptionValueChart): ChartOptions => {
  const [selectedOptionChart, setSelectedOptionChart] = useState<OptionValueChart>(initialOptionChart);
  const optionsChart: OptionValueChart[] = ["Today", "This Week", "This Month", "This Year"];

  const handleOptionClickChart = (optionChart: OptionValueChart) => {
    setSelectedOptionChart(optionChart);
  };

  return { selectedOptionChart, optionsChart, handleOptionClickChart };
};

export default useChartOptions;
