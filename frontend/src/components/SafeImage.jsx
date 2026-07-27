import { useState } from 'react';
import { useLang } from '../i18n/LangContext.jsx';

export default function SafeImage({
  src,
  alt,
  className,
  loading = 'lazy',
  fetchPriority = 'auto',
  width,
  height,
  sizes
}) {
  const { t } = useLang();
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return <span className={`placeholder ${className || ''}`}>{t('image.unavailable')}</span>;
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading={loading}
      fetchpriority={fetchPriority}
      width={width}
      height={height}
      sizes={sizes}
      decoding="async"
      onError={() => setFailed(true)}
    />
  );
}
