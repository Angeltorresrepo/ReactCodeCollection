import getSymbolFromCurrency from "currency-symbol-map";
import '../styles/OutputNumber.css'

//<span>{`0 ${getSymbolFromCurrency(code) || ''}`}</span>
function OutputNumber({code, valueOutput}) {
  const text = (valueOutput != null ? parseFloat(valueOutput).toFixed(4): "0") + " " + (getSymbolFromCurrency(code) || '');
  return (
    <div className="out-container">
      <span>{text}</span>      
    </div>
  );
}


export default OutputNumber;