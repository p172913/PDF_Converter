import React, { useState } from 'react';
import axios from 'axios';
import '../../public/ImageUploader.css'; // Ensure the path is correct

const ImageUploader = () => {
    const [files, setFiles] = useState([]);
    const [pdfFile, setPdfFile] = useState('');
    const [error, setError] = useState('');

    const handleFileChange = (event) => {
        const files = event.target.files;
        const validFiles = Array.from(files).filter(file => 
            file.type === 'image/png' // Accept only PNG files
        );

        if (validFiles.length === 0) {
            alert("Please upload a valid PNG file.");
            return;
        }

        setFiles((prevFiles) => [...prevFiles, ...validFiles]);
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
            const response = await axios.post('http://localhost:8002/convert/', formData);
            setPdfFile(response.data.filename); // Assuming response has filename
            setError('');
        } catch (err) {
            setError('Error converting images to PDF. Please try again.');
        }
    };

    const handleDownload = () => {
        if (pdfFile) {
            const link = document.createElement('a');
            link.href = `http://localhost:8002/uploads/${pdfFile}`;
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

    const handleAddFile = () => {
        document.getElementById('file-input').click(); // Trigger the file input click
    };

    return (
        <div className="image-uploader">
            <h1>PNG to PDF Converter</h1>
            <input 
                type="file" 
                accept="image/png" // Accept only PNG files
                multiple 
                onChange={handleFileChange} 
                id="file-input" 
                style={{ display: 'none' }} // Hide the default file input
            />
            <button onClick={handleAddFile}>Choose Files</button>
            <button onClick={handleUpload}>Convert to PDF</button>
            {error && <p className="error">{error}</p>}
            {pdfFile && (
                <button onClick={handleDownload}>Download PDF</button>
            )}

            <div className="image-preview-container">
                <h3 style={{ display: 'inline-block' }}>Selected Images</h3>
                <button onClick={handleAddFile} style={{ marginLeft: '10px' }}>Add More Images</button>
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