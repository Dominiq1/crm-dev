import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Link, Stack, IconButton, InputAdornment, TextField, Checkbox } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useMutation } from '@apollo/client';
import { REGISTER_USER } from '../../../mutations/userMutations';
import Iconify from '../../../components/iconify';
import { setAlert } from '../../../redux/slice/alertSlice';

export default function Signupform() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [registerUser] = useMutation(REGISTER_USER);

  const handleClick = async () => {
    try {
      if (email === '' || password === '') return;
      if (password.length < 6) {
        dispatch(setAlert({ type: 'error', message: 'Password must be at least 6 characters' }));
        return;
      }

      const response = await registerUser({
        variables: {
          email,
          password,
        },
      });
      if (response) {
        navigate('/nonverified', { replace: true });
        dispatch(setAlert({ type: 'info', message: 'Please check your email to verify your account' }));
      }
    } catch (error) {
      dispatch(setAlert({ type: 'error', message: error.message }));
    }
  };

  return (
    <>
      <Stack spacing={3}>
        <TextField value={email} onChange={(e) => setEmail(e.target.value)} name="email" label="Email address" />

        <TextField
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          name="password"
          label="Password"
          type={showPassword ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Stack>

      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
        <Checkbox name="remember" label="Remember me" />
        <Link variant="subtitle2" underline="hover">
          Forgot password?
        </Link>
      </Stack>

      <LoadingButton fullWidth size="large" type="submit" variant="contained" onClick={handleClick}>
        Register
      </LoadingButton>
    </>
  );
}
