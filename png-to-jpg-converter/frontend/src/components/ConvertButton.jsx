import React from 'react';

const ConvertButton = ({ onClick, loading }) => {
    return (
        <button onClick={onClick} disabled={loading}>
            {loading ? 'Converting...' : 'Convert to JPG'}
        </button>
    );
};

export default ConvertButton;