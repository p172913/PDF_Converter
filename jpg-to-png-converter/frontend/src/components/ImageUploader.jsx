// import React, { useState } from 'react';
// import axios from 'axios';
// import '../../public/ImageUploader.css'; // Ensure the path is correct

// const ImageUploader = () => {
//     const [file, setFile] = useState(null);
//     const [downloadLink, setDownloadLink] = useState('');
//     const [error, setError] = useState('');

//     const handleFileChange = (event) => {
//         const selectedFile = event.target.files[0];
//         if (selectedFile) {
//             if (selectedFile.type === 'image/jpeg') { // Accept JPG files
//                 setFile(selectedFile);
//                 setError('');
//             } else {
//                 alert("Please upload a valid JPG file.");
//                 setFile(null);
//             }
//         }
//     };

//     const handleUpload = async () => {
//         if (!file) {
//             setError('Please select an image file.');
//             return;
//         }

//         const formData = new FormData();
//         formData.append('file', file); // Append the JPG file

//         try {
//             const response = await axios.post('http://localhost:8004/convert/', formData);
//             const pngFile = response.data.filename; // Get the PNG filename from the response
//             setDownloadLink(pngFile); // Store the download link for the PNG file
//             setError('');
//         } catch (err) {
//             setError('Error converting image. Please try again.');
//         }
//     };

//     const handleDownload = () => {
//         if (downloadLink) {
//             const link = document.createElement('a');
//             link.href = `http://localhost:8004/uploads/${downloadLink}`;
//             link.setAttribute('download', downloadLink);
//             document.body.appendChild(link);
//             link.click();
//             document.body.removeChild(link);
//         } else {
//             setError('No PNG file available for download.');
//         }
//     };

//     return (
//         <div className="image-uploader">
//             <h1>JPG to PNG Converter</h1>

//             <input
//                 type="file"
//                 accept="image/jpeg"
//                 onChange={handleFileChange}
//                 id="file-input"
//                 style={{ display: 'none' }}
//             />

//             <button onClick={() => document.getElementById('file-input').click()}>Choose File</button>
//             <button onClick={handleUpload}>Convert to PNG</button>

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
import '../../public/ImageUploader.css'; // Ensure it's in src/components/

const ImageUploader = () => {
    const [file, setFile] = useState(null);
    const [downloadLink, setDownloadLink] = useState('');
    const [error, setError] = useState('');

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile) {
            const isJpg = selectedFile.type === 'image/jpeg' || selectedFile.type === 'image/jpg' ||
                          selectedFile.name.endsWith('.jpg') || selectedFile.name.endsWith('.jpeg');
            if (isJpg) {
                setFile(selectedFile);
                setError('');
            } else {
                alert("Please upload a valid JPG file.");
                setFile(null);
            }
        }
    };

    const handleUpload = async () => {
        if (!file) {
            setError('Please select a JPG image.');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post('http://localhost:8004/convert/', formData);
            const pngFile = response.data.filename;
            setDownloadLink(pngFile);
            setError('');
        } catch (err) {
            setError(err.response?.data?.detail || 'Error converting image. Please try again.');
        }
    };

    const handleDownload = () => {
        if (downloadLink) {
            const link = document.createElement('a');
            link.href = `http://localhost:8004/uploads/${downloadLink}`;
            link.setAttribute('download', downloadLink);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } else {
            setError('No PNG file available for download.');
        }
    };

    return (
        <div className="image-uploader">
            <h1>JPG to PNG Converter</h1>

            <input
                type="file"
                accept="image/jpeg"
                onChange={handleFileChange}
                id="file-input"
                style={{ display: 'none' }}
            />
            <button onClick={() => document.getElementById('file-input').click()}>Choose File</button>
            <button onClick={handleUpload}>Convert to PNG</button>

            {file && <p>Selected file: {file.name}</p>}
            {error && <p className="error">{error}</p>}

            {downloadLink && (
                <div>
                    <h3>Download Link:</h3>
                    <button onClick={handleDownload}>Download PNG</button>
                    <br />
                    <img src={`http://localhost:8004/uploads/${downloadLink}`} alt="Converted" width="300" />
                </div>
            )}
        </div>
    );
};

export default ImageUploader;