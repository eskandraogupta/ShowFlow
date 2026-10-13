import React from 'react';
import { fallbackImage } from '../data/imageAssets';

type ImageWithFallbackProps = React.ImgHTMLAttributes<HTMLImageElement>;

export const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({ onError, ...props }) => (
  <img
    {...props}
    onError={(event) => {
      onError?.(event);
      if (!event.defaultPrevented && event.currentTarget.dataset.fallbackApplied !== 'true') {
        event.currentTarget.dataset.fallbackApplied = 'true';
        event.currentTarget.src = fallbackImage;
      }
    }}
  />
);
