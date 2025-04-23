// import React, { useState } from 'react';
// import axios from 'axios';
// import '../../public/ImageUploader.css'; // Ensure the path is correct

// const ImageUploader = () => {
//     const [file, setFile] = useState(null); // Store a single file
//     const [downloadLink, setDownloadLink] = useState(''); // Store download link for JPG file
//     const [error, setError] = useState('');

//     const handleFileChange = (event) => {
//         const selectedFile = event.target.files[0]; // Get the first file

//         if (selectedFile && selectedFile.type === 'image/png') {
//             setFile(selectedFile);
//             setError('');
//         } else {
//             setError("Please upload a valid PNG file."); // Update error message
//             setFile(null); // Reset file state
//         }
//     };

//     const handleUpload = async () => {
//         if (!file) {
//             setError('Please select an image file.');
//             return;
//         }

//         const formData = new FormData();
//         formData.append('files', file); // Append the single file

//         try {
//             const response = await axios.post('http://localhost:8005/convert/', formData);
//             console.log('Converted filename:', response.data.filenames[0]); // Log the response
//             setDownloadLink(response.data.filenames[0]); // Store the download link for the JPG file
//             setError('');
//         } catch (err) {
//             console.error('Upload error:', err);
//             setError('Error converting image. Please try again.');
//         }
//     };

//     const handleDownload = () => {
//         if (!downloadLink) return; // Do nothing if no link

//         const link = document.createElement('a');
//         link.href = `http://localhost:8005/uploads/${downloadLink}`;
//         link.setAttribute('download', downloadLink);
//         document.body.appendChild(link);
//         link.click();
//         document.body.removeChild(link);
//     };

//     return (
//         <div className="image-uploader">
//             <h1>PNG to JPG Converter</h1>

//             <input
//                 type="file"
//                 accept="image/png"
//                 onChange={handleFileChange}
//                 id="file-input"
//                 style={{ display: 'none' }}
//             />

//             <button onClick={() => document.getElementById('file-input').click()}>Choose File</button>
//             <button onClick={handleUpload}>Convert to JPG</button>

//             {error && <p className="error">{error}</p>}

//             {downloadLink && (
//                 <div>
//                     <h3>Download Link:</h3>
//                     <button onClick={handleDownload}>
//                         Download {downloadLink}
//                     </button>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default ImageUploader;
import React, { useState } from 'react';
import axios from 'axios';
import '../../public/ImageUploader.css';

const ImageUploader = () => {
    const [file, setFile] = useState(null);
    const [downloadLink, setDownloadLink] = useState('');
    const [error, setError] = useState('');

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];

        if (selectedFile && selectedFile.type === 'image/png') {
            setFile(selectedFile);
            setError('');
        } else {
            setError("Please upload a valid PNG file.");
            setFile(null);
        }
    };

    const handleUpload = async () => {
        if (!file) {
            setError('Please select an image file.');
            return;
        }

        const formData = new FormData();
        formData.append('files', file);

        try {
            const response = await axios.post('http://localhost:8005/convert/', formData);
            setDownloadLink(response.data.filenames[0]);
            setError('');
        } catch (err) {
            setError('Error converting image. Please try again.');
        }
    };

    const handleDownload = () => {
        if (!downloadLink) return;

        const link = document.createElement('a');
        link.href = `http://localhost:8005/uploads/${downloadLink}`;
        link.setAttribute('download', downloadLink);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="image-uploader">
            <h1>JPG to PNG Converter</h1>

            <input
                type="file"
                accept="image/png"
                onChange={handleFileChange}
                id="file-input"
                style={{ display: 'none' }}
            />
            <button onClick={() => document.getElementById('file-input').click()}>Choose File</button>
            <button onClick={handleUpload}>Convert to JPG</button>

            {file && <p>Selected file: {file.name}</p>}
            {error && <p className="error">{error}</p>}

            {downloadLink && (
                <div>
                    <h3>Download Link:</h3>
                    <button onClick={handleDownload}>Download JPG</button>
                    <br />
                    <img src={`http://localhost:8005/uploads/${downloadLink}`} alt="Converted" width="300" />
                </div>
            )}
        </div>
    );
};

export default ImageUploader;