import React, { Fragment, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useLazyQuery, useMutation } from '@apollo/client';
import { USER_PERSONAL_DETAILS, IS_USER_SAVED_TO_NEWSLETTER } from 'graphql/queries/user.js';
import { SUBSCRIBE_TO_NEWSLETTER } from 'graphql/mutations/user.js';
import useIsLogged from 'hooks/useIsLogged.jsx';
import handleSaveToNewsletterValidation from 'services/newsletter/handleSaveToNewsletterValidation.js';
import FormContainer from 'components/containers/FormContainer.jsx';
import TextInput from 'components/inputs/TextInput.jsx';
import SubmitButton from 'components/SubmitButton.jsx';
import SuccessModal from 'components/modals/SuccessModal.jsx';
import LoadingModal from 'components/modals/LoadingModal.jsx';
import ErrorModal from 'components/modals/ErrorModal.jsx';

const Newsletter = () => {
  const blockName = 'newsletter';
  const { loggedUserId } = useSelector((store) => store.user);
  const isLogged = useIsLogged();
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [nameErrorMessage, setNameErrorMessage] = useState('');
  const [surnameErrorMessage, setSurnameErrorMessage] = useState('');
  const [emailErrorMessage, setEmailErrorMessage] = useState('');
  const [subscribingToNewsletterSuccess, setSubscribingToNewsletterSuccess] = useState(false);
  const [subscribingToNewsletterError, setSubscribingToNewsletterError] = useState(false);
  const [isUserSavedToNewsletter, setIsUserSavedToNewsletter] = useState(false);

  const [getPersonalDetails, { data: getPersonalDetailsData }] = useLazyQuery(
    USER_PERSONAL_DETAILS,
    {
      variables: { userId: loggedUserId },
      onCompleted: () => {
        const { user: userData } = getPersonalDetailsData;

        setName(userData.name || '');
        setSurname(userData.surname || '');
        setEmail(userData.email || '');
      }
    }
  );

  const [checkIfSavedToNewsletter, {
    called: checkIfSavedToNewsletterCalled,
    data: checkIfSavedToNewsletterData,
    refetch: checkIfSavedToNewsletterRefetch
  }] = useLazyQuery(
    IS_USER_SAVED_TO_NEWSLETTER,
    {
      variables: { userId: loggedUserId },
      fetchPolicy: 'network-only',
      onCompleted: () => {
        const { user: { savedToNewsletter } } = checkIfSavedToNewsletterData;
        setIsUserSavedToNewsletter(savedToNewsletter);
      },
      onError: () => setIsUserSavedToNewsletter(false)
    }
  );

  const [subscribeToNewsletter, { loading: subscribingToNewsletterLoading }] = useMutation(SUBSCRIBE_TO_NEWSLETTER, {
    variables: { input: { email, name, surname } },
    onCompleted: () => {
      setSubscribingToNewsletterSuccess(true);
      checkIfSavedToNewsletterRefetch();
      clearForm();
    },
    onError: () => setSubscribingToNewsletterError(true)
  });

  const handleNameOnChange = ({ target: { value } }) => setName(value);
  const handleSurnameOnChange = ({ target: { value } }) => setSurname(value);
  const handleEmailOnChange = ({ target: { value } }) => setEmail(value);

  const clearForm = () => {
    setName('');
    setSurname('');
    setEmail('');
  };

  const handleSaveToNewsletter = () => {
    const {
      nameError,
      surnameError,
      emailError,
      validationStatus
    } = handleSaveToNewsletterValidation({ name, surname, email });

    setNameErrorMessage(nameError);
    setSurnameErrorMessage(surnameError);
    setEmailErrorMessage(emailError);
    if (!validationStatus) return;

    subscribeToNewsletter();
  };

  useEffect(() => {
    if (!isLogged) return clearForm();

    getPersonalDetails();
    if (!checkIfSavedToNewsletterCalled) checkIfSavedToNewsletter();
  }, [isLogged]);

  if (isLogged && isUserSavedToNewsletter) return null;

  return (
    <div className={blockName} id="newsletter-form">
      <FormContainer
        header="Zapisz się na newsletter aby być na bieżąco!"
        form={(
          <Fragment>
            <TextInput
              placeholder="Imię"
              classNames="text-input--newsletter"
              value={name}
              onChange={handleNameOnChange}
              validationError={nameErrorMessage}
              dataCy="newsletter-name"
            />
            <TextInput
              placeholder="Nazwisko"
              classNames="text-input--newsletter"
              value={surname}
              onChange={handleSurnameOnChange}
              validationError={surnameErrorMessage}
              dataCy="newsletter-surname"
            />
            <TextInput
              placeholder="Adres email"
              classNames="text-input--newsletter"
              value={email}
              onChange={handleEmailOnChange}
              validationError={emailErrorMessage}
              dataCy="newsletter-email"
            />
            <SubmitButton
              onMouseDown={handleSaveToNewsletter}
              value="Zapisz"
              classNames="button--newsletter"
              dataCy="newsletter-submit-button"
            />
          </Fragment>
        )}
      />
      <LoadingModal
        isOpen={subscribingToNewsletterLoading}
        info="Jesteś zapisywany na newsletter!"
      />
      <SuccessModal
        isOpen={subscribingToNewsletterSuccess}
        handleOnClose={() => setSubscribingToNewsletterSuccess(false)}
        info="Zostałeś zapisany na newsletter!"
      />
      <ErrorModal
        isOpen={subscribingToNewsletterError}
        handleOnClose={() => setSubscribingToNewsletterError(false)}
        info="Niestety nie udało się zapisać na newsletter!"
      />
    </div>
  );
};

export default Newsletter;
