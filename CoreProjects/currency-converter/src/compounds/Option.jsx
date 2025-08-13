import '../styles/Option.css'


function formatOptionLabel({ code, label, place }, {context}) {
    if (context === 'menu') {
        return (
            <div className="container-option">
            <img
                src={`/svg/${code}.svg`}
                alt={place}
                width={20}
                height={15}
                style={{ objectFit: 'contain' }}
                className="img-opt"
            />
            <span className="text-opt">{code} - {place}</span>
            </div>
        );
    } else if (context === 'value') {
        return (
            <div className="container-option">
                <img
                src={`/svg/${code}.svg`}
                alt={place}
                width={20}
                height={15}
                style={{ objectFit: 'contain' }}
                className="img-opt"
                />
                <span className="text-opt">{code}</span>
            </div>
        );
    }
    
}

export default formatOptionLabel;