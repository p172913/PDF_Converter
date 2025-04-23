import React from 'react';

const DownloadButton = ({ pdfFile }) => {
    const handleDownload = () => {
        // Logic to download the PDF file
        const link = document.createElement('a');
        link.href = pdfFile;
        link.download = 'converted.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <button onClick={handleDownload}>
            Download PDF
        </button>
    );
};

export default DownloadButton;