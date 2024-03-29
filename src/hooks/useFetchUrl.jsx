import { useState, useEffect } from 'react';
import { getSignedUrl } from 'services/s3Service.js';
import { AWS_BUCKET } from 'utils/environment.js';

const useFetchUrl = ({ bucket = AWS_BUCKET, key }) => {
  const [objectURL, setObjectURL] = useState(null);

  useEffect(() => {
    const url = getSignedUrl({ bucket, key });
    setObjectURL(url);
  }, []);

  return objectURL;
};

export default useFetchUrl;
