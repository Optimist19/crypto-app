// import { historyChart } from "@/services/api";

function CryptoDetails() {
  return <div></div>;
}

export async function loader(params) {
  console.log(params.params.id);

  const data = await historyChart(params.params.name);
  return data;
}

export default CryptoDetails;

// NB. While developing the project, I already set up the routing and be able to get more details about each cryptocurrency, then when I felt there is no need anymore, removing this component and the routing setup in the App file, error started coming up from the useEffect hook having the tradingview Code. So I had to bring everything back and then make this component the way it is now.