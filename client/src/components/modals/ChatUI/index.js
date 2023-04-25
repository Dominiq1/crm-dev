import { useMutation } from '@apollo/client';
import React, { useContext, useState } from 'react';
import { Box, FormControl, Grid, OutlinedInput, Paper, Typography, Button } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import SendIcon from '@mui/icons-material/Send';
import { styled } from '@mui/material/styles';
import { display } from '@mui/system';
import Iconify from '../../iconify';
import { callContext } from '../../../hooks/useCall';
import { SEND_SMS } from '../../../mutations/sendSms';

const Item = styled(Paper)(({ theme }) => ({
  display: 'none',
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));
const Header = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fafafa',
  ...theme.typography.body1,
  padding: theme.spacing(1),
  color: theme.palette.text.primary,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
}));
const Sender = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#ccf1fabf',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'left',
  color: theme.palette.text.secondary,
  maxWidth: '270px',
  minHeight: '50px',
  display: 'flex',
  alignItems: 'center',
  marginTop: 20,
}));
const Receiver = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#ccf6c4ba',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'left',
  color: theme.palette.text.secondary,
  marginTop: 20,
  maxWidth: '270px',
  minHeight: '50px',
}));

const ChatUI = ({ handleProfile, lead }) => {
  // console.log('lead-----------', lead);
  const [message, setMessage] = useState('');
  const { setIsCall, setUserName } = useContext(callContext);
  const autoGrow = (element) => {
    element.style.height = '5px';
    element.style.height = `${element.scrollHeight}px`;
  };

  const [sendSMS, { data, loading, error }] = useMutation(SEND_SMS, {
    variables: { toNumber: '9099945730', msg: message, leadId: lead?.id },
  });

  const handleSendSMS = async () => {
    try {
      await sendSMS();
      setMessage('');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Grid container spacing={3} padding={4} minHeight={'75vh'} alignItems="center" justifyContent={'center'}>
      <Grid xs={12} sx={{ backgroundColor: '#f5f7f2', height: '100%' }} padding={2} borderRadius={1.5}>
        <Header>
          <Box
            sx={{
              backgroundColor: 'transparent',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'flex-end',
              gap: '6px',
            }}
            onClick={() => handleProfile()}
          >
            <Iconify icon="mdi:user" color="#18712" width={42} height={42} />
            <Typography fontSize={18} fontWeight={700}>
              {lead?.firstName || '-'}
            </Typography>
          </Box>
          <Button
            sx={{ borderRadius: '100px' }}
            onClick={() => {
              setIsCall(true);
              setUserName(lead?.firstName || '');
              window.localStorage.setItem('isCall', true);
              window.localStorage.setItem('userName', lead?.firstName || '');
            }}
          >
            <Iconify icon="eva:phone-fill" color="#18712" width={22} height={22} />
          </Button>
        </Header>
        <Grid
          style={{ backgroundColor: '#fafafa', overflowY: 'scroll', height: '45vh' }}
          marginTop={3}
          padding={2}
          borderRadius={1.5}
        >
          <Grid xs={12} container flexDirection={{ xs: 'column', sm: 'row' }} justifyContent={'flex-end'}>
            <Sender>Hurry! I've passed my driving test!</Sender>
          </Grid>
          <Receiver>Just one? Having seen your driving, I wouldn't be so optimistic.</Receiver>
          <Receiver>What can be better than hearing someone say "I love you"?</Receiver>
          <Grid xs={12} container flexDirection={{ xs: 'column', sm: 'row' }} justifyContent={'flex-end'}>
            <Sender>Hearing a bank machine go "brr" as it deals out the cash</Sender>
          </Grid>
          <Receiver>I have something cool for you.</Receiver>
          <Grid xs={12} container flexDirection={{ xs: 'column', sm: 'row' }} justifyContent={'flex-end'}>
            {data && <Sender>{data?.sendSMS?.body}</Sender>}
          </Grid>
        </Grid>
        <Grid marginTop={3}>
          <textarea
            style={{
              width: '100%',
              borderRadius: '12px',
              border: 'none',
              padding: '12px',
              boxShadow: '0 0 4px #ccf1fabf',
              resize: 'none',
              minHeight: '100px',
              maxHeight: '150px',
              outline: 'none',
            }}
            onInput={autoGrow}
            autoComplete={false}
            placeholder="Write a Message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <Grid display={'flex'} justifyContent={'flex-end'} width={'100%'}>
            <LoadingButton
              size="medium"
              onClick={handleSendSMS}
              endIcon={<SendIcon />}
              loading={loading}
              loadingPosition="end"
              variant="contained"
            >
              <span>Send</span>
            </LoadingButton>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default ChatUI;
