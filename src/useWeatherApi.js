import { useState, useEffect, useCallback } from "react";

const fetchWeatherForecast = (cityName) => {
  // STEP 4-1：加上 return 直接把 fetch API 回傳的 Promise 回傳出去
  return fetch(
    `https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization=CWB-09BDABEF-23B8-4105-8EEC-BA0BBC726647&locationName=${cityName}`
  )
    .then((response) => response.json())
    .then((data) => {
      // console.log("天氣預報", data);
      // console.log("桃園", data.records.location[0].locationName);
      const locationData = data.records.location[0];
      const weatherElements = locationData.weatherElement.reduce(
        (neededElements, item) => {
          if (["Wx", "PoP", "CI"].includes(item.elementName)) {
            neededElements[item.elementName] = item.time[0].parameter;
          }
          return neededElements;
        },
        {}
      );
      // STEP 4-2：把取得的資料內容回傳出去，而不是在這裡 setWeatherElement
      return {
        description: weatherElements.Wx.parameterName,
        weatherCode: weatherElements.Wx.parameterValue,
        rainPossibility: weatherElements.PoP.parameterName,
        comfortability: weatherElements.CI.parameterName
      };
    });
};
const fetchCurrentWeather = (locationName) => {
  // STEP 3-1：加上 return 直接把 fetch API 回傳的 Promise 回傳出去
  return fetch(
    `https://opendata.cwb.gov.tw/api/v1/rest/datastore/O-A0003-001?Authorization=CWB-09BDABEF-23B8-4105-8EEC-BA0BBC726647&locationName=${locationName}`
  )
    .then((response) => response.json())
    .then((data) => {
      // console.log("目前天氣", data);
      // STEP 1：定義 `locationData` 把回傳的資料中會用到的部分取出來
      const locationData = data.records.location[0];
      // console.log(locationData, "地點氣象資訊");
      // STEP 2：將風速（WDSD）、氣溫（TEMP）和濕度（HUMD）的資料取出
      const weatherElements = locationData.weatherElement.reduce(
        (neededElements, item) => {
          if (["WDSD", "TEMP", "HUMD"].includes(item.elementName)) {
            neededElements[item.elementName] = item.elementValue;
            // console.log("天氣要素-風速", neededElements.WDSD);
            // console.log("天氣要素-溫度", neededElements.TEMP);
            // console.log("天氣要素-濕度", neededElements.HUMD);
          }
          return neededElements;
        }
      );
      // console.log(weatherElements, "天氣資訊");
      // STEP 3-2：把取得的資料內容回傳出去，而不是在這裡 setWeatherElement
      return {
        observationTime: locationData.time.obsTime,
        locationName: locationData.locationName,
        temperature: weatherElements.TEMP,
        windSpeed: weatherElements.WDSD,
        humid: weatherElements.HUMD
      };
    });
};

const useWeatherApi = (currentLocation) => {
  // STEP 2：將傳入的 currentLocation 透過解構賦值取出 locationName 和 cityName
  const { locationName, cityName } = currentLocation;
  const [weatherElement, setWeatherElement] = useState({
    observationTime: new Date(),
    locationName: "",
    humid: 0,
    temperature: 0,
    windSpeed: 0,
    description: "",
    weatherCode: 0,
    rainPossibility: 0,
    comfortability: "",
    isLoading: true
  });
  const fetchData = useCallback(() => {
    const fetchingData = async () => {
      const [currentWeather, weatherForecast] = await Promise.all([
        fetchCurrentWeather(locationName),
        fetchWeatherForecast(cityName)
      ]);

      setWeatherElement({
        ...currentWeather,
        ...weatherForecast,
        isLoading: false
      });
    };
    setWeatherElement((prevState) => ({
      ...prevState,
      isLoading: true
    }));
    fetchingData();
    // 說明：一旦 locationName 或 cityName 改變時，fetchData 就會改變，此時 useEffect 內的函式就會再次執行，拉取最新的天氣資料
  }, [locationName, cityName]);
  useEffect(() => {
    fetchData();
  }, [fetchData]);
  return [weatherElement, fetchData];
};
export default useWeatherApi;
