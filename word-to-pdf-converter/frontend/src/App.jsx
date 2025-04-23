import React from 'react';
import '../public/App.css';
import ImageUploader from './components/ImageUploader';

const App = () => {
    return (
        <div>
            <h1>Word to PDF Converter</h1>
            <nav>
                <ul>
                    <li><a href="http://localhost:3000" target="_blank">Image to PDF</a></li>
                    <li><a href="http://localhost:3001" target="_blank">JPG to PDF</a></li>
                    <li><a href="http://localhost:3002" target="_blank">PNG to PDF</a></li>
                    <li><a href="http://localhost:3003" target="_blank">Word to PDF</a></li>
                    <li><a href="http://localhost:3004" target="_blank">JPG to PNG</a></li>
                    <li><a href="http://localhost:3005" target="_blank">PNG to JPG</a></li>
                    <li><a href="http://localhost:3006" target="_blank">Excel to PDF</a></li>
                </ul>
            </nav>
            <ImageUploader />
        </div>
    );
};

export default App;