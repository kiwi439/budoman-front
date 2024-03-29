import React, { useState, useEffect } from 'react';
import useIsMobile from 'hooks/useIsMobile.jsx';
import { getSignedUrl } from 'services/s3Service.js';
import widthBreakpoints from 'data/widthBreakpoints.js';

const AdvertisingBox = () => {
  const blockName = 'advertising-box';
  const [backgroundPictureURL, setBackgroundPictureURL] = useState(null);
  const isMobile = useIsMobile(widthBreakpoints.xl);

  useEffect(() => {
    const backgroundPictureKey = isMobile ? 'images/construction-photos/building-house.jpeg' : 'images/construction-photos/paver.jpeg';
    const pictureURL = getSignedUrl({ key: backgroundPictureKey });
    setBackgroundPictureURL(pictureURL);
  }, [isMobile]);

  return (
    <div className={blockName}>
      <div className={`${blockName}__background ${blockName}__background--dimmer`} />
      <div
        style={{ backgroundImage: `url(${backgroundPictureURL})` }}
        className={`${blockName}__background ${blockName}__background--picture`}
      />
      <div className={`${blockName}__text-wrapper`}>
        <h2 className={`${blockName}__header`}>Największy sklep budowlany w Polsce</h2>
        <p className={`${blockName}__text`}>Tysiące produktów wysokiej jakości</p>
      </div>
    </div>
  );
};

export default AdvertisingBox;
