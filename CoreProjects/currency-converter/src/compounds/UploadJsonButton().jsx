import React, { useState } from 'react';
import { Upload, Button, message } from 'antd';
import ButtonTmpl from './ButtonTmpl';

import { UploadOutlined } from '@ant-design/icons';
import Prism from 'prismjs';
import 'prismjs/themes/prism-okaidia.css';
import 'prismjs/components/prism-json';

import { useEffect } from 'react';
import ButtonConfirm from './ButtonConfirm';


function UploadJsonButton({setInitialCodes, setStringHelpTable}) {
  const [data, setData] = useState(null); 

  useEffect(() => {
  Prism.highlightAll();
    }, [data]); 

  const props = {
    accept: '.json',
    beforeUpload: (file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const text = e.target.result;

          if (file.name.endsWith('.json')) {
            const json = JSON.parse(text);
            setData(json); 
          } 
        } catch (err) {
          message.error('Error reading file');
        }
      };
      reader.readAsText(file);
      return false; 
    },
    showUploadList: false,
  };

  return (
    <div>
        <div className="upload-div">
            <Upload {...props}>
            <Button icon={<UploadOutlined />}>Importar archivo</Button>
            </Upload>
            <ButtonConfirm 
                text={"Use this data"}
                isDisplayed={data ? true : false}
                setInitialCodes={setInitialCodes}
                data={data}
                setStringHelpTable={setStringHelpTable}
            />
        </div>

        <pre style={{ marginTop: 20 }}>
            <code className="language-json">
                {data ? JSON.stringify(Object.fromEntries(Object.entries(data).slice(0, 10)), null, 2) + '\n...' : 'No hay datos cargados'}
            </code>
        </pre>
    </div>
  );
}

export default UploadJsonButton;
