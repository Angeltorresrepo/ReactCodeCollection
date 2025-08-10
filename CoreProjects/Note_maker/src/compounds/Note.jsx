import React, { useState, forwardRef } from 'react';
import '../styles/Note.css'
import DeleteIcon from '@mui/icons-material/Delete';

const Note = forwardRef((props, ref) => {

    const [animating, setAnimating] = useState(false);

    function handleDelete() {
        if (animating) return;
        setAnimating(true);
        setTimeout(() => {
            setAnimating(false);
            props.onDelete(props.id);
        }, 350);
    }

    return (
        <div ref={ref} className="containerNote">
            <div className="content">
                <h1 className="titulo">{props.title}</h1>
                <span className="text">{props.text}</span>
                <DeleteIcon className={`delete ${animating ? 'animating' : ''}`} onClick={handleDelete}/>
            </div>
        </div>
    )
});

export default Note;
