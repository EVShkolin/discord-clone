import { useEffect, useState } from 'react';

import defaultImage from '@shared/assets/svg/upload-image.svg';
import styles from './ImageInput.module.css';

const ImageInput = () => {
  const [preview, setPreview] = useState(null);

  const handleImageLoad = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      if (preview) URL.revokeObjectURL(preview);
      setPreview(URL.createObjectURL(file));
    } else {
      setPreview(null);
    }
  };

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  return (
    <label htmlFor="imageInput" className={styles.imageLabel}>
      {preview ? (
        <div className={styles.previewWrapper}>
          <img src={preview} alt="Preview" />
        </div>
      ) : (
        <img src={defaultImage} alt="Preview" />
      )}

      <input type="file" id="imageInput" className={styles.imageInput} onChange={handleImageLoad} />
    </label>
  );
};

export default ImageInput;
