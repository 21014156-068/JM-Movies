import React, { useEffect } from 'react';
import { updatePageSEO, SEOProps } from '../utils/seo';

export const SEOHead: React.FC<SEOProps> = (props) => {
  useEffect(() => {
    updatePageSEO(props);
  }, [
    props.title,
    props.description,
    props.image,
    props.url,
    props.type,
    props.movie?.id,
    props.moviesList?.length,
    props.keywords?.join(',')
  ]);

  return null;
};
