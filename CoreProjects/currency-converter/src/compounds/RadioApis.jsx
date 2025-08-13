import { Flex, Radio } from 'antd';
import { useState } from 'react';
import '../styles/RadioApis.css';

import toast, { Toaster } from 'react-hot-toast';

const options = [
  { label: 'ExchangeRate', value: '1', url:'https://www.exchangerate-api.com', freq:'1h', lim: '1500', urlApi:"https://v6.exchangerate-api.com/v6/API_KEY/latest/USD" },
  { label: 'Exchangerate (host)', value: '2', url:'https://exchangerate.host/signup/free', freq:'24h', lim: 'NO LIMIT', urlApi:"https://api.exchangerate.host/live?access_key=API_KEY"},
  { label: 'Frankfurter', value: '3', url:'https://api.frankfurter.dev/v1/latest?base=USD', freq:'24h', lim: 'NO LIMIT', urlApi:"https://api.frankfurter.dev/v1/latest?base=USD"},
  { label: 'Open Exchange Rates', value: '4', url:'https://openexchangerates.org/signup/free', freq:'1h', lim: '1000', urlApi:"https://openexchangerates.org/api/latest.json?app_id=API_KEY"},
  { label: 'CurrencyLayer ', value: '5', url:'https://currencylayer.com/signup/free', freq:'1h', lim: '250', urlApi:"http://apilayer.net/api/live?access_key=API_KEY&source=USD&format=1"},
  { label: 'RatesAPI', value: '6', url:'https://manage.exchangeratesapi.io/signup/free', freq:'24h', lim: 'NO LIMIT', urlApi:"https://api.exchangeratesapi.io/v1/latest?access_key=API_KEY"}
];


//exchange api: https://v6.exchangerate-api.com/v6/API_KEY/latest/USD ||| d1a6131271177ed1e9a245f4 ||| conversion_rates + usd si 
//exchangegerate host:  https://api.exchangerate.host/live?access_key=API_KEY||| 8e241f3254eb87d9a179a55e00db2f96 ||| quotes + usd clean + usd no
//frankfurter: https://api.frankfurter.dev/v1/latest?base=USD ||| rates + usd no
//openexchange: https://openexchangerates.org/api/latest.json?app_id=API_KEY |||||  78f77d4f5b264cefb53512ea849e791b ||| rates + usd si
//currencylayer: http://apilayer.net/api/live?access_key=API_KEY&source=USD&format=1 ||| 757e18236d0171692e25f00b8b859ee7 ||| rates +  usd clean + usd no
//ratesapi: https://api.exchangeratesapi.io/v1/latest?access_key=API_KEY ||| ccdd755e3dc0cceb358321e572c4c9b1 ||| rates


const Radios = ({ onUrlChange, onRadioChange, setSelectedInput }) => {
  const [selectedValue, setSelectedValue] = useState('0');

  const onChange = async (e) => {
    const value = e.target.value;
    setSelectedValue(value);

    const selectedInput = options.find(option => option.value === value);
    if (selectedInput) {
      const elementData = {
        url: selectedInput.url,
        freq: selectedInput.freq,
        limit: selectedInput.lim,
        urlApi: selectedInput.urlApi
      };

      onUrlChange(elementData.urlApi);
      onRadioChange(selectedInput.value);
      setSelectedInput(selectedInput);

      try {
        await navigator.clipboard.writeText(selectedInput.url);
        if (selectedInput.value === "3") {
            toast.success(`URL with latest rates copied to clipboard: ${selectedInput.url}`);
        } else {
            toast.success(`Sign up for Free API Key: ${selectedInput.url}`);  
        }
        
      } catch (err) {
        toast.error('Error al copiar la URL');
      }
    }
    toast(
      <div style={{ fontSize: '14px', lineHeight: '1.4', color: '#333' }}>
        <strong style={{ color: '#007bff' }}>📢 API Information</strong><br/>
        🌐 <span style={{ color: '#555' }}>API:</span> {selectedInput.label}<br/>
        🔑 <span style={{ color: '#555' }}>Free API key:</span> {selectedInput.url}<br/>
        ⏳ <span style={{ color: '#555' }}>Ratio reset:</span> {selectedInput.freq}<br/>
        📊 <span style={{ color: '#555' }}>Limit:</span> {selectedInput.lim !== 'NO LIMIT' ? selectedInput.lim + ' requests' : 'No limits'}
      </div>,
      { autoClose: 3000 }
    );



  };

  return (
    <Flex vertical gap="middle">
        <Radio.Group  
            options={options} 
            defaultValue={selectedValue} 
            optionType="button"
            onChange={onChange}
            value={selectedValue}
        />
    </Flex>
  );
};

export default Radios;
