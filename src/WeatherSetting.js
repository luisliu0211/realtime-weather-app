import React, { useState, useRef } from 'react';
import styled from '@emotion/styled';
import { availableLocations } from './utils';
// STEP 2：從 availableLocations 取出 cityName 來做為讓使用者可以選擇地區的清單
const locations = availableLocations.map((location) => location.cityName);

// console.log('地點', locations);

const WeatherSettingWrapper = styled.div`
  position: relative;
  min-width: 360px;
  box-shadow: ${({ theme }) => theme.boxShadow};
  background-color: ${({ theme }) => theme.foregroundColor};
  box-sizing: border-box;
  padding: 20px;
`;

const Title = styled.div`
  font-size: 28px;
  color: ${({ theme }) => theme.titleColor};
  margin-bottom: 30px;
`;

const StyledLabel = styled.label`
  display: block;
  font-size: 16px;
  color: ${({ theme }) => theme.textColor};
  margin-bottom: 15px;
`;

const StyledInputList = styled.input`
  display: block;
  box-sizing: border-box;
  background: transparent;
  border: 1px solid ${({ theme }) => theme.textColor};
  outline: none;
  width: 100%;
  max-width: 100%;
  color: ${({ theme }) => theme.textColor};
  font-size: 16px;
  padding: 7px 10px;
  margin-bottom: 40px;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  > button {
    display: flex;
    align-items: center;
    justify-content: center;
    white-space: nowrap;
    user-select: none;
    margin: 0;
    letter-spacing: 0.3px;
    line-height: 1;
    cursor: pointer;
    overflow: visible;
    text-transform: none;
    border: 1px solid transparent;
    background-color: transparent;
    height: 35px;
    width: 80px;
    border-radius: 5px;

    &:focus,
    &.focus {
      outline: 0;
      box-shadow: none;
    }

    &::-moz-focus-inner {
      padding: 0;
      border-style: none;
    }
  }
`;

const Back = styled.button`
  && {
    color: ${({ theme }) => theme.textColor};
    border-color: ${({ theme }) => theme.textColor};
  }
`;

const Save = styled.button`
  && {
    color: white;
    background-color: #40a9f3;
  }
`;

// STEP 1：從 props 中取出 cityName 和 setCurrentCity

const WeatherSetting = ({ setCurrentPage, cityName, setCurrentCity }) => {
  // STEP 2：將 cityName 當成預設值帶入 useState 中
  const [locationName, setLocationName] = useState(cityName);
  // STEP 2：使用 useRef 建立一個 ref，取名為 inputLocationRef
  const inputLocationRef = useRef(null);
  const handleChange = (e) => {
    // console.log('選擇地區', e.target.value);
    setLocationName(e.target.value);
  };
  const handleSave = () => {
    const locationName = inputLocationRef.current.value;
    if (locations.includes(locationName)) {
      // console.log(`儲存資料: ${locationName}`);
      setCurrentPage('WeatherCard');
      setCurrentCity(locationName);
    } else {
      // console.log('查無所選地區');
      alert(`儲存失敗！ 輸入的"${locationName}"並無可用資料`);
    }
    // 透過 inputLocationRef.current 可以指稱到該 input 元素
    // 透過 inputLocationRef.current.value 即可取得該 input 元素的值

    // console.log('ref 選取地區', locationName);
  };
  return (
    <WeatherSettingWrapper>
      <Title>設定</Title>
      <StyledLabel htmlFor="location">地區</StyledLabel>
      {/* STEP 3：將 useRef 回傳的物件，指稱為該 input 元素 */}
      {/* STEP 5：在 uncontrolled components 中可以使用 defaultValue 定義預設值 */}
      <StyledInputList
        list="location-list"
        id="location"
        name="location"
        onChange={handleChange}
        ref={inputLocationRef}
        defaultValue={cityName}
      />
      <datalist id="location-list">
        {' '}
        {locations.map((location) => (
          <option value={location} key={location} />
        ))}
      </datalist>

      <ButtonGroup>
        <Back onClick={() => setCurrentPage('WeatherCard')}>返回</Back>
        <Save onClick={handleSave}>儲存</Save>
      </ButtonGroup>
    </WeatherSettingWrapper>
  );
};

export default WeatherSetting;
