import React, { useState, useEffect } from 'react';
import { ThunderboltOutlined } from '@ant-design/icons';
import { Button, Flex, Tooltip } from 'antd';
import "../styles/Button.css"


import toast, { Toaster } from 'react-hot-toast';

const ButtonConfirm = ({text, setInitialCodes, isDisplayed, data, setStringHelpTable}) => {
    
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

    function handleClick(data) {
  
      enterLoading(1);
      if (!data) return; 
      const newData = Object.fromEntries(
        Object.entries(data).filter(([key]) => key.length === 3)
      );
      sessionStorage.setItem("initialCodes", JSON.stringify(newData));
      setInitialCodes(newData);
      toastSuccess("Using your own template data");
      setStringHelpTable("confirm")

    }

    return (
      <Flex gap="small" vertical>
        <Flex gap="small" align="center" wrap>
          
            <Button
                color='red'
                type='primary'
                className={`btn-cal ${ isDisplayed ? '':'btn-use-dis'}`}
                icon={<ThunderboltOutlined />}
                loading={loadings[1]}
                onClick={() => handleClick(data)}
            >
              {text}
            </Button>
          
        </Flex>
      </Flex>
      
    );
};

export default ButtonConfirm;