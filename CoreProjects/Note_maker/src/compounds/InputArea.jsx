import '../styles/InputArea.css'
import { useState } from 'react'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

function InputArea({onAdd}) {

    const [input, setInput] = useState({
        title: '',
        text: ''
    })

    function handleClick() {
        if(input.title.trim() === '' && input.text.trim() === '') return  
        onAdd(input)   
        setInput({ title: '', text: '' })
    }

    function handleChange(event) {
        const { name, value } = event.target;
        setInput(prevInput => {
            return {
                ...prevInput,
                [name]: value
            }
        })
    }

    return (
        <div className="containerInput">
            <input 
            onChange={handleChange} 
            name='title' 
            id='title' 
            className="inputArea" 
            type="text" 
            placeholder="Title"
            maxLength={30}
            value={input.title}
            />

            <textarea 
            onChange={handleChange} 
            name='text' 
            id='text' 
            className="inputText" 
            placeholder="Text" 
            rows={3} 
            maxLength={100}
            value={input.text}
            ></textarea>

            <button onClick={handleClick} className="inputButton">
                <AddCircleOutlineIcon className='icon' />
            </button>
        </div>
    )
}

export default InputArea;