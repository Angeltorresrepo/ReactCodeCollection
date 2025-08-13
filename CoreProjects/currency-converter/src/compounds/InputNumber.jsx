import getSymbolFromCurrency from 'currency-symbol-map';
import { InputNumber } from 'rsuite';
import { Tooltip } from 'antd';
import { useEffect, useRef } from 'react';
import "../styles/InputNumber.css"

function InputNum({ code, isDisabledVal, value, setValue, onEnter }) {
  const wrapperRef = useRef();

  useEffect(() => {
    const inputEl = wrapperRef.current?.querySelector('input');
    if (!inputEl) return;

    function handleKeyDown(e) {
      if (e.key === 'Enter' && onEnter) {
        onEnter();
      }
    }

    inputEl.addEventListener('keydown', handleKeyDown);

    return () => {
      inputEl.removeEventListener('keydown', handleKeyDown);
    };
  }, [onEnter]);

  function handleChange(val) {
    setValue(val);
  }

  return (
    <div ref={wrapperRef}>
      <Tooltip 
        placement='bottom' 
        title={isDisabledVal ? "You must select both currencies first." : null}
      >
          <InputNumber
            postfix={getSymbolFromCurrency(code)}
            disabled={isDisabledVal}
            className='inputNumber'
            onChange={handleChange}
            value={value}
          />
      </Tooltip>
      
    </div>
  );
}

export default InputNum;
