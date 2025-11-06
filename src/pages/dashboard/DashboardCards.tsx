/* React Packages */
import { useState, useEffect, useRef } from "react";
import axios from "axios";
/* Custom Hook */
import useOptionsSelection from "../../hooks/useOptionSelection";
import { OptionValue } from "../../hooks/useOptionSelection";
import useChartOptions from "../../hooks/useOptionChart";
/* Components */
import ChartData from "../../components/ChartData";
import DashCard from "../../components/DashboardCard";
/* Icons */
import user from "../../assets/user.svg";
import arrowdown from "../../assets/arrowdown.svg";
import up from "../../assets/up.svg";
import chart from "../../assets/chart.svg";
import check from "../../assets/check.svg";
import refinance from "../../assets/refinance.svg";
import house from "../../assets/house.svg";
import building from "../../assets/building.svg";
import buc from "../../assets/buc.svg";
import check2 from "../../assets/check2.svg";

interface ChartDataItem {
  description: string;
  count: number;
}
interface ChartState {
  showChart: boolean;
  data: ChartDataItem[];
}

const DashboardCards: React.FC = () => {
  const {
    selectedOptions,
    options,
    handleOptionClick,
    inquiryData,
    newPurchaseData,
    refinanceData,
    privateResidentialData,
    hdbData,
    commercialData,
    bucData
  } = useOptionsSelection();
  const { selectedOptionChart, optionsChart, handleOptionClickChart } =
    useChartOptions("Today");
  const [inquiryChartData, setInquiryChartData] = useState<ChartState>({
    showChart: false,
    data: [],
  });
  const [newPurchaseChartData, setNewPurchaseChartData] = useState<ChartState>({
    showChart: false,
    data: [],
  });
  const [refinanceChartData, setRefinanceChartData] = useState<ChartState>({
    showChart: false,
    data: [],
  });
  const [privateResidentialChartData, setPrivateResidentialChartData] =
    useState<ChartState>({ showChart: false, data: [] });
  const [hdbChartData, setHdbChartData] = useState<ChartState>({
    showChart: false,
    data: [],
  });
  const [commercialChartData, setCommercialChartData] = useState<ChartState>({
    showChart: false,
    data: [],
  });
  const [bucChartData, setBucChartData] = useState<ChartState>({
    showChart: false,
    data: [],
  });

  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        chartRef.current &&
        !chartRef.current.contains(event.target as Node)
      ) {
        setInquiryChartData({ ...inquiryChartData, showChart: false });
        setNewPurchaseChartData({ ...newPurchaseChartData, showChart: false });
        setRefinanceChartData({ ...refinanceChartData, showChart: false });
        setPrivateResidentialChartData({
          ...privateResidentialChartData,
          showChart: false,
        });
        setHdbChartData({ ...hdbChartData, showChart: false });
        setCommercialChartData({ ...commercialChartData, showChart: false });
        setBucChartData({...bucChartData, showChart: false });
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [
    inquiryChartData,
    newPurchaseChartData,
    refinanceChartData,
    privateResidentialChartData,
    hdbChartData,
    commercialChartData,
    bucChartData,
  ]);
  useEffect(() => {
    if (inquiryChartData.showChart) {
      fetchChartData(
        "/dashboard/numberOfEnquiry/detail",
        setInquiryChartData,
        selectedOptions["Enquiries"]
      );
    }
    if (newPurchaseChartData.showChart) {
      fetchChartData(
        "/dashboard/numberOfNewPurchase/detail",
        setNewPurchaseChartData,
        selectedOptions["New Purchase"]
      );
    }
    if (refinanceChartData.showChart) {
      fetchChartData(
        "/dashboard/numberOfRefinance/detail",
        setRefinanceChartData,
        selectedOptions["Refinance"]
      );
    }
    if (privateResidentialChartData.showChart) {
      fetchChartData(
        "/dashboard/numberOfPrivateResidential/detail",
        setPrivateResidentialChartData,
        selectedOptions["Private Residential"]
      );
    }
    if (hdbChartData.showChart) {
      fetchChartData(
        "/dashboard/numberOfHDB/detail",
        setHdbChartData,
        selectedOptions["HDB"]
      );
    }
    if (commercialChartData.showChart) {
      fetchChartData(
        "/dashboard/numberOfCommercial/detail",
        setCommercialChartData,
        selectedOptions["Commercial"]
      );
    }
    if (bucChartData.showChart) {
      fetchChartData(
        "/dashboard/numberOfBUC/detail",
        setBucChartData,
        selectedOptions["BUC"]
      );
    }
  }, [
    inquiryChartData.showChart,
    selectedOptions,
    selectedOptionChart,
    newPurchaseChartData.showChart,
    refinanceChartData.showChart,
    privateResidentialChartData.showChart,
    hdbChartData.showChart,
    commercialChartData.showChart,
    bucChartData.showChart,
  ]);
  const fetchChartData = async (
    url: string,
    setState: React.Dispatch<React.SetStateAction<ChartState>>,
    option: OptionValue
  ) => {
    let detailType: number;
    switch (option) {
      case "Today":
        detailType = 0;
        break;
      case "This Week":
        detailType = 1;
        break;
      case "This Month":
        detailType = 2;
        break;
      case "This Year":
        detailType = 3;
        break;
      default:
        detailType = 0;
    }

    try {
      const response = await axios.get<ChartDataItem[]>(
        `${url}?DashboardDetailType=${detailType}`
      );
      setState({ showChart: true, data: response.data });
    } catch (error) {
      console.error("Error fetching chart data:", error);
    }
  };

  const toggleChartData = (
    chartData: ChartState,
    setChartData: React.Dispatch<React.SetStateAction<ChartState>>
  ) => {
    setChartData({ ...chartData, showChart: !chartData.showChart });
  };

  return (
    <div className="flex flex-row items-center gap-8 flex-wrap font-poppins relative">
      <div className="flex items-center lg:flex-row flex-col gap-4 content w-full">
      <div className="mobile-relative content w-full">
        <DashCard
          title="Number of Enquiries"
          userIcon={user}
          arrowDownIcon={arrowdown}
          checkIcon={check2}
          upIcon={up}
          chartIcon={chart}
          inquiryData={inquiryData}
          options={options}
          selectedOption={selectedOptions["Enquiries"]}
          handleOptionClick={(option: OptionValue) =>
            handleOptionClick("Enquiries", option)
          }
          handleChartData={() => {
            if (!inquiryChartData.showChart) {
              fetchChartData(
                "/dashboard/numberOfEnquiry/detail",
                setInquiryChartData,
                selectedOptions["Enquiries"]
              );
            }
            toggleChartData(inquiryChartData, setInquiryChartData);
            handleOptionClickChart(selectedOptions["Enquiries"]);
          }}
          customWidth="lg:w-full"
          customHeight="h-[246px]"
        />
        {inquiryChartData.showChart && (
          <div
            ref={chartRef}
            className="z-10 lg:absolute top-60 right-0 left-0 lg:flex items-center justify-center lg:-mt-32"
          >
            <ChartData
              title="Enquiries"
              iconChart={user}
              data={inquiryChartData.data}
              optionsChart={optionsChart}
              selectedOptionChart={selectedOptionChart}
              selectedOption={selectedOptions["Enquiries"]}
              handleOptionClick={(option: OptionValue) =>
                handleOptionClick("Enquiries", option)
              }
              initialOptionChart={selectedOptionChart}
              growthRate={inquiryData?.growthRate}
            />
          </div>
        )}
      </div>
      <div className="mobile-relative content w-full">
        <DashCard
          title="Number of New Purchase"
          userIcon={check}
          arrowDownIcon={arrowdown}
          checkIcon={check2}
          upIcon={up}
          chartIcon={chart}
          inquiryData={newPurchaseData}
          options={options}
          selectedOption={selectedOptions["New Purchase"]}
          handleOptionClick={(option: OptionValue) =>
            handleOptionClick("New Purchase", option)
          }
          handleChartData={() => {
            if (!newPurchaseChartData.showChart) {
              fetchChartData(
                "/dashboard/numberOfNewPurchase/detail",
                setNewPurchaseChartData,
                selectedOptions["New Purchase"]
              );
            }
            toggleChartData(newPurchaseChartData, setNewPurchaseChartData);
            handleOptionClickChart(selectedOptions["New Purchase"]);
          }}
          customWidth="lg:w-full"
          customHeight="h-[246px]"
        />
        {newPurchaseChartData.showChart && (
          <div
            ref={chartRef}
            className="z-10 lg:absolute top-60 right-0 left-0 lg:flex items-center justify-center lg:-mt-32"
          >
            <ChartData
              title="New Purchases"
              iconChart={check}
              data={newPurchaseChartData.data}
              optionsChart={optionsChart}
              selectedOptionChart={selectedOptionChart}
              selectedOption={selectedOptions["New Purchase"]}
              handleOptionClick={(option: OptionValue) =>
                handleOptionClick("New Purchase", option)
              }
              initialOptionChart={selectedOptionChart}
              growthRate={newPurchaseData?.growthRate}
            />
          </div>
        )}
      </div>
      <div className="mobile-relative content w-full">
      <DashCard
          title="Number of Refinance"
          userIcon={refinance}
          arrowDownIcon={arrowdown}
          checkIcon={check2}
          upIcon={up}
          chartIcon={chart}
          inquiryData={refinanceData}
          options={options}
          selectedOption={selectedOptions["Refinance"]}
          handleOptionClick={(option: OptionValue) =>
            handleOptionClick("Refinance", option)
          }
          handleChartData={() => {
            if (!refinanceChartData.showChart) {
              fetchChartData(
                "/dashboard/numberOfRefinance/detail",
                setRefinanceChartData,
                selectedOptions["Refinance"]
              );
            }
            toggleChartData(refinanceChartData, setRefinanceChartData);
            handleOptionClickChart(selectedOptions["Refinance"]);
          }}
          customWidth="lg:w-full"
          customHeight="h-[246px]"
        />
        {refinanceChartData.showChart && (
          <div
            ref={chartRef}
            className="z-10 lg:absolute top-60 right-0 left-0 lg:flex items-center justify-center lg:-mt-32"
          >
            <ChartData
              title="Refinance"
              iconChart={refinance}
              data={refinanceChartData.data}
              optionsChart={optionsChart}
              selectedOptionChart={selectedOptionChart}
              selectedOption={selectedOptions["Refinance"]}
              handleOptionClick={(option: OptionValue) =>
                handleOptionClick("Refinance", option)
              }
              initialOptionChart={selectedOptionChart}
              growthRate={refinanceData?.growthRate}
            />
          </div>
        )}
      </div>
      </div>
      <div className="flex items-center lg:flex-row flex-col gap-4 content w-full">
      <div className="mobile-relative content w-full">
      <DashCard
          title="Private Residential"
          userIcon={house}
          arrowDownIcon={arrowdown}
          checkIcon={check2}
          upIcon={up}
          chartIcon={chart}
          inquiryData={privateResidentialData}
          options={options}
          selectedOption={selectedOptions["Private Residential"]}
          handleOptionClick={(option: OptionValue) =>
            handleOptionClick("Private Residential", option)
          }
          handleChartData={() => {
            if (!privateResidentialChartData.showChart) {
              fetchChartData(
                "/dashboard/numberOfPrivateResidential/detail",
                setPrivateResidentialChartData,
                selectedOptions["Private Residential"]
              );
            }
            toggleChartData(
              privateResidentialChartData,
              setPrivateResidentialChartData
            );
            handleOptionClickChart(selectedOptions["Private Residential"]);
          }}
          customWidth="w-full"
          customHeight="h-[246px]"
        />
        {privateResidentialChartData.showChart && (
          <div
            ref={chartRef}
            className="z-10 lg:absolute top-60 right-0 left-0 lg:flex items-center justify-center lg:-mt-32"
          >
            <ChartData
              title="Private Residential"
              iconChart={house}
              data={privateResidentialChartData.data}
              optionsChart={optionsChart}
              selectedOptionChart={selectedOptionChart}
              selectedOption={selectedOptions["Private Residential"]}
              handleOptionClick={(option: OptionValue) =>
                handleOptionClick("Private Residential", option)
              }
              initialOptionChart={selectedOptionChart}
              growthRate={privateResidentialData?.growthRate}
            />
          </div>
        )}
      </div>
      <div className="mobile-relative content w-full">
      <DashCard
          title="HDB"
          userIcon={house}
          arrowDownIcon={arrowdown}
          checkIcon={check2}
          upIcon={up}
          chartIcon={chart}
          inquiryData={hdbData}
          options={options}
          selectedOption={selectedOptions["HDB"]}
          handleOptionClick={(option: OptionValue) =>
            handleOptionClick("HDB", option)
          }
          handleChartData={() => {
            if (!hdbChartData.showChart) {
              fetchChartData(
                "/dashboard/numberOfHDB/detail",
                setHdbChartData,
                selectedOptions["HDB"]
              );
            }
            toggleChartData(hdbChartData, setHdbChartData);
            handleOptionClickChart(selectedOptions["HDB"]);
          }}
          customWidth="w-full"
          customHeight="h-[246px]"
        />
        {hdbChartData.showChart && (
          <div
            ref={chartRef}
            className="z-10 lg:absolute top-60 right-0 left-0 lg:flex items-center justify-center lg:-mt-32"
          >
            <ChartData
              title="HDB"
              iconChart={house}
              data={hdbChartData.data}
              optionsChart={optionsChart}
              selectedOptionChart={selectedOptionChart}
              selectedOption={selectedOptions["HDB"]}
              handleOptionClick={(option: OptionValue) =>
                handleOptionClick("HDB", option)
              }
              initialOptionChart={selectedOptionChart}
              growthRate={hdbData?.growthRate}
            />
          </div>
        )}
      </div>
      <div className="mobile-relative content w-full">
      <DashCard
          title="Commercial"
          userIcon={building}
          arrowDownIcon={arrowdown}
          checkIcon={check2}
          upIcon={up}
          chartIcon={chart}
          inquiryData={commercialData}
          options={options}
          selectedOption={selectedOptions["Commercial"]}
          handleOptionClick={(option: OptionValue) =>
            handleOptionClick("Commercial", option)
          }
          handleChartData={() => {
            if (!commercialChartData.showChart) {
              fetchChartData(
                "/dashboard/numberOfCommercial/detail",
                setCommercialChartData,
                selectedOptions["Commercial"]
              );
            }
            toggleChartData(commercialChartData, setCommercialChartData);
            handleOptionClickChart(selectedOptions["Commercial"]);
          }}
          customWidth="w-full"
          customHeight="h-[246px]"
        />
        {commercialChartData.showChart && (
          <div
            ref={chartRef}
            className="z-10 lg:absolute top-60 right-0 left-0 lg:flex items-center justify-center lg:-mt-32"
          >
            <ChartData
              title="Commercial"
              iconChart={building}
              data={commercialChartData.data}
              optionsChart={optionsChart}
              selectedOptionChart={selectedOptionChart}
              selectedOption={selectedOptions["Commercial"]}
              handleOptionClick={(option: OptionValue) =>
                handleOptionClick("Commercial", option)
              }
              initialOptionChart={selectedOptionChart}
              growthRate={commercialData?.growthRate}
            />
          </div>
        )}
      </div>
      <div className="mobile-relative content w-full">
      <DashCard
          title="BUC"
          userIcon={buc}
          arrowDownIcon={arrowdown}
          checkIcon={check2}
          upIcon={up}
          chartIcon={chart}
          inquiryData={bucData}
          options={options}
          selectedOption={selectedOptions["BUC"]}
          handleOptionClick={(option: OptionValue) =>
            handleOptionClick("BUC", option)
          }
          handleChartData={() => {
            if (!bucChartData.showChart) {
              fetchChartData(
                "/dashboard/numberOfBUC/detail",
                setBucChartData,
                selectedOptions["BUC"]
              );
            }
            toggleChartData(bucChartData, setBucChartData);
            handleOptionClickChart(selectedOptions["BUC"]);
          }}
          customWidth="w-full"
          customHeight="h-[246px]"
        />
        {bucChartData.showChart && ( 
          <div
            ref={chartRef}
            className="z-10 lg:absolute bottom-12 right-0 left-0 lg:top-32 lg:left-20 lg:right-40"
          >
            <ChartData
              title="BUC"
              iconChart={buc}
              data={bucChartData.data}
              optionsChart={optionsChart}
              selectedOptionChart={selectedOptionChart}
              selectedOption={selectedOptions["BUC"]}
              handleOptionClick={(option: OptionValue) =>
                handleOptionClick("BUC", option)
              }
              initialOptionChart={selectedOptionChart}
              growthRate={bucData?.growthRate}
            />
          </div>
        )}
      </div>
      </div>
    </div>
  );
};

export default DashboardCards;
