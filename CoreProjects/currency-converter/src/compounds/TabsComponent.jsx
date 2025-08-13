import React, { useState, useEffect } from 'react';
import { Tabs } from 'antd';

import TableComponent from './TableComponent';
import Radios from './RadioApis';
import InputApi from './InputApi';
import ButtonCom from './Button';
import ButtonTmpl from './ButtonTmpl';
import UploadJsonButton from './UploadJsonButton()';




import '../styles/UploadJsonButton.css'
import '../styles/TabsComponent.css';
import 'prismjs/themes/prism-okaidia.css';
import Prism from 'prismjs';
import 'prismjs/components/prism-json';

function TabsComponent({ filteredOptions, rates, setInitialCodes, stringHelpTable, setStringHelpTable }) {
  const [activeKey, setActiveKey] = useState('1');
  const [urlApi, setUrlApi] = useState("URL");
  const [valApi, setValueApi] = useState("1");
  const [selectedInput, setSelectedInput] = useState(null);
  const [valueKey, setValueKey] = useState(null);

  
  useEffect(() => {
    if (activeKey === '3') {
      setTimeout(() => Prism.highlightAll(), 0);
    }
  }, [activeKey]);

  const stringTemplate = `The following currency ratios will be used for the correct function of the app (from 08/2025). 
If you wish to use different or updated data, please refer to tabs 2 or 3.`

  const textTable = stringHelpTable === 'outdated' || stringHelpTable === 'template' ? 
    stringTemplate : stringHelpTable === 'confirm' ? 
      'These are your own currency ratios:': 'These currency ratios come from ' + stringHelpTable + ' API';


  const items = [
    {
      key: '1',
      label: 'Outdated template',
      children: (
        <>
          <p className='span-chld'>
            <span>
              {textTable}
            </span>
            
          </p>
          <TableComponent filteredOptions={filteredOptions} rates={rates} />
        </>
      ),
    },
    { 
      key: '2', 
      label: 'APIs', 
      children: 
      <>
        <div className="container1-key2">
          <p className='span-chld'>You can select any API to perform a query and use updated ratios.</p>
          <Radios 
            onUrlChange={setUrlApi}
            onRadioChange={setValueApi}
            setSelectedInput={setSelectedInput}
          />
          <div className="input-container">
            <InputApi 
              urlApi={urlApi}
              valApi={valApi}
              setValueKey={setValueKey}
              valueKey={valueKey}
            />
          </div>
        </div>
        <div className="btn-api-div">
          <ButtonCom 
            text={"Use API rates"}
            title={false}
            isApi={true}
            valueInputApi={selectedInput}
            valueKey={valueKey}
            setValueKey={setValueKey}
            setInitialCodes={setInitialCodes}
            setStringHelpTable={setStringHelpTable}
          />
        </div>
        <div className="btn-tmpl-div">
          <ButtonTmpl 
            text={'Use outdated template'}
            isBtnTmpl={true}
            setInitialCodes={setInitialCodes}
            setStringHelpTable={setStringHelpTable}
          />
        </div>
      </>
    },
    { 
      key: '3', 
      label: 'Import own rates', 
      children: 
      <>
      <div className="upload-div-conatiner">
        <p>You can import your own rates using the following format:</p>
        <pre>
          <code className="language-json">
      {`{
  "AED": 3.6725,
  "AFN": 68.5872,
  "ALL": 83.5343,
  "AMD": 383.7134,
  ....
}`}
          </code>

        </pre>
        <div className="btn-upload-div">
          <UploadJsonButton 
            setInitialCodes={setInitialCodes}
            setStringHelpTable={setStringHelpTable}
          />
        </div>
      </div>
        
      </> 
    },
  ];

  return (
    <div className="tabs-container">
      <Tabs
        activeKey={activeKey}
        onChange={setActiveKey}
        items={items}
        type="line"
        animated={{ inkBar: true, tabPane: true }}
      />
    </div>
  );
}

export default TabsComponent;
