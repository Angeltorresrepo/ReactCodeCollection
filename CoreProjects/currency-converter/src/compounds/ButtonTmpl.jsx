import React, { useState, useEffect } from 'react';
import ratesTemplate from '../../rates.json'
import { ThunderboltOutlined } from '@ant-design/icons';
import { Button, Flex, Tooltip } from 'antd';
import { downloadJson } from '../utils/downloadJson';
import "../styles/Button.css"

import toast, { Toaster } from 'react-hot-toast';



const ButtonTmpl = ({text, setInitialCodes, isBtnTmpl, setStringHelpTable}) => {
    
    const [loadings, setLoadings] = useState([]);

    const toastSuccess = (message) => toast.success(message, {
      position:'bottom-left',
      style: {
        background: '#c4e9afff',
        color: '#000000ff',
      },
      iconTheme: {
        primary: '#2a9520ff',
        secondary: '#fff',
      },
    });

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

      enterLoading(1);
      const initialCodes = ratesTemplate
      sessionStorage.setItem("initialCodes", JSON.stringify(initialCodes));
      setInitialCodes(initialCodes);
      toastSuccess("Using template data")
      setStringHelpTable("template")

    }


    return (
      <Flex gap="small" vertical>
        <Flex gap="small" align="center" wrap>
          
            <Button
                color='red'
                type='primary'
                className={`btn-cal ${isBtnTmpl ? 'btn-tmpl':''}`}
                icon={<ThunderboltOutlined />}
                loading={loadings[1]}
                onClick={handleClick}
            >
              {text}
            </Button>
          
        </Flex>
      </Flex>
      
    );
};

export default ButtonTmpl;