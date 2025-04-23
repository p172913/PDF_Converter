import React, { useState } from 'react';
import ImageUploader from '../components/ImageUploader';
import DownloadButton from '../components/DownloadButton';
import useUpload from '../hooks/useUpload';

const Home = () => {
    const [file, setFile] = useState(null);
    const { upload, loading, error, pdfFile } = useUpload();

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleUpload = () => {
        if (file) {
            upload(file);
        }
    };

    return (
        <div>
            <h1>PNG to JPG Converter</h1>
            <ImageUploader onChange={handleFileChange} />
            <button onClick={handleUpload} disabled={loading}>
                {loading ? 'Uploading...' : 'Convert to JPG'}
            </button>
            {error && <p>Error: {error}</p>}
            {pdfFile && <DownloadButton pdfFile={pdfFile} />}
        </div>
    );
};

export default Home;