import React from 'react';

/**
 * Builds a Netlify Image CDN URL with AVIF format and quality 80 by default.
 * Format: /.netlify/images?url=<path>&w=<width>&fm=avif&q=80
 */
export function getNetlifyImageUrl(
  url: string,
  width: number = 800,
  format: string = 'avif',
  quality: number = 80
): string {
  if (!url || url.startsWith('data:')) return url;
  const encodedUrl = url.startsWith('http') ? encodeURIComponent(url) : url;
  return `/.netlify/images?url=${encodedUrl}&w=${width}&fm=${format}&q=${quality}`;
}

/**
 * Builds a responsive srcset string using Netlify Image CDN across widths 400, 800, and 1200.
 */
export function getNetlifyImageSrcSet(
  url: string,
  widths: number[] = [400, 800, 1200],
  format: string = 'avif',
  quality: number = 80
): string {
  if (!url || url.startsWith('data:')) return '';
  const encodedUrl = url.startsWith('http') ? encodeURIComponent(url) : url;
  return widths
    .map((w) => `/.netlify/images?url=${encodedUrl}&w=${w}&fm=${format}&q=${quality} ${w}w`)
    .join(', ');
}

export interface NetlifyImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src' | 'srcSet'> {
  src: string;
  alt: string;
  width: number;
  height: number;
  priority?: boolean;
  quality?: number;
  format?: string;
  widths?: number[];
}

/**
 * Netlify Image CDN component that outputs an <img> tag with AVIF format,
 * responsive srcset (400, 800, 1200), explicit width/height, and appropriate
 * loading/fetchPriority attributes.
 */
export default function NetlifyImage({
  src,
  alt,
  width,
  height,
  priority = false,
  quality = 80,
  format = 'avif',
  widths = [400, 800, 1200],
  className = '',
  loading,
  fetchPriority,
  sizes,
  ...rest
}: NetlifyImageProps) {
  const isData = src.startsWith('data:');
  const finalSrc = isData ? src : getNetlifyImageUrl(src, width, format, quality);
  const finalSrcSet = isData ? undefined : getNetlifyImageSrcSet(src, widths, format, quality);
  const finalLoading = loading || (priority ? 'eager' : 'lazy');
  const finalFetchPriority = fetchPriority || (priority ? 'high' : 'auto');

  return (
    <img
      src={finalSrc}
      srcSet={finalSrcSet}
      sizes={sizes || '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'}
      alt={alt}
      width={width}
      height={height}
      loading={finalLoading}
      fetchPriority={finalFetchPriority}
      className={className}
      {...rest}
    />
  );
}
