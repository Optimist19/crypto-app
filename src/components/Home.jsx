import { useEffect, useState, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { getCrypt } from "../services/api";
import { Input } from "./ui/input";

import { FaSearch } from "react-icons/fa";
import { Skeleton } from "./ui/skeleton";

import { GoArrowUpRight } from "react-icons/go";
import { GoArrowDownRight } from "react-icons/go";
import { ImCancelCircle } from "react-icons/im";

import { data as cryptoPairs } from "@/data";

// import {Stack} from "@mui/material/Stack";
import Badge from "@mui/material/Badge";
import MailIcon from "@mui/icons-material/Mail";
// import { MailLock } from "@mui/icons-material";
// import { Stack } from "@mui/system";

function Home() {
  const [text, setText] = useState("");
  const [searchedArr, setSearchArr] = useState([]);
  const [count, setCount] = useState(0);
  const [performance, setPerformance] = useState("");
  const container = useRef();
  const [isLight, setIsLight] = useState("light");
  const [showDrawingToolsBar, setShowDrawingToolsBar] = useState(false);
  const [details, setDetails] = useState(false);
  const [cryptPairSearch, setCryptPairSearch] = useState("");
  const [cryptPairSearchResult, setCryptPairSearchResult] =
    useState(cryptoPairs);
  const [modal, setModal] = useState(false);
  const [brokerName, setBrokerName] = useState("NASDAQ");
  const [pairedCode, setPairedCode] = useState("AAPL");
  const [news, setNews] = useState([]);
  const [newsModal, setNewsModal] = useState(false);
  const [messageIcon, setMessageIcon] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["crypoData"],
    queryFn: getCrypt
  });

  const fetchCryptoNews = async () => {
    const response = await fetch(
      "https://newsdata.io/api/1/latest?apikey=pub_5003626ffc65be9b566bcfbbe8d13663b5474"
    );
    const data = await response.json();
    setNews(data.results);
    setMessageIcon(false);
  };

  useEffect(() => {
    fetchCryptoNews();
    const interval = setInterval(() => {
      setCount(count + 1);
      messageIcon(true);
    }, 50000);
    return () => clearInterval(interval);
  }, [count]);

  // useEffect(() => {
  //   const script = document.createElement("script");
  //   script.src =
  //     "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
  //   script.type = "text/javascript";
  //   script.async = true;
  //   script.innerHTML = `
  //       {
  //         "autosize": true,
  //         "symbol": `${brokerName}:${pairCode}`,
  //         "interval": "D",
  //         "timezone": "Etc/UTC",
  //         "theme": "${isLight}"
  //         "style": "1",
  //         "locale": "en",
  //         "hide_side_toolbar": showDrawingToolsBar,
  //         "allow_symbol_change": true,
  //         "details": details,
  //         "calendar": false,
  //         "support_host": "https://www.tradingview.com"
  //       }`;
  //   container.current.appendChild(script);

  //   return () => {
  //     container.current.removeChild(script);
  //   };
  // }, [isLight, showDrawingToolsBar, details]);

  // console.log(count, "count");

  // console.log(searchedArr, "searchedArr");

  useEffect(() => {
    if (container.current) {
      const script = document.createElement("script");
      script.src =
        "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
      script.type = "text/javascript";
      script.async = true;
      script.innerHTML = JSON.stringify({
        autosize: true,
        symbol: `${brokerName}:${pairedCode}`,
        interval: "D",
        timezone: "Etc/UTC",
        theme: isLight,
        style: "1",
        locale: "en",
        hide_side_toolbar: showDrawingToolsBar,
        allow_symbol_change: true,
        details: details,
        calendar: false,
        support_host: "https://www.tradingview.com"
      });

      container.current.innerHTML = "";
      container.current.appendChild(script);

      return () => {
        if (container.current) {
          container.current.innerHTML = "";
        }
      };
    }
  }, [isLight, showDrawingToolsBar, details, pairedCode, brokerName]);

  function handleChange(e) {
    setText(e.target.value);

    setDetails(e.target.checked);

    setSearchArr(
      data?.filter((crypto) =>
        crypto.id.toLowerCase().includes(text.toLowerCase())
      )
    );
  }

  // console.log(news);

  const handleSearchChange = (e) => {
    const searchValue = e.target.value;
    setCryptPairSearch(searchValue);
    setCryptPairSearchResult(
      cryptoPairs.filter((pair) =>
        pair.pairCode.toUpperCase().includes(searchValue.toUpperCase())
      )
    );
  };

  function pairCodeftn(broker, pairing) {
    setBrokerName(broker);
    setPairedCode(pairing);
    setModal(false);
  }

  function performanceFtn(e) {
    // setPerformance(e.target.value);
    if (e.target.value === "high") {
      setPerformance(e.target.value);
      // console.log("first");
      setSearchArr(data.filter((obj) => obj.market_cap_rank <= 10));
      // console.log(searchedArr, "data[10]");
    } else if (e.target.value === "low") {
      setPerformance(e.target.value);

      // console.log("second");
      setSearchArr(data.filter((obj) => obj.market_cap_rank > 90));
      // console.log("second2");
    } else if (e.target.value === "all") {
      setPerformance(e.target.value);
      setSearchArr(data);
    } else {
      return;
    }
  }

  function messageIconFtn() {
    setMessageIcon(!messageIcon);
    setNewsModal(true);
  }

  function closeNewsModalFtn() {
    setMessageIcon(true);
    setNewsModal(false);
  }

  const allData =
    Array.isArray(data) &&
    data.map((obj) => {
      return (
        <div key={obj.id}>
          <div className="flex justify-center">
            <div className="py-1 w-[90vw]">
              <div className="flex items-center justify-between py-1 px-4 rounded-md  bg-slate-600">
                <div className="w-[3vw]">
                  <img
                    src={obj.image}
                    alt={obj.id}
                    className="w-[100%] rounded-full"
                  />
                </div>
                <p>{obj.name}</p>
                <p>${obj.current_price.toLocaleString()}</p>
                <div>
                  <p>
                    <span>
                      {obj.market_cap_change_percentage_24h < 0 ? (
                        <span>
                          <GoArrowDownRight className="text-red-600" />
                          {obj.price_change_percentage_24h}
                        </span>
                      ) : (
                        <span>
                          <GoArrowUpRight className="text-green-600" />
                          {obj.price_change_percentage_24h}{" "}
                        </span>
                      )}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    });

  const lowPerformanceData =
    Array.isArray(searchedArr) &&
    searchedArr.map((obj) => {
      return (
        <div key={obj.id}>
          <div className="flex justify-center">
            <div className="py-1 w-[90vw]">
              <div className="flex items-center justify-between py-1 px-4 rounded-md  bg-slate-600">
                <div className="w-[3vw]">
                  <img
                    src={obj.image}
                    alt={obj.id}
                    className="w-[100%] rounded-full"
                  />
                </div>
                <p>{obj.name}</p>
                <p>${obj.current_price.toLocaleString()}</p>
                <div>
                  <p>
                    <span>
                      {obj.market_cap_change_percentage_24h < 0 ? (
                        <span>
                          <GoArrowDownRight className="text-red-600" />
                          {obj.price_change_percentage_24h}
                        </span>
                      ) : (
                        <span>
                          <GoArrowUpRight className="text-green-600" />
                          {obj.price_change_percentage_24h}{" "}
                        </span>
                      )}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    });

  const highPerformanceData =
    Array.isArray(searchedArr) &&
    searchedArr.map((obj) => {
      return (
        <div key={obj.id}>
          <div className="flex justify-center">
            <div className="py-1 w-[90vw]">
              <div className="flex items-center justify-between py-1 px-4 rounded-md  bg-slate-600">
                <div className="w-[3vw]">
                  <img
                    src={obj.image}
                    alt={obj.id}
                    className="w-[100%] rounded-full"
                  />
                </div>
                <p>{obj.name}</p>
                <p>${obj.current_price.toLocaleString()}</p>
                <div>
                  <p>
                    <span>
                      {obj.market_cap_change_percentage_24h < 0 ? (
                        <span>
                          <GoArrowDownRight className="text-red-600" />
                          {obj.price_change_percentage_24h}
                        </span>
                      ) : (
                        <span>
                          <GoArrowUpRight className="text-green-600" />
                          {obj.price_change_percentage_24h}{" "}
                        </span>
                      )}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    });

  // // console.log(performance, "performance");
  // console.log(pairedCode, "pairedCode");
  // console.log(brokerName, "brokerName");

  return (
    <div className="background">
      <div className="flex justify-center py-4 px-5">
        <div className="flex items-center gap-3 font-bold">
          <FaSearch className="hidden sm:block" />
          <Input
            type="text"
            value={text}
            placeholder="Search here..."
            onChange={handleChange}
            className="w-[40vw]"
          />
          <div>
            <select onChange={performanceFtn} className="text-black">
              <option value="all">All</option>
              <option value="high">High performance</option>
              <option value="low">Low performance</option>
            </select>
          </div>
          <div>
            {messageIcon ? (
              <Badge color="secondary">
                <MailIcon className="cursor-pointer" />
              </Badge>
            ) : (
              <Badge color="secondary" variant="dot" onClick={messageIconFtn}>
                <MailIcon className="cursor-pointer" />
              </Badge>
            )}
          </div>
        </div>
      </div>

      {text === "" ? (
        <div>
          {isLoading ? (
            <div>
              {Array.from({ length: 5 }).map((_, index) => {
                return (
                  <div key={index}>
                    <div className="flex justify-center">
                      <div>
                        <Skeleton className="h-4 my-4 w-[90vw]" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div>
              {performance === "" ? (
                <div className="h-[40vh] overflow-y-auto overscroll-contain">
                  {allData}
                </div>
              ) : performance === "low" ? (
                <div className="h-[40vh] overflow-y-auto overscroll-contain">
                  {lowPerformanceData}
                </div>
              ) : (
                <div className="h-[40vh] overflow-y-auto overscroll-contain">
                  {highPerformanceData}
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="h-[40vh] overflow-y-auto overscroll-contain">
          {Array.isArray(searchedArr) &&
            searchedArr.map((obj) => {
              return (
                <div key={obj.id}>
                  <div className="flex justify-center">
                    <div className="py-1 w-[90vw]">
                      <div className="flex items-center justify-between py-1 px-4 rounded-md  bg-slate-600">
                        <div className="w-[3vw] ">
                          <img
                            src={obj.image}
                            alt={obj.id}
                            className="w-[100%] rounded-full"
                          />
                        </div>
                        <p>{obj.name}</p>
                        <p>${obj.current_price.toLocaleString()}</p>
                        <div>
                          <p>
                            <span>
                              {obj.market_cap_change_percentage_24h < 0 ? (
                                <span>
                                  <GoArrowDownRight className="text-red-600" />
                                  {obj.price_change_percentage_24h}
                                </span>
                              ) : (
                                <span>
                                  <GoArrowUpRight className="text-green-600" />
                                  {obj.price_change_percentage_24h}{" "}
                                </span>
                              )}
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      )}

      <div>
        <div className="px-3">
          <div>
            <div className="flex flex-col  gap-3 my-4 sm:flex-row">
              <select
                onChange={(e) => setIsLight(e.target.value)}
                className="text-black">
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
              <div className="flex items-center gap-1">
                <label htmlFor="toolsBar">Show drawing tools bar</label>
                <input
                  id="toolsBar"
                  type="checkbox"
                  checked={showDrawingToolsBar}
                  onChange={(e) => setShowDrawingToolsBar(e.target.checked)}
                />
              </div>
              <div className="flex items-center gap-1">
                <label htmlFor="details">Details</label>
                <input
                  id="details"
                  type="checkbox"
                  checked={details}
                  onChange={(e) => setDetails(e.target.checked)}
                />
              </div>
            </div>
            <div className="my-4">
              <Input
                type="text"
                value={pairedCode}
                placeholder="Search symbol"
                onClick={() => setModal(true)}
              />
            </div>
            <div className="tradingview-widget-container" ref={container}>
              <div
                className="tradingview-widget-container__widget"
                style={{ height: "calc(100% - 32px)", width: "100%" }}></div>
              <div className="tradingview-widget-copyright">
                <a
                  href="https://www.tradingview.com/"
                  rel="noopener nofollow"
                  target="_blank">
                  <span className="blue-text">
                    Track all markets on TradingView
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* crypto pairs */}

      {modal && (
        <div className="flex justify-center items-center flex-col fixed top-0 left-0 right-0 bottom-0 py-[3vh] background-c">
          <div
            className="absolute top-6 right-6 cursor-pointer"
            onClick={() => setModal(false)}>
            <ImCancelCircle className="text-2xl" />
          </div>
          <div className="py-4">
            <Input
              type="text"
              placeholder="Search symbol"
              value={cryptPairSearch}
              className="border-green-300 placeholder:text-black italic"
              onChange={handleSearchChange}
            />
          </div>
          <div className="w-[80vw] bg-white h-[50vh] rounded-md overflow-y-auto overscroll-contain py-3 text-black">
            {/* <h3>Default symbol</h3> */}
            <div className="py-3">
              {cryptPairSearchResult?.map((crypto, i) => {
                return (
                  <ul
                    onClick={() => pairCodeftn(crypto.broker, crypto.pairCode)}
                    key={i}
                    className="flex items-center justify-between px-3 py-1 font-bold hover:text-green-300 cursor-pointer font-size-css">
                    <li>{crypto.pairCode}</li>
                    <li>{crypto.pairName}</li>
                    <li>{crypto.broker}</li>
                  </ul>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* news */}

      {newsModal && (
        <div
          className="h-[100vh] bg-[rgb(0,0,0)] fixed top-0 bottom-0 right-0 left-0 flex justify-center items-center text-green-800"
          onClick={closeNewsModalFtn}>
          <div className="h-[60vh] overflow-y-auto overscroll-contain">
            <h2 className="text-2xl text-center">Crypto News</h2>
            {news.map((obj) => {
              return (
                <a href={`${obj.link}`} target="_blank" key={obj.article_id}>
                  <div className="flex justify-between items-center gap-3 py-2 px-2">
                    <div>
                      <p>{obj.title}</p>
                      <p>{obj.pubDate}</p>
                    </div>

                    <div className="w-[7vw]">
                      <img
                        src={obj.image_url}
                        alt="news-image"
                        className="w-[100%] rounded-md"
                      />
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
