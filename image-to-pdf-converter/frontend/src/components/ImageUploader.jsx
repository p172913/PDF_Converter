import React, { useState } from 'react';
import axios from 'axios';
import '../../public/ImageUploader.css'; // Make sure the path is correct

const ImageUploader = () => {
    const [files, setFiles] = useState([]);
    const [pdfFile, setPdfFile] = useState('');
    const [error, setError] = useState('');

    const handleFileChange = (event) => {
        setFiles(Array.from(event.target.files));
        setPdfFile('');
        setError('');
    };

    const handleUpload = async () => {
        if (files.length === 0) {
            setError('Please select at least one image file.');
            return;
        }

        const formData = new FormData();
        files.forEach(file => {
            formData.append('files', file);
        });

        try {
            const response = await axios.post('http://localhost:8000/convert/', formData);
            setPdfFile(response.data.filename); // Assuming response has filename
            setError('');
        } catch (err) {
            setError('Error converting images to PDF. Please try again.');
        }
    };

    const handleDownload = () => {
        if (pdfFile) {
            const link = document.createElement('a');
            link.href = `http://localhost:8000/uploads/${pdfFile}`;
            link.setAttribute('download', pdfFile);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } else {
            setError('No PDF file available for download.');
        }
    };

    const moveImage = (index, direction) => {
        const newFiles = [...files];
        const [movedFile] = newFiles.splice(index, 1);
        newFiles.splice(index + direction, 0, movedFile);
        setFiles(newFiles);
    };

    return (
        <div className="image-uploader">
            <h1>Image to PDF Converter</h1>
            <input type="file" accept="image/*" multiple onChange={handleFileChange} />
            <button onClick={handleUpload}>Convert to PDF</button>
            {error && <p className="error">{error}</p>}
            {pdfFile && (
                <button onClick={handleDownload}>Download PDF</button>
            )}

            <div className="image-preview-container">
                <h3>Selected Images</h3>
                <div className="image-row">
                    {files.map((file, index) => (
                        <div key={index} className="image-preview">
                            <div className="button-container">
                                <button
                                    className="arrow-button"
                                    onClick={() => moveImage(index, -1)}
                                    disabled={index === 0}
                                >
                                    ←
                                </button>
                                <button
                                    className="arrow-button"
                                    onClick={() => moveImage(index, 1)}
                                    disabled={index === files.length - 1}
                                >
                                    →
                                </button>
                            </div>
                            <img
                                src={URL.createObjectURL(file)}
                                alt={file.name}
                                className="image"
                            />
                            <span className="image-name">{file.name}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ImageUploader;
