// const options = {
//   method: 'GET',
//   headers: {accept: 'application/json', 'x-cg-pro-api-key': 'CG-RC2Qo7Y97cNVpFZAGKJBTGXp	'}
// };

export async function getCrypt() {
  const crytoData = await fetch(
    "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&page=1&sparkline=false"
  );

  const results = await crytoData.json();
  const data = results;
  return data;
}

export async function historyChart(name) {
  const res = await fetch(`https://api.coingecko.com/api/v3/coins/${name}/market_chart?vs_currency=usd&days=7`)

  const data = await res.json();
  console.log(data, "searchData");
  const result = data
  return result;
}
