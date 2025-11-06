import { useState, useEffect } from 'react';
import axios from 'axios';

export type OptionValue = "Today" | "This Week" | "This Month" | "This Year";

interface Data {
  count: number;
  growthRate: number;
}

interface SelectedOptions {
  [key: string]: OptionValue;
}

const useOptionsSelection = () => {
  const [selectedOptions, setSelectedOptions] = useState<SelectedOptions>({
    "Enquiries": "Today",
    "New Purchase": "Today",
    "Refinance": "Today",
    "Private Residential": "Today",
    "HDB": "Today",
    "Commercial": "Today",
    "BUC": "Today",
  });

  const options: OptionValue[] = ["Today", "This Week", "This Month", "This Year"];

  const handleOptionClick = (cardTitle: string, option: OptionValue) => {
    setSelectedOptions(prevState => ({
      ...prevState,
      [cardTitle]: option
    }));
  };
  const [inquiryData, setInquiryData] = useState<Data | null>(null);
  const [newPurchaseData, setNewPurchaseData] = useState<Data | null>(null);
  const [refinanceData, setRefinanceData] = useState<Data | null>(null);
  const [privateResidentialData, setPrivateResidentialData] = useState<Data | null>(null);
  const [hdbData, setHdbData] = useState<Data | null>(null);
  const [commercialData, setCommercialData] = useState<Data | null>(null);
  const [bucData, setBucData] = useState<Data | null>(null);

  useEffect(() => {
    const fetchData = async (cardTitle: string) => {
      try {
        const dashboardPeriods: { [key in OptionValue]: number } = {
          "Today": 0,
          "This Week": 1,
          "This Month": 2,
          "This Year": 3
        };

        const dashboardPeriod = dashboardPeriods[selectedOptions[cardTitle]];
        const response = await axios.get(`/dashboard/${
          cardTitle === "Enquiries" 
            ? "numberOfEnquiry" 
            : cardTitle === "New Purchase" 
              ? "numberOfNewPurchase" 
              : cardTitle === "Refinance" 
                ? "numberOfRefinance" 
                : cardTitle === "Private Residential" 
                  ? "numberOfPrivateResidential" 
                  : cardTitle === "HDB" 
                    ? "numberOfHDB" 
                    : cardTitle === "Commercial" 
                      ? "numberOfCommercial" 
                      : cardTitle === "BUC"
                      ? "numberOfBUC"
                      : ""
        }?DashboardPeriod=${dashboardPeriod}`, {
          params: {
            timeframe: selectedOptions[cardTitle]
          }
        });

        return response.data;
      } catch (error) {
        console.error(`Error fetching ${cardTitle.toLowerCase()}:`, error);
      }
    };

    const fetchAllData = async () => {
      const [inquiriesResponse, newPurchaseResponse, refinanceResponse, privateResidentialResponse, hdbResponse, commercialResponse, bucResponse] = await Promise.all([
        fetchData("Enquiries"),
        fetchData("New Purchase"),
        fetchData("Refinance"),
        fetchData("Private Residential"),
        fetchData("HDB"),
        fetchData("Commercial"),
        fetchData("BUC"),
      ]);
      setInquiryData(inquiriesResponse);
      setNewPurchaseData(newPurchaseResponse);
      setRefinanceData(refinanceResponse);
      setPrivateResidentialData(privateResidentialResponse);
      setHdbData(hdbResponse);
      setCommercialData(commercialResponse);
      setBucData(bucResponse);
    };

    fetchAllData();
  }, [selectedOptions]);

  return {
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
  };
};

export default useOptionsSelection;
