import React, { Fragment, useState, useEffect } from 'react';
import { exact, string, number } from 'prop-types';
import SmoothCollapse from 'react-smooth-collapse';
import { isEmpty } from 'lodash';
import { appearingInSequence } from '../../../../data/animations/variant.js';
import PresentedContentGenerator from './services/presentedContentGenerator.js';
import ShadowedBox from '../../../reusable/containers/ShadowedBox.jsx';
import Rating from '../../../reusable/various/Rating.jsx';
import Avatar from '../../../reusable/various/Avatar.jsx';

const Opinion = ({
  opinionsData: {
    content,
    mark,
    updatedAt,
    user: {
      email,
      avatars
    }
  },
  index
}) => {
  const blockName = 'opinion';
  const displayedNumberOfChars = 25;
  const [contentExpanded, setContentExpanded] = useState(false);
  const [presentedNarrowContent, setPresentedNarrowContent] = useState();
  const [presentedRestOfContent, setPresentedRestOfContent] = useState();
  const [isTextToLongToDisplay, setIsTextToLongToDisplay] = useState();

  const handleExpandContentOnMouseDown = () => {
    setContentExpanded(!contentExpanded);
  };

  useEffect(() => {
    const {
      narrowContent,
      restOfContent,
      textToLongToDisplay
    } = new PresentedContentGenerator({ displayedNumberOfChars, content, contentExpanded }).call();

    setPresentedNarrowContent(narrowContent);
    setPresentedRestOfContent(restOfContent);
    setIsTextToLongToDisplay(textToLongToDisplay);
  }, [contentExpanded]);

  return (
    <ShadowedBox
      classNames={blockName}
      animationAttributes={{
        variants: appearingInSequence,
        custom: index,
        initial: appearingInSequence.hidden,
        animate: appearingInSequence.visible
      }}
    >
      <Fragment>
        <div className={`${blockName}__picture-wrapper`}>
          <Avatar
            avatars={avatars}
            classNames={`${blockName}__picture`}
          />
        </div>
        <div className={`${blockName}__user-email`}>{email}</div>
        <div className={`${blockName}__updated-at`}>{updatedAt}</div>
        <div className={`${blockName}__mark`}>
          <Rating value={mark} readOnly />
        </div>
        <div className={`${blockName}__content-wrapper`}>
          <p className={`${blockName}__content`}>
            { presentedNarrowContent }
            {
              !isEmpty(presentedRestOfContent) && (
                <SmoothCollapse expanded={contentExpanded}>
                  { presentedRestOfContent }
                </SmoothCollapse>
              )
            }
          </p>
          {
            isTextToLongToDisplay && (
              <span
                className={`${blockName}__content-expander`}
                onMouseDown={handleExpandContentOnMouseDown}
                role="button"
                tabIndex={0}
              >
                { contentExpanded ? 'Schowaj' : 'Czytaj więcej' }
              </span>
            )
          }
        </div>
      </Fragment>
    </ShadowedBox>
  );
};

Opinion.propTypes = exact({
  content: string.isRequired,
  mark: number.isRequired,
  updatedAt: string.isRequired,
  email: string.isRequired
}).isRequired;

export default Opinion;