import { historyChart } from "@/services/api";

function CryptoDetails() {
  return <div></div>;
}

export async function loader(params) {
  console.log(params.params.id);

  const data = await historyChart(params.params.name);
  return data;
}

export default CryptoDetails;
