import React, { Fragment, useState, useRef, useEffect } from 'react';
import { useMutation } from '@apollo/client';
import { REGISTER_USER } from '../../../graphql/mutations/register_user';
import AvatarsGenerator from '../../../services/RegisterForm/AvatarsGenerator';
import RegisterFormValidator from '../../../services/RegisterForm/RegisterFormValidator';
import Input from '../../reusable/Input.jsx';
import Button from '../../reusable/Button.jsx';
import DepartingBox from '../../reusable/animatedContainers/DepartingBox.jsx'
import LoadingModal from '../../reusable/modals/LoadingModal.jsx';
import UserRegisteredModal from '../../reusable/modals/UserRegisteredModal.jsx';

const Form = () => {
  const [avatars, setAvatars] = useState([]);
  const [email, setEmail] = useState('sadasd@gmail.com');
  const [password, setPassword] = useState('Ab7776dsfsd');
  const [userRegisterWithSuccess, setUserRegisterWithSuccess] = useState(false);
  const fileInput = useRef(null);
  const [registerUser, { data, error, loading }] = useMutation(REGISTER_USER);

  const handleEmailOnChange = e => setEmail(e.target.value)
  const handlePasswordOnChange = e => setPassword(e.target.value)

  const handleFileOnChange = async e => {
    const files = [...e.target.files];
    const avatarsGenerator = new AvatarsGenerator(files)
    const generatedAvatars = await avatarsGenerator.generateAvatars();

    setAvatars(generatedAvatars)
  };
  
  const handleSubmit = e => {
    e.preventDefault();

    const formValidator = new RegisterFormValidator({ password, avatars });
    if (!formValidator.valid()) return null;

    createUser();
    resetFormState();
  }

  const resetFormState = () => {
    setAvatars([]);
    setEmail('');
    setPassword('');
    fileInput.current.value = ""
  };

  const createUser = () => (
    registerUser({
      variables: { input: { email, password, avatars } }
    })
  )

  const userRegisteredWithSuccess = data?.user?.id;

  useEffect(() => {
    if (userRegisteredWithSuccess) setUserRegisterWithSuccess(true);
  }, [userRegisteredWithSuccess])

  return (
    <Fragment>
      <LoadingModal open={loading} info='Rejestrujemy użytkownika' />
      <UserRegisteredModal
        open={userRegisterWithSuccess}
        setUserRegisterWithSuccess={setUserRegisterWithSuccess}
      />
      <form enctype='multipart/form-data' onSubmit={handleSubmit}>
        <DepartingBox order={1}>
          <Input
            type='email'
            placeholder='Email'
            onChange={handleEmailOnChange}
            value={email}
          />
        </DepartingBox>
        <DepartingBox order={2}>
          <Input
            placeholder='Password'
            onChange={handlePasswordOnChange}
            value={password}
          />
        </DepartingBox>
        <DepartingBox order={3}>
          <Input
            type='file'
            onChange={handleFileOnChange}
            inputProps={{ multiple: true }}
            inputRef={fileInput}
          />
        </DepartingBox>
        <Button value='Upload' />
      </form>
    </Fragment>
  )
}

export default Form;
