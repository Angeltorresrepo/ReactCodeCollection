import { useState, useEffect } from 'react';

import Data from '../currencies.json';
import ratesTemplate from '../rates.json';
import { Toaster } from 'react-hot-toast';

import Header from './compounds/Header';
import formatOptionLabel from './compounds/Option';
import InputNumber from './compounds/InputNumber';
import DoubleArrowIcon from '@mui/icons-material/DoubleArrow';
import OutputNumber from './compounds/OutputNumber';
import ButtonCom from './compounds/Button';
import TabsComponent from './compounds/TabsComponent';
import Footer from './compounds/Footer'


import Select from 'react-select';

import './styles/App.css'
import 'rsuite/dist/rsuite.min.css';


//cantidad * (tasaUSDtoB / tasaUSDtoA)

function App() {

    const allOptions = Data.map(curr => ({
      code: curr.code,
      label: curr.code, 
      place: curr.place
    }));

    const [expanded, setExpanded] = useState(false);
    const [selected1, setSelected1] = useState(null);
    const [selected2, setSelected2] = useState(null);

    const [stringHelpTable, setStringHelpTable] = useState("outdated")
    useEffect(() => {
        console.log(stringHelpTable)
      }, [stringHelpTable]);
  
    const [initialCodes, setInitialCodes] = useState(() => {
      const stored = sessionStorage.getItem("initialCodes");
      return stored ? JSON.parse(stored) : ratesTemplate;
    });

    useEffect(() => {
      if (!sessionStorage.getItem("initialCodes")) {
        sessionStorage.setItem("initialCodes", JSON.stringify(initialCodes));
      }
    }, [initialCodes]);
    
    
    const [filteredOptions, setFilteredOptions] = useState(allOptions.filter(opt => opt.code in initialCodes));
    const [filteredOptions1, setFilteredOptions1] = useState(filteredOptions.filter(opt => opt.code !== selected2?.code && opt.code !== selected1?.code));
    const [filteredOptions2, setFilteredOptions2] = useState(filteredOptions.filter(opt => opt.code !== selected1?.code && opt.code !== selected2?.code)); 
    
    useEffect(() => {
      const newFiltered = allOptions.filter(opt => opt.code in initialCodes);
      setFilteredOptions(newFiltered);
      setFilteredOptions1(newFiltered.filter(opt => opt.code !== selected2?.code && opt.code !== selected1?.code));
      setFilteredOptions2(newFiltered.filter(opt => opt.code !== selected1?.code && opt.code !== selected2?.code));
    }, [initialCodes, selected1, selected2]);

    function toggleExpand() {
      setExpanded(prev => !prev);
    };

    function handleChange1(option) {
      setSelected1(option);
      setValueOutput(null)
    }

    function handleChange2(option) {
     setSelected2(option);
     setValueOutput(null)
    } 

    const customStyles = {
      control: (provided, state) => ({
        ...provided,
        width: state.hasValue ? 150 : 300, 
        transition: 'width 0.3s ease',
        overflow: 'hidden' 
      }),
      menu: (provided) => ({
        ...provided,
        width: '250px',  
        zIndex: 9999,
        left: '50%',
        transform: 'translateX(-50%)'
      }),
    };

    const [rates, setRates] = useState(null);
      
      useEffect(() => {
        setRates(ratesTemplate);
      }, []);

    const isDisabledVal = !(selected1 && selected2);
    
    const [value, setValue] = useState(null);
    const [valueOutput,setValueOutput] = useState(null)

    const handleCalculate = () => {
      setValueOutput(parseFloat(value) * (rates[selected2.code] / rates[selected1.code]));
    };


    return (
      
        <div className="root-container">
            <Header />
            <div className="container-select">
              
              <Select
                className='select'
                options={filteredOptions1}
                formatOptionLabel={formatOptionLabel}
                placeholder="Select a currency"
                onChange={handleChange1}
                value={selected1}
                classNamePrefix="custom"
                styles={customStyles}
              />
              <DoubleArrowIcon className='arrow-icon'/>
              <Select
                className='select'
                options={filteredOptions2}
                formatOptionLabel={formatOptionLabel}
                placeholder="Select a currency"
                onChange={handleChange2}
                value={selected2}
                classNamePrefix="custom"
                styles={customStyles}
              />
            </div>
            <div className="currencies">
              <InputNumber 
                code={selected1?.code} 
                isDisabledVal={isDisabledVal}
                value={value}
                setValue={setValue}
                onEnter={handleCalculate}
              />
              <DoubleArrowIcon className='arrow-icon-inputs'/>
              <OutputNumber 
                code={selected2?.code}
                valueOutput={valueOutput}
              />
            </div>
            <ButtonCom 
              value={value}
              onReset={()=>{setValue("")}}
              diviseA={selected1}
              diviseB={selected2}
              isDisabledVal={isDisabledVal}
              valueOutput={valueOutput}
              setValueOutput={setValueOutput}
              onCalculate={handleCalculate}
              text={"Calculate"}
              title={true}
              
            />
            <TabsComponent
              className="tabsComp"
              filteredOptions={filteredOptions}
              rates={ratesTemplate}
              setInitialCodes={setInitialCodes}
              destroyInactiveTabPane={false}
              stringHelpTable={stringHelpTable}
              setStringHelpTable={setStringHelpTable}
            
            />  
            <div>
            <Toaster
                position='top-right'
                reverseOrder={true}
            />
            </div>
           <Footer />
        </div>
    );
}

export default App;

