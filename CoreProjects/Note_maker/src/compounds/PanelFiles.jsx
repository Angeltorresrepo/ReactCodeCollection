import FileDownloadIcon from '@mui/icons-material/FileDownload';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import "../styles/PanelFiles.css"
import { useState, useRef } from 'react';

function PanelFiles({onIconClick, onFileUpload}) {
    const [shrinkTarget, setshrinkTarget] = useState(null);
    const fileInputRef = useRef(null);

    function handleClick(target) {
        setshrinkTarget(target);
        setTimeout(() => {
            setshrinkTarget(null);
        }, 300);

        if (onIconClick) {
            onIconClick(target)
        }
    }

    function handleUploadClick() {
        if (fileInputRef.current) {
            fileInputRef.current.value = null;
            fileInputRef.current.click();
        }
    }

    function handleFileChange(event) {
    const files = event.target.files;
    if (!files.length) return;

    for (let i = 0; i < files.length; i++) {
        const file = files[i];

        if (!file.name.endsWith(".json")) {
            alert(`File not allowed: ${file.name} (only JSON)`);
            continue;
        }

        const reader = new FileReader();

        reader.onload = e => {
            try {
                const json = JSON.parse(e.target.result);
                onFileUpload(json);
            } catch {
                alert(`Invalid JSON file: ${file.name}`);
            }
        };

        reader.readAsText(file);
    }
}

    

    return (
        <div className="panel-files">
            <div className={`icon-wrapper download-icon ${shrinkTarget === 'download' ? 'shrink' : ''}`} onClick={() => handleClick('download')}>
                <FileDownloadIcon className='icon-panel' />
                <span className="icon-text download-text">Download Template</span>
            </div>
            <div className={`icon-wrapper upload-icon ${shrinkTarget === 'upload' ? 'shrink' : ''}`} onClick={handleUploadClick}>
                <FileUploadIcon className='icon-panel' />
                <span className="icon-text upload-text">Upload Template</span>
            </div>

             <input
                type="file"
                ref={fileInputRef}
                style={{ display: "none" }}
                accept=".json"
                onChange={handleFileChange}
        
            />
        </div>
    );
}

export default PanelFiles;
