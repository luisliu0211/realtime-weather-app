// ./src/WeatherApp.js
import React, { useState, useEffect, useMemo } from 'react';
import WeatherSetting from './WeatherSetting';
import styled from '@emotion/styled';
import sunriseAndSunsetData from './sunrise-sunset.json';
import { ThemeProvider } from '@emotion/react';
import useWeatherApi from './useWeatherApi';
import WeatherCard from './WeatherCard';
import { findLocation } from './utils';
// STEP 2：定義帶有 styled 的 component

const Container = styled.div`
  /* STEP 3：在 Styled Component 中可以透過 Props 取得對的顏色 */
  background-color: ${({ theme }) => theme.backgroundColor};
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const theme = {
  light: {
    backgroundColor: '#ededed',
    foregroundColor: '#f9f9f9',
    boxShadow: '0 1px 3px 0 #999999',
    titleColor: '#212121',
    temperatureColor: '#757575',
    textColor: '#828282',
  },
  dark: {
    backgroundColor: '#1F2022',
    foregroundColor: '#121416',
    boxShadow:
      '0 1px 4px 0 rgba(12, 12, 13, 0.2), 0 0 0 1px rgba(0, 0, 0, 0.15)',
    titleColor: '#f9f9fa',
    temperatureColor: '#dddddd',
    textColor: '#cccccc',
  },
};

// STEP 1：定義 getMoment 方法
const getMoment = (locationName) => {
  const location = sunriseAndSunsetData.find(
    (data) => data.locationName === locationName
  );

  if (!location) return null;

  const now = new Date();
  const nowDate = Intl.DateTimeFormat('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
    .format(now)
    .replace(/\//g, '-');

  const locationDate =
    location.time && location.time.find((time) => time.dataTime === nowDate);

  const sunriseTimestamp = new Date(
    `${locationDate.dataTime} ${locationDate.sunrise}`
  ).getTime();
  const sunsetTimestamp = new Date(
    `${locationDate.dataTime} ${locationDate.sunset}`
  ).getTime();
  const nowTimeStamp = now.getTime();
  return sunriseTimestamp <= nowTimeStamp && nowTimeStamp <= sunsetTimestamp
    ? 'day'
    : 'night';
};

const WeatherApp = () => {
  // STEP 1：從 localStorage 取出 cityName，並取名為 storageCity
  const storageCity = localStorage.getItem('cityName');
  // STEP 1：使用 useState 定義當前要拉取天氣資訊的地區，若 storageCity 存在則作為 currentCity 的預設值，否則使用 '臺北市'
  const [currentCity, setCurrentCity] = useState(storageCity || '臺北市');
  // STEP 3：根據 currentCity 來找出對應到不同 API 時顯示的地區名稱，找到的地區取名為 locationInfo
  const currentLocation = findLocation(currentCity) || {};
  const [currentTheme, setCurrentTheme] = useState('light');
  // STEP 2：使用 useWeatherApi Hook 後就能取得 weatherElement 和 fetchData 這兩個方法
  const [weatherElement, fetchData] = useWeatherApi(currentLocation);
  // const { locationName } = weatherElement;
  // STEP 4：根據日出日落資料的地區名稱，找出對應的日出日落時間
  // const moment = useMemo(
  //   () => getMoment(currentLocation.sunriseCityName),
  //   [currentLocation.sunriseCityName]
  // );
  // console.log(currentLocation.sunriseCityName);

  const moment = useMemo(
    () => getMoment(currentLocation.cityName),
    [currentLocation.cityName]
  );
  // console.log(currentLocation.cityName);

  // STEP 1：定義 currentPage 這個 state，預設值是 WeatherCard
  const [currentPage, setCurrentPage] = useState('WeatherCard');

  useEffect(() => {
    setCurrentTheme(moment === 'day' ? 'light' : 'dark');
    // console.log('現在否是白天', moment);
  }, [moment]);

  useEffect(() => {
    localStorage.setItem('cityName', currentCity);
    // STEP 3-2：dependencies 中放入 currentCity
  }, [currentCity]);
  return (
    <ThemeProvider theme={theme[currentTheme]}>
      <Container>
        {/* STEP 2：利用條件渲染的方式決定要呈現哪個組件 */}
        {currentPage === 'WeatherCard' && (
          <WeatherCard
            cityName={currentLocation.cityName}
            weatherElement={weatherElement}
            moment={moment}
            fetchData={fetchData}
            setCurrentPage={setCurrentPage}
          />
        )}

        {currentPage === 'WeatherSetting' && (
          <WeatherSetting
            setCurrentPage={setCurrentPage}
            // STEP 6：把縣市名稱傳入 WeatherSetting 中當作表單「地區」欄位的預設值
            cityName={currentLocation.cityName}
            // STEP 7：把 setCurrentCity 傳入，讓 WeatherSetting 可以修改 currentCity
            setCurrentCity={setCurrentCity}
          />
        )}
      </Container>
    </ThemeProvider>
  );
};

export default WeatherApp;
