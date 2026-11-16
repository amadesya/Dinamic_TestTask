import React, { useState } from 'react';
import styles from './ImageGallery.module.scss';

export interface ImageGalleryProps {
  images?: string[];
  title?: string;
}

export const ImageGallery: React.FC<ImageGalleryProps> = ({ images = [], title = 'Товар' }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [hasError, setHasError] = useState(false);

  const validImages = images.filter(Boolean);
  const activeImage = validImages[selectedIndex] || validImages[0];

  return (
    <div className={styles.gallery}>
      <div className={styles.mainImageWrapper}>
        {activeImage && !hasError ? (
          <img
            src={activeImage}
            alt={`${title} - вид ${selectedIndex + 1}`}
            className={styles.mainImage}
            onError={() => setHasError(true)}
          />
        ) : (
          <div className={styles.fallback}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
            </svg>
            <span>Изображение недоступно</span>
          </div>
        )}
      </div>

      {validImages.length > 1 && (
        <div className={styles.thumbnails}>
          {validImages.map((img, idx) => (
            <button
              key={`${img}-${idx}`}
              type="button"
              className={`${styles.thumbnailButton} ${idx === selectedIndex ? styles.active : ''}`}
              onClick={() => {
                setSelectedIndex(idx);
                setHasError(false);
              }}
              aria-label={`Выбрать фото ${idx + 1}`}
            >
              <img src={img} alt={`${title} превью ${idx + 1}`} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
