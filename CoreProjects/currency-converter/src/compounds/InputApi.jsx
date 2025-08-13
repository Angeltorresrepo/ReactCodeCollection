import { useState } from 'react';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { Button, Input, Space } from 'antd';
import '../styles/InputApi.css'

const InputApi = ({urlApi, valApi, setValueKey, valueKey}) => {

    
    

    function handleChange(e) {
        const val = e.target.value;
        setValueKey(val);
    }

    return (
        <>
            <Input.Password
                className='input-ena'
                placeholder={valApi === "3" ? "No Api Key needed" : "API KEY"}
                iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                disabled = {valApi === "3" ? true : false}
                value={valueKey}
                onChange={handleChange}

            />
            <Input 
                className='input-dis'
                placeholder={urlApi} 
                disabled={true}/>
        </>
    );
};
export default InputApi;