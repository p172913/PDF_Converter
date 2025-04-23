// // word-to-pdf-converter/frontend/src/components/WordUploader.jsx
// import React, { useState } from 'react';
// import axios from 'axios';
// import '../../public/ImageUploader.css'; // Reuse the same styles

// const WordUploader = () => {
//     const [files, setFiles] = useState([]);
//     const [pdfFiles, setPdfFiles] = useState([]);
//     const [error, setError] = useState('');

//     const handleFileChange = (event) => {
//         const selectedFiles = event.target.files;
//         const validFiles = Array.from(selectedFiles).filter(file =>
//             file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
//             file.type === 'application/msword'
//         );

//         if (validFiles.length === 0) {
//             alert("Please upload valid Word files (.doc or .docx).");
//             return;
//         }

//         setFiles(prev => [...prev, ...validFiles]);
//         setPdfFiles([]);
//         setError('');
//     };

//     const handleUpload = async () => {
//         if (files.length === 0) {
//             setError('Please select at least one Word file.');
//             return;
//         }

//         const formData = new FormData();
//         files.forEach(file => formData.append('files', file));

//         try {
//             const response = await axios.post('http://localhost:8003/convert/', formData);
//             setPdfFiles(response.data.pdfs);
//             setError('');
//         } catch (err) {
//             setError('Error converting Word files to PDF. Please try again.');
//         }
//     };

//     const handleDownload = (pdfFile) => {
//         const link = document.createElement('a');
//         link.href = `http://localhost:8003${pdfFile}`;
//         link.setAttribute('download', pdfFile.split('/').pop());
//         document.body.appendChild(link);
//         link.click();
//         document.body.removeChild(link);
//     };

//     const moveFile = (index, direction) => {
//         const newFiles = [...files];
//         const [moved] = newFiles.splice(index, 1);
//         newFiles.splice(index + direction, 0, moved);
//         setFiles(newFiles);
//     };

//     const handleAddFile = () => {
//         document.getElementById('file-input').click();
//     };

//     return (
//         <div className="image-uploader">
//             <h1>Word to PDF Converter</h1>
//             <input
//                 type="file"
//                 accept=".doc,.docx"
//                 multiple
//                 onChange={handleFileChange}
//                 id="file-input"
//                 style={{ display: 'none' }}
//             />
//             <button onClick={handleAddFile}>Choose Files</button>
//             <button onClick={handleUpload}>Convert to PDF</button>
//             {error && <p className="error">{error}</p>}
//             {pdfFiles.length > 0 && (
//                 <div>
//                     <h3>Converted PDF Files:</h3>
//                     {pdfFiles.map((pdfFile, index) => (
//                         <div key={index}>
//                             <span>{pdfFile.split('/').pop()}</span>
//                             <button onClick={() => handleDownload(pdfFile)}>Download</button>
//                         </div>
//                     ))}
//                 </div>
//             )}

//             <div className="image-preview-container">
//                 <h3 style={{ display: 'inline-block' }}>Selected Word Files</h3>
//                 <button onClick={handleAddFile} style={{ marginLeft: '10px' }}>Add More Files</button>
//                 <div className="image-row">
//                     {files.map((file, index) => (
//                         <div key={index} className="image-preview">
//                             <div className="button-container">
//                                 <button
//                                     className="arrow-button"
//                                     onClick={() => moveFile(index, -1)}
//                                     disabled={index === 0}
//                                 >
//                                     ←
//                                 </button>
//                                 <button
//                                     className="arrow-button"
//                                     onClick={() => moveFile(index, 1)}
//                                     disabled={index === files.length - 1}
//                                 >
//                                     →
//                                 </button>
//                             </div>
//                             <div className="image-name">{file.name}</div>
//                         </div>
//                     ))}
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default WordUploader;
import React, { useState } from 'react';
import axios from 'axios';
import '../../public/ImageUploader.css'; // Reuse the same styles

const WordUploader = () => {
    const [file, setFile] = useState(null);
    const [pdfFile, setPdfFile] = useState('');
    const [error, setError] = useState('');

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];

        if (selectedFile && (selectedFile.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || selectedFile.type === 'application/msword')) {
            setFile(selectedFile);
            setPdfFile('');
            setError('');
        } else {
            alert("Please upload a valid Word file (.doc or .docx).");
        }
    };

    const handleUpload = async () => {
        if (!file) {
            setError('Please select a Word file.');
            return;
        }

        const formData = new FormData();
        formData.append('files', file);

        try {
            const response = await axios.post('http://localhost:8003/convert/', formData);
            setPdfFile(response.data.pdfs[0]); // Assuming the response returns an array
            setError('');
        } catch (err) {
            setError('Error converting Word file to PDF. Please try again.');
        }
    };

    const handleDownload = () => {
        if (pdfFile) {
            const link = document.createElement('a');
            link.href = `http://localhost:8003${pdfFile}`;
            link.setAttribute('download', pdfFile.split('/').pop());
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } else {
            setError('No PDF file available for download.');
        }
    };

    return (
        <div className="image-uploader">
            <h1>Word to PDF Converter</h1>
            <input
                type="file"
                accept=".doc,.docx"
                onChange={handleFileChange}
                id="file-input"
            />
            <button onClick={handleUpload}>Convert to PDF</button>
            {error && <p className="error">{error}</p>}
            {pdfFile && (
                <div>
                    <h3>Converted PDF File:</h3>
                    <span>{pdfFile.split('/').pop()}</span>
                    <button onClick={handleDownload}>Download</button>
                </div>
            )}
        </div>
    );
};

export default WordUploader;