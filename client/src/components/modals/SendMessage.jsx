import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { useDispatch } from 'react-redux';
import { Box, Button, Grid, TextField, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { CircularProgress } from '@mui/material';
import { setAlert } from '../../redux/slice/alertSlice';
import { SEND_MESSAGE_TO_LEADS } from '../../mutations/sendSms';
import AutoSelect from '../inputs/AutoSelect';

const SendMessage = ({ leadIds, open, close, activeLeads }) => {
  const dispatch = useDispatch();
  const [message, setMessage] = useState('');
  const [date, setDate] = useState(new Date());
  const [phones, setPhones] = useState([]);

  const [sendSMSToLeads, { loading }] = useMutation(SEND_MESSAGE_TO_LEADS);

  // handle email submit
  const handleSubmit = async () => {
    try {
      // filter the phone numbers from active leads
      const filteredPhones = activeLeads?.filter((lead) => phones?.includes(lead.phone));
      let updatedIds = leadIds;
      if (filteredPhones?.length) {
        updatedIds = filteredPhones?.map((lead) => lead.id);
      }
      if (updatedIds?.length) {
        const batchSize = 200;
        const numBatches = Math.ceil(updatedIds.length / batchSize);
        for (let i = 0; i < numBatches; i++) {
          const start = i * batchSize;
          const end = start + batchSize;
          const batch = updatedIds.slice(start, end);
          await sendSMSToLeads({
            variables: {
              leadIds: batch,
              msg: message,
              date,
            },
          });
        }
        dispatch(setAlert({ type: 'success', message: 'Messages sent successfully' }));
      }
    } catch (error) {
      dispatch(setAlert({ type: 'error', message: error.message }));
    } finally {
      close();
    }
  };

  return (
    <Dialog
      open={open}
      maxWidth="sm"
      fullWidth
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle
        id="alert-dialog-title"
        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
      >
        Send Text Message
      </DialogTitle>
      <DialogContent sx={{ overflowY: 'unset' }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <AutoSelect
              title={'Phone Numbers'}
              data={activeLeads?.map((x) => x.phone)}
              defaultValues={activeLeads?.filter((lead) => leadIds?.includes(lead.id))?.map((x) => x.phone)}
              callback={(selectedValue) => {
                setPhones(selectedValue);
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Message"
              rows={6}
              multiline
              variant="outlined"
              fullWidth
              size="small"
              value={message}
              name="message"
              onChange={(e) => setMessage(e.target.value)}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Date"
              type="datetime-local"
              variant="outlined"
              fullWidth
              size="small"
              InputLabelProps={{
                shrink: true,
              }}
              name="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'right', gap: '5px' }}>
        {loading ? (
          <Box display="flex" alignItems="center">
            <span>Sending...</span>
            <Box ml={1}>
              <CircularProgress size={20} thickness={4} />
            </Box>
          </Box>
        ) : (
          <>
            <Button onClick={close} variant="outlined" sx={{ padding: '5px 16px' }}>
              Cancel
            </Button>
            <Button variant="contained" sx={{ padding: '6px 26px', color: '#fff' }} onClick={() => handleSubmit()}>
              Send
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default SendMessage;
