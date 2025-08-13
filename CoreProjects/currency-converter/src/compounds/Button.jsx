import React, { useState, useEffect } from 'react';
import ratesTemplate from '../../rates.json'
import { ThunderboltOutlined } from '@ant-design/icons';
import { Button, Flex, Tooltip } from 'antd';
import { downloadJson } from '../utils/downloadJson';
import "../styles/Button.css"

import toast, { Toaster } from 'react-hot-toast';



const ButtonCom = ({value, onReset, diviseA, diviseB, isDisabledVal, valueOutput, setValueOutput, 
  text, title, isApi, valueInputApi, valueKey, setValueKey, setInitialCodes, setStringHelpTable}) => {
    

    const [loadings, setLoadings] = useState([]);

    const [rates, setRates] = useState(null);

    const [dataRates, setDataRates] = useState(null);
    
    useEffect(() => {
      setRates(ratesTemplate);
    }, []);

    const toastFail = (message) => toast.error(message, {
        position:'bottom-left',
        style: {
          background: '#ffdddd',
          color: '#000000ff',
        },
        iconTheme: {
          primary: '#d8000c',
          secondary: '#fff',
        },
      });

      const toastSuccess = (message) => toast.success(message, {
        position:'bottom-left',
        style: {
          background: '#c4e9afff',
          color: '#030303ff',
        },
        iconTheme: {
          primary: '#2a9520ff',
          secondary: '#fff',
        },
      });

    async function fetchData(url) {
      try {
        const res = await fetch(url);

        if (!res.ok) {
          toastFail('API key value not correct.');
          setDataRates(null);
          setValueKey(null)
          throw new Error(`Error HTTP: ${res.status}`);
        }

        const data = await res.json();

        if (data.success === false || data.error) {
          toastFail('API returned an error.');
          setDataRates(null);
          setValueKey(null)
          return null;
        }

        toastSuccess("Data received, using new rates.");
        setDataRates(data);
        return data;

      } catch (error) {
        toastFail("Fetch data error");
        setDataRates(null);
        setValueKey(null)
        console.error('Fetch error:', error);
        return null;
      }
    }


    async function resetData(value) {
      let url;

      if (value === '3') {
        url = valueInputApi.urlApi.trim();
      } else {
        if (!valueKey) {
          setValueKey(null);
          return toastFail("API key missing");
        }
        url = valueInputApi.urlApi.trim().replace("API_KEY", valueKey.trim());
        console.log(url);
      }

      const data = await fetchData(url);

      let newData = value === '1' ? data.conversion_rates : value === '2' || value === '5' ? data.quotes : data.rates;

      if (value === '2' || value === '5') {
        newData = Object.fromEntries(
          Object.entries(newData).map(([key, val]) =>
            key.startsWith("USD") ? [key.slice(3), val] : [key, val]
          )
        );
      }

      if (!("USD" in newData)) {
        newData["USD"] = 1;
      }

      sessionStorage.setItem("initialCodes", JSON.stringify(newData));
      setInitialCodes(newData);
      setValueKey(null);
      setStringHelpTable(valueInputApi.label);
    }


    const enterLoading = index => {

      setLoadings(prevLoadings => {
        const newLoadings = [...prevLoadings];
        newLoadings[index] = true;
        return newLoadings;
      });

      setTimeout(() => {
        setLoadings(prevLoadings => {
          const newLoadings = [...prevLoadings];
          newLoadings[index] = false;
          return newLoadings;
        });
      }, 800);
    };

    async function handleClick() {
      if (title) {
        onReset();
        setValueOutput(parseFloat(value) * (rates[diviseB.code] / rates[diviseA.code]));
      }

      enterLoading(1);

      if (!title) {
        resetData(valueInputApi.value);
      }

    }


    return (
      <Flex gap="small" vertical>
        <Flex gap="small" align="center" wrap>
          <Tooltip 
            placement='bottom' 
            title={isDisabledVal || !value && title ? "You need to fill in the required fields." : null}
          >
            <Button
                color='red'
                type='primary'
                className={`btn-cal ${isDisabledVal || !value ? 'dis': 'not-dis'} ${isApi ? 'not-dis-api':''}`}
                icon={<ThunderboltOutlined />}
                loading={loadings[1]}
                onClick={handleClick}
                disabled={isDisabledVal || !value && title}
            >
              {text}
            </Button>
          </Tooltip>
        </Flex>
      </Flex>
      
    );
};

export default ButtonCom;