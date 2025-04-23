import React from 'react';

const ImageReorder = ({ images, setImages }) => {
    const handleReorder = (index, direction) => {
        const newImages = [...images];
        const [movedImage] = newImages.splice(index, 1);
        newImages.splice(index + direction, 0, movedImage);
        setImages(newImages);
    };

    return (
        <div>
            {images.map((image, index) => (
                <div key={index}>
                    <img src={image} alt={`Uploaded ${index}`} />
                    <button onClick={() => handleReorder(index, -1)}>Up</button>
                    <button onClick={() => handleReorder(index, 1)}>Down</button>
                </div>
            ))}
        </div>
    );
};

export default ImageReorder;