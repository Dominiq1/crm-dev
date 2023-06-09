import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/client';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Typography,
  Avatar,
  styled,
  alpha,
  Button,
  Grid,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Autocomplete,
  Tooltip,
  IconButton,
  Zoom,
  Select,
  MenuItem,
} from '@mui/material';

import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import EditNoteIcon from '@mui/icons-material/EditNote';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import { TimelineConnector, TimelineDot, TimelineSeparator } from '@mui/lab';
import { setAlert } from '../redux/slice/alertSlice';
import account from '../_mock/account';
import Iconify from '../components/iconify';
import styles from '../Styles/Messages.module.css';
import SelectField from '../components/SelectField';
import { GET_LEAD } from '../queries/leadQueries';
import { GET_CALLS, GET_VOICE_CALLS } from '../queries/callQueries';
import { NOTES } from '../queries/noteQueries';
import { GET_SMS_TEXT } from '../queries/textQueries';
import { GET_EALERTS } from '../queries/eAlertQueries';
import { fDateTime } from '../utils/formatTime';
import CustomDialog from '../components/modals/CustomDialog';
import SelectTag from '../components/SelectTag';
import { updateLeadMutation } from '../mutations/leadMutations';
import ChatUI from '../components/modals/ChatUI';
import { SEND_CALL } from '../mutations/sendCall';
import { callContext } from '../hooks/useCall';
import { ADD_TASK } from '../mutations/reminder';
import { SEND_EMAIL } from '../mutations/bulkEmail';
import { TASK_TYPES } from '../queries/reminder';
import { ADD_SINGLE_NOTE } from '../mutations/noteMutations';
import SendEmail from '../components/modals/SendEmail';
import AddLeadModal from '../components/modals/AddLead';
import CategoryInput from '../components/inputs/CategoryInput';
import { GET_CATEGORIES } from '../queries/categoryQueries';

const LeadDetailPage = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const param = useParams();
  const { id } = param;
  const { setIsCall, setUserName, setLeadId } = useContext(callContext);

  const { data: categoriesList, refetch: refetchCategories, loading: loadingCategories } = useQuery(GET_CATEGORIES);

  // call single lead query
  const { data, loading, error } = useQuery(GET_LEAD, {
    variables: { id },
  });
  const { data: calls, loading: callLoading } = useQuery(GET_CALLS, {
    variables: { leadId: id },
  });
  const {
    data: notes,
    loading: noteLoading,
    refetch: refetchNotes,
  } = useQuery(NOTES, {
    variables: { leadId: id },
  });
  const { data: texts, loading: textLoading } = useQuery(GET_SMS_TEXT, {
    variables: { leadId: id },
  });
  const { data: emails, loading: emailLoading } = useQuery(GET_EALERTS, {
    variables: { leadId: id },
  });
  const { data: voiceCalls } = useQuery(GET_VOICE_CALLS, {
    variables: { leadId: id },
  });
  const [updateLead] = useMutation(updateLeadMutation);
  const [sendCall] = useMutation(SEND_CALL);

  // get task types
  const { loading: typeLoading, data: types } = useQuery(TASK_TYPES, {
    variables: { userId: '' },
  });
  const [addTask] = useMutation(ADD_TASK);

  // add single note mutation
  const [addSingleNote] = useMutation(ADD_SINGLE_NOTE);

  const [description, setDescription] = useState('');
  const [open, setOpen] = useState(false);
  const [taskOpen, setTaskOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isMessageModal, setIsMessageModal] = useState(false);
  const [confirmCall, setConfirmCall] = useState(false);
  const [singleNoteModal, setSingleNoteModal] = useState(false);
  const [typeData, setTypeData] = useState([]);
  const [addType, setAddType] = useState(false);
  const [emailOpen, setEmailOpen] = useState(false);
  const [type, setType] = useState('');
  const [formData, setFormData] = useState({
    contactId: '',
    firstName: '',
    lastName: '',
    notes: '',
    buyerAgent: '',
    listingAgent: '',
  });
  const [value, setValue] = useState({
    title: '',
    note: '',
    date: '',
  });

  useEffect(() => {
    if (data?.lead?.description) {
      setDescription(data?.lead?.description);
    }
  }, [data]);

  console.log(data?.lead);

  // set types from api
  useEffect(() => {
    if (types) {
      setTypeData(types.taskTypes.map((task) => task.name));
    }
  }, [types, type]);

  const handleClose = () => {
    setOpen(false);
  };

  const getSelected = (item) => {
    setSelectedItem(item);
    setOpen(true);
  };

  const handleUpdate = async (values, id, type) => {
    const entries = values?.map((x) => x.title);
    if (type === 'categories') {
      await updateLead({
        variables: {
          id,
          categoriesList: entries,
        },
      });
    }
    if (type === 'tags') {
      await updateLead({
        variables: {
          id,
          tagsList: entries,
        },
      });
    }
  };

  const handleCall = async () => {
    try {
      await sendCall({
        variables: { toNumber: data?.lead?.phone, msg: 'Call', leadId: id },
      });
    } catch (error) {
      console.log('Error-', error);
    }
  };

  const handleInputChange = async (event) => {
    const { value } = event.target;
    setDescription(value);
  };

  const handleBlur = async () => {
    await updateLead({
      variables: {
        id,
        description,
      },
    });
  };

  // handle change
  const handleChange = (e) => {
    if (singleNoteModal) {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
      });
    }
    setValue({ ...value, [e.target.name]: e.target.value });
  };

  // handle task submit with leadID
  const handleSubmit = async () => {
    if (singleNoteModal) {
      try {
        await addSingleNote({
          variables: {
            contactId: formData.contactId,
            firstName: formData.firstName,
            lastName: formData.lastName,
            notes: formData.notes,
            buyerAgent: formData.buyerAgent,
            listingAgent: formData.listingAgent,
            leadId: id,
          },
        });
        setFormData({
          contactId: '',
          lastName: '',
          firstName: '',
          notes: '',
          buyerAgent: '',
          listingAgent: '',
          leadId: '',
        });

        dispatch(setAlert({ type: 'success', message: 'Note added successfully' }));
        await refetchNotes();
      } catch (error) {
        dispatch(setAlert({ type: 'error', payload: error.message }));
      } finally {
        setSingleNoteModal(false);
      }
    } else {
      try {
        await addTask({
          variables: {
            title: value.title,
            note: value.note,
            date: value.date,
            type,
            userId: user?.id || '',
            leadId: id,
          },
        });
        setValue({
          title: '',
          note: '',
          date: '',
        });
        setAddType(false);
        setType('');

        dispatch(setAlert({ type: 'success', message: 'Task added successfully' }));
        // await refetch();
      } catch (error) {
        dispatch(setAlert({ type: 'error', payload: error.message }));
      } finally {
        setOpen(false);
      }
    }
  };

  return (
    <Grid sx={{ overflow: 'hidden' }}>
      {isMessageModal && data?.lead && (
        <Dialog
          open={isMessageModal}
          onClose={() => setIsMessageModal(false)}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          maxWidth="lg"
          fullWidth
        >
          <ChatUI handleProfile={() => setIsMessageModal(false)} lead={data?.lead} setConfirmCall={setConfirmCall} />
        </Dialog>
      )}
      {/* Call confirmation dialog */}
      {confirmCall && (
        <Dialog open={confirmCall} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
          <DialogContent sx={{ textAlign: 'center', padding: '18px 25px' }}>
            <ErrorOutlineIcon sx={{ fontSize: 50, color: '#f8bb86' }} />
            <DialogTitle id="alert-dialog-title" style={{ textAlign: 'center', padding: '4px' }}>
              {'Are you sure?'}
            </DialogTitle>
            <DialogContentText id="alert-dialog-description">This will make a call if you press yes.</DialogContentText>
          </DialogContent>
          <DialogActions sx={{ justifyContent: 'center', gap: '12px', padding: '6px 5px 18px 5px' }}>
            <Button onClick={() => setConfirmCall(false)} variant="outlined" sx={{ padding: '6px 16px' }}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                setConfirmCall(false);
                setIsCall(true);
                setUserName(data?.lead?.firstName || '');
                setLeadId(id || '');
                window.localStorage.setItem('leadId', id || '');
                window.localStorage.setItem('isCall', true);
                window.localStorage.setItem('userName', data?.lead?.firstName || '');
                handleCall();
              }}
              autoFocus
              variant="contained"
              sx={{ backgroundColor: '#00bfa5', color: 'white', padding: '6px 10px' }}
            >
              Yes, Call Now
            </Button>
          </DialogActions>
        </Dialog>
      )}

      {/* Add task dialog */}
      {taskOpen && (
        <Dialog open={taskOpen} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
          <DialogTitle
            id="alert-dialog-title"
            sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
          >
            Add Task <EditNoteIcon />
          </DialogTitle>
          <DialogContent sx={{ overflowY: 'unset' }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Title"
                  variant="outlined"
                  fullWidth
                  size="small"
                  name="title"
                  sx={{ zIndex: '9999999' }}
                  value={value.title}
                  onChange={(e) => handleChange(e)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Take a note"
                  rows={4}
                  multiline
                  variant="outlined"
                  fullWidth
                  size="small"
                  name="note"
                  value={value.note}
                  onChange={(e) => handleChange(e)}
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
                  value={value.date}
                  onChange={(e) => handleChange(e)}
                />
              </Grid>
              <Grid item xs={5}>
                {addType ? (
                  <TextField
                    label="Add new type"
                    variant="outlined"
                    fullWidth
                    size="small"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                  />
                ) : (
                  <Autocomplete
                    options={typeData}
                    renderInput={(params) => (
                      <TextField {...params} label="Type" variant="outlined" fullWidth size="small" />
                    )}
                    value={type}
                    onChange={(_, value) => setType(value)}
                  />
                )}
              </Grid>
              <Grid item xs={1}>
                <IconButton aria-label="add-type" onClick={() => setAddType(true)}>
                  <AddCircleOutlineIcon />
                </IconButton>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ justifyContent: 'right', gap: '5px' }}>
            <Button
              onClick={() => {
                setTaskOpen(false);
                setAddType(false);
                setType('');
              }}
              variant="outlined"
              sx={{ padding: '5px 16px' }}
            >
              Cancel
            </Button>
            <Button variant="contained" sx={{ padding: '6px 26px', color: '#fff' }} onClick={() => handleSubmit()}>
              Save
            </Button>
          </DialogActions>
        </Dialog>
      )}

      {/* Add single note dialog */}
      {singleNoteModal && (
        <Dialog open={singleNoteModal} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
          <DialogTitle
            id="alert-dialog-title"
            sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
          >
            Add Single Note <EditNoteIcon />
          </DialogTitle>
          <DialogContent sx={{ overflowY: 'unset' }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Notes"
                  rows={4}
                  multiline
                  variant="outlined"
                  fullWidth
                  size="small"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ justifyContent: 'right', gap: '5px' }}>
            <Button
              onClick={() => {
                setSingleNoteModal(false);
              }}
              variant="outlined"
              sx={{ padding: '5px 16px' }}
            >
              Cancel
            </Button>
            <Button variant="contained" sx={{ padding: '6px 26px', color: '#fff' }} onClick={handleSubmit}>
              Save
            </Button>
          </DialogActions>
        </Dialog>
      )}

      {/* send email dialaog */}
      <SendEmail emailOpen={emailOpen} setEmailOpen={setEmailOpen} id={id} />

      <Grid container margin="24px">
        {/* left columns */}
        <Grid item xs={12} md={4}>
          <Grid container spacing={2}>
            {/* profile */}
            <Grid item xs={12}>
              <StyledAccount>
                <Avatar sx={{ width: '100px', height: '100px' }} src={account.photoURL} alt="photoURL" />
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <Typography variant="h6" sx={{ color: 'text.primary' }}>
                    {data?.lead?.firstName} {data?.lead?.lastName}
                  </Typography>
                  <Typography variant="subtitle1" sx={{ color: 'text.primary' }}>
                    {data?.lead?.email}
                  </Typography>
                  <Typography variant="subtitle1" sx={{ color: 'text.primary' }}>
                    {data?.lead?.phone}
                  </Typography>
                </Box>
                <Box display="flex">
                  <Button
                    href=""
                    className={styles.callButtonV2}
                    onClick={() => {
                      setConfirmCall(true);
                    }}
                  >
                    <Iconify icon="eva:phone-fill" color="#18712" width={24} height={24} />
                  </Button>
                  <Button href="" className={styles.callButtonV2} onClick={() => setIsMessageModal(true)}>
                    <Iconify icon="eva:email-fill" color="#18712" width={24} height={24} />
                  </Button>
                  <Tooltip title="Add Task" arrow TransitionComponent={Zoom}>
                    <Button href="" className={styles.callButtonV2} onClick={() => setTaskOpen(true)}>
                      <AddCircleOutlineIcon />
                    </Button>
                  </Tooltip>
                  <Tooltip title="Send Email" arrow TransitionComponent={Zoom}>
                    <Button href="" className={styles.callButtonV2} onClick={() => setEmailOpen(true)}>
                      <AlternateEmailIcon />
                    </Button>
                  </Tooltip>
                </Box>
              </StyledAccount>
            </Grid>
            {/* Description */}
            <Grid item xs={11.7}>
              <StyledTextArea>
                <textarea
                  // eslint-disable-next-line no-unneeded-ternary
                  value={description}
                  onChange={(e) => handleInputChange(e)}
                  onBlur={() => handleBlur()}
                  style={{
                    width: '100%',
                    height: '100%',
                    border: '1px solid #e3e3e3',
                    resize: 'none',
                    outline: 'none',
                    fontSize: '16px',
                    fontWeight: '600',
                    padding: '10px',
                    backgroundColor: '#edeff1',
                    borderRadius: '9px',
                  }}
                  placeholder="Description.."
                />
              </StyledTextArea>
            </Grid>
            {/* Categories  */}
            <Grid item xs={11.7}>
              <WrapSelectable>
                <Typography fontWeight={'bold'}>Category</Typography>
                {data?.lead?.category && <CategoryInput category={data?.lead?.category} />}
                <Typography>{data?.lead?.category?.description || ''}</Typography>
                {/* <Select labelId="demo-simple-select-label" id="demo-simple-select" value={data?.lead?.category?.id}>
                  {categoriesList &&
                    categoriesList?.categories?.map((category) => {
                      return <MenuItem value={category?.id}>{category?.title || data?.lead?.category?.title}</MenuItem>;
                    })}
                </Select> */}
              </WrapSelectable>
            </Grid>
            {/* Tags */}
            <Grid item xs={11.7}>
              <WrapSelectable>
                <Typography fontWeight={'bold'}>Tags</Typography>
                {(data && data.lead && (
                  <SelectTag
                    data={data?.lead}
                    defaultValues={data?.lead?.tagsList?.map((x) => ({
                      title: x,
                    }))}
                    type={'tags'}
                    handleUpdate={(value, id, type) => handleUpdate(value, id, type)}
                  />
                )) ||
                  ''}
              </WrapSelectable>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} md={7.4} style={{ display: 'flex' }}>
          <StyledInformation>
            <Box flexGrow="1" position="relative">
              {/* update leads modal */}
              <Box position="absolute" right="0">
                <AddLeadModal leadData={data?.lead} title="Update Leads" />
              </Box>

              {/* <Tooltip title="Edit Fields" arrow TransitionComponent={Zoom} sx={{ position: 'absolute', right: '0' }}>
                <Button onClick={() => setEmailOpen(true)}>
                  <EditNoteIcon sx={{ color: 'black' }} />
                </Button>
              </Tooltip> */}

              {data && data.lead && (
                <Box display="flex" flexDirection="column" gap="10px">
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="h6" sx={{ width: '30%' }}>
                      Address:
                    </Typography>
                    <Typography variant="subtitle1" sx={{ width: '65%' }}>
                      {data.lead.Address || '-'}
                    </Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="h6" sx={{ width: '30%' }}>
                      Agent Selected:
                    </Typography>
                    <Typography variant="subtitle1" sx={{ width: '65%' }}>
                      {data.lead.AgentSelected || '-'}
                    </Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="h6" sx={{ width: '30%' }}>
                      Avg Listing Price
                    </Typography>
                    <Typography variant="subtitle1" sx={{ width: '65%' }}>
                      {data.lead.AvgListingPrice || '-'}
                    </Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="h6" sx={{ width: '30%' }}>
                      Birthday
                    </Typography>
                    <Typography variant="subtitle1" sx={{ width: '65%' }}>
                      {data.lead.Birthday || '-'}
                    </Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="h6" sx={{ width: '30%' }}>
                      Buyer Agent
                    </Typography>
                    <Typography variant="subtitle1" sx={{ width: '65%' }}>
                      {data.lead.BuyerAgent || '-'}
                    </Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="h6" sx={{ width: '30%' }}>
                      Buyer Agent Category
                    </Typography>
                    <Typography variant="subtitle1" sx={{ width: '65%' }}>
                      {data.lead.BuyerAgentCategory || '-'}
                    </Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="h6" sx={{ width: '30%' }}>
                      City
                    </Typography>
                    <Typography variant="subtitle1" sx={{ width: '65%' }}>
                      {data.lead.City || '-'}
                    </Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="h6" sx={{ width: '30%' }}>
                      First Visit Date
                    </Typography>
                    <Typography variant="subtitle1" sx={{ width: '65%' }}>
                      {data.lead.FirstVisitDate || '-'}
                    </Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="h6" sx={{ width: '30%' }}>
                      Globally Opted Out Of Alerts
                    </Typography>
                    <Typography variant="subtitle1" sx={{ width: '65%' }}>
                      {data.lead.GloballyOptedOutOfAlerts || '-'}
                    </Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="h6" sx={{ width: '30%' }}>
                      Globally Opted Out Of Buyer Agent Email
                    </Typography>
                    <Typography variant="subtitle1" sx={{ width: '65%' }}>
                      {data.lead.GloballyOptedOutOfBuyerAgentEmail || '-'}
                    </Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="h6" sx={{ width: '30%' }}>
                      Globally Opted Out Of Email
                    </Typography>
                    <Typography variant="subtitle1" sx={{ width: '65%' }}>
                      {data.lead.GloballyOptedOutOfEmail || '-'}
                    </Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="h6" sx={{ width: '30%' }}>
                      Globally Opted Out Of Lender Email
                    </Typography>
                    <Typography variant="subtitle1" sx={{ width: '65%' }}>
                      {data.lead.GloballyOptedOutOfLenderEmail || '-'}
                    </Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="h6" sx={{ width: '30%' }}>
                      Globally Opted Out Of Listing Agent Email
                    </Typography>
                    <Typography variant="subtitle1" sx={{ width: '65%' }}>
                      {data.lead.GloballyOptedOutOfListingAgentEmail || '-'}
                    </Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="h6" sx={{ width: '30%' }}>
                      Home Closing Date
                    </Typography>
                    <Typography variant="subtitle1" sx={{ width: '65%' }}>
                      {data.lead.HomeClosingDate || '-'}
                    </Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="h6" sx={{ width: '30%' }}>
                      Last Agent Call Date
                    </Typography>
                    <Typography variant="subtitle1" sx={{ width: '65%' }}>
                      {data.lead.LastAgentCallDate || '-'}
                    </Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="h6" sx={{ width: '30%' }}>
                      Last Agent Note
                    </Typography>
                    <Typography variant="subtitle1" sx={{ width: '65%' }}>
                      {data.lead.LastAgentNote || '-'}
                    </Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="h6" sx={{ width: '30%' }}>
                      Last Lender Call Date
                    </Typography>
                    <Typography variant="subtitle1" sx={{ width: '65%' }}>
                      {data.lead.LastLenderCallDate || '-'}
                    </Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="h6" sx={{ width: '30%' }}>
                      Last Visit Date
                    </Typography>
                    <Typography variant="subtitle1" sx={{ width: '65%' }}>
                      {data.lead.LastVisitDate || '-'}
                    </Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="h6" sx={{ width: '30%' }}>
                      Lead Type
                    </Typography>
                    <Typography variant="subtitle1" sx={{ width: '65%' }}>
                      {data.lead.LeadType || '-'}
                    </Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="h6" sx={{ width: '30%' }}>
                      Lender
                    </Typography>
                    <Typography variant="subtitle1" sx={{ width: '65%' }}>
                      {data.lead.Lender || '-'}
                    </Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="h6" sx={{ width: '30%' }}>
                      Lender Category
                    </Typography>
                    <Typography variant="subtitle1" sx={{ width: '65%' }}>
                      {data.lead.LenderCategory || '-'}
                    </Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="h6" sx={{ width: '30%' }}>
                      Lender OptIn
                    </Typography>
                    <Typography variant="subtitle1" sx={{ width: '65%' }}>
                      {data.lead.LenderOptIn || '-'}
                    </Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="h6" sx={{ width: '30%' }}>
                      Link
                    </Typography>
                    <Typography variant="subtitle1" sx={{ width: '65%' }}>
                      {data.lead.Link || '-'}
                    </Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="h6" sx={{ width: '30%' }}>
                      Listing Agent
                    </Typography>
                    <Typography variant="subtitle1" sx={{ width: '65%' }}>
                      {data.lead.ListingAgent || '-'}
                    </Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="h6" sx={{ width: '30%' }}>
                      Listing Agent Category
                    </Typography>
                    <Typography variant="subtitle1" sx={{ width: '65%' }}>
                      {data.lead.ListingAgentCategory || '-'}
                    </Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="h6" sx={{ width: '30%' }}>
                      Next Call Due
                    </Typography>
                    <Typography variant="subtitle1" sx={{ width: '65%' }}>
                      {data.lead.NextCallDue || '-'}
                    </Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="h6" sx={{ width: '30%' }}>
                      Opt In Date
                    </Typography>
                    <Typography variant="subtitle1" sx={{ width: '65%' }}>
                      {data.lead.OptInDate || '-'}
                    </Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="h6" sx={{ width: '30%' }}>
                      Original Campaign
                    </Typography>
                    <Typography variant="subtitle1" sx={{ width: '65%' }}>
                      {data.lead.OriginalCampaign || '-'}
                    </Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="h6" sx={{ width: '30%' }}>
                      Original Source
                    </Typography>
                    <Typography variant="subtitle1" sx={{ width: '65%' }}>
                      {data.lead.OriginalSource || '-'}
                    </Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="h6" sx={{ width: '30%' }}>
                      Register Date
                    </Typography>
                    <Typography variant="subtitle1" sx={{ width: '65%' }}>
                      {data.lead.RegisterDate || '-'}
                    </Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="h6" sx={{ width: '30%' }}>
                      State
                    </Typography>
                    <Typography variant="subtitle1" sx={{ width: '65%' }}>
                      {data.lead.State || '-'}
                    </Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="h6" sx={{ width: '30%' }}>
                      Visit Total
                    </Typography>
                    <Typography variant="subtitle1" sx={{ width: '65%' }}>
                      {data.lead.VisitTotal || '-'}
                    </Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="h6" sx={{ width: '30%' }}>
                      Zip Code
                    </Typography>
                    <Typography variant="subtitle1" sx={{ width: '65%' }}>
                      {data.lead.ZipCode || '-'}
                    </Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="h6" sx={{ width: '30%' }}>
                      E Alerts
                    </Typography>
                    <Typography variant="subtitle1" sx={{ width: '65%' }}>
                      {data.lead.eAlerts || '-'}
                    </Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="h6" sx={{ width: '30%' }}>
                      Email Invalid
                    </Typography>
                    <Typography variant="subtitle1" sx={{ width: '65%' }}>
                      {data.lead.emailInvalid || '-'}
                    </Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="h6" sx={{ width: '30%' }}>
                      Listing View Count
                    </Typography>
                    <Typography variant="subtitle1" sx={{ width: '65%' }}>
                      {data.lead.listingviewcount || '-'}
                    </Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="h6" sx={{ width: '30%' }}>
                      Phone
                    </Typography>
                    <Typography variant="subtitle1" sx={{ width: '65%' }}>
                      {data.lead.phone || '-'}
                    </Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="h6" sx={{ width: '30%' }}>
                      Phone Status
                    </Typography>
                    <Typography variant="subtitle1" sx={{ width: '65%' }}>
                      {data.lead.phoneStatus || '-'}
                    </Typography>
                  </Box>
                  <Box display="flex">
                    <Typography variant="h6" sx={{ width: '30%' }}>
                      Updated At
                    </Typography>
                    <Typography variant="subtitle1" sx={{ width: '70%' }}>
                      {data.lead.updatedAt || '-'}
                    </Typography>
                  </Box>
                </Box>
              )}
            </Box>
          </StyledInformation>
        </Grid>
        <Grid container spacing={2} marginTop={'24px'} />
      </Grid>
      <Grid container>
        <Grid xs={12}>
          <Grid container spacing={2} columnGap={2} margin="42px">
            <Grid
              item
              xs={6}
              md={4}
              lg={2.7}
              sx={{
                boxShadow: '0 0 12px #e3e3e3',
                borderRadius: '12px',
                border: '1px solid #e3e3e3',
                padding: '16px',
                maxHeight: '500px',
                overflowY: 'scroll',
              }}
            >
              <Typography variant="h5" sx={{ color: 'text.primary', marginBottom: '10px' }}>
                Calls
              </Typography>
              {(calls &&
                calls?.calls?.length &&
                calls?.calls?.map((call) => <Card data={call} getItem={(item) => getSelected(item)} type="call" />)) ||
                'Call history is empty'}
            </Grid>
            <Grid
              item
              xs={6}
              md={4}
              lg={2.6}
              sx={{
                boxShadow: '0 0 12px #e3e3e3',
                borderRadius: '12px',
                padding: '16px',
                maxHeight: '500px',
                overflowY: 'scroll',
                border: '1px solid #e3e3e3',
              }}
            >
              <Typography variant="h5" sx={{ color: 'text.primary', marginBottom: '10px' }}>
                Email
              </Typography>
              {(emails &&
                emails?.ealerts?.length &&
                emails?.ealerts?.map((email) => (
                  <Card data={email} getItem={(item) => getSelected(item)} type="email" />
                ))) ||
                'Email history is empty'}
            </Grid>
            <Grid
              item
              xs={6}
              md={4}
              lg={2.6}
              sx={{
                boxShadow: '0 0 12px #e3e3e3',
                borderRadius: '12px',
                padding: '16px',
                maxHeight: '500px',
                overflowY: 'scroll',
                border: '1px solid #e3e3e3',
              }}
            >
              <Typography variant="h5" sx={{ color: 'text.primary', marginBottom: '10px' }}>
                Texts
              </Typography>
              {(texts &&
                texts.texts.length &&
                texts?.texts.map((text) => <Card data={text} getItem={(item) => getSelected(item)} type="text" />)) ||
                'Text history is empty'}
            </Grid>

            <Grid
              item
              xs={6}
              md={4}
              lg={2.6}
              sx={{
                boxShadow: '0 0 12px #e3e3e3',
                borderRadius: '12px',
                padding: '16px',
                maxHeight: '500px',
                overflowY: 'scroll',
                border: '1px solid #e3e3e3',
              }}
            >
              <Typography
                variant="h5"
                sx={{
                  color: 'text.primary',
                  marginBottom: '10px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                Notes{' '}
                <IconButton aria-label="add-note" onClick={() => setSingleNoteModal(true)}>
                  <AddCircleOutlineIcon />
                </IconButton>
              </Typography>
              {(notes &&
                notes.notes.length &&
                notes?.notes.map((note) => (
                  <Card
                    data={note}
                    leadName={`${data?.lead?.firstName} ${data?.lead?.lastName}`}
                    getItem={(item) => getSelected(item)}
                    type="note"
                  />
                ))) ||
                'Note history is empty'}
            </Grid>
            <Grid
              item
              xs={6}
              md={4}
              lg={2.7}
              sx={{
                marginTop: '2rem',
                boxShadow: '0 0 12px #e3e3e3',
                borderRadius: '12px',
                border: '1px solid #e3e3e3',
                padding: '16px',
                maxHeight: '500px',
                overflowY: 'scroll',
              }}
            >
              <Typography variant="h5" sx={{ color: 'text.primary', marginBottom: '10px' }}>
                Call Logs
              </Typography>
              {(voiceCalls &&
                voiceCalls?.voiceCallList?.length &&
                voiceCalls?.voiceCallList?.map((call) => (
                  <Card data={call} getItem={(item) => getSelected(item)} type="call" />
                ))) ||
                'Call log is empty'}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      {selectedItem && <CustomDialog open={open} onClose={handleClose} details={selectedItem} />}
    </Grid>
  );
};

export default LeadDetailPage;

const Card = ({ data, getItem, type, leadName }) => {
  return (
    <Box
      sx={{ boxShadow: '0px 0px 10px #e3e3e3', marginTop: '16px', padding: '16px', cursor: 'pointer' }}
      onClick={() => getItem(data)}
    >
      <Box sx={{ display: 'flex', gap: '8px' }}>
        <TimelineSeparator>
          <TimelineDot
            sx={{ margin: '6px 0' }}
            color={
              // disable eslint
              // eslint-disable-next-line no-nested-ternary
              type === 'note'
                ? 'primary'
                : type === 'call'
                ? 'success'
                : type === 'email'
                ? 'info'
                : type === 'text'
                ? 'secondary'
                : ''
            }
          />
          <TimelineConnector />
        </TimelineSeparator>
        <Box>
          <Typography variant="subtitle2">{data?.FirstName || leadName}</Typography>
          <Box display="flex" flexDirection="column">
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              {/* {data?.note || data?.message || data?.text || data?.description} */}
              {data?.body && data.body.length > 40 ? data.body.slice(0, 40) + '...' : data.body}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              {/* {data?.note || data?.message || data?.text || data?.description} */}
              {data?.createdAt && data.createdAt}
            </Typography>
            <Typography>
              {data?.type == 'outgoing' ? (
                <span style={{ color: 'blue', fontSize: '12px', fontWeight: '500' }}>Outgoing</span>
              ) : (
                <span style={{ color: 'green', fontSize: '12px', fontWeight: '500' }}>Incoming</span>
              )}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

const StyledAccount = styled('div')(({ theme }) => ({
  marginLeft: theme.spacing(2),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'space-between',
  border: '1px solid #e3e3e3',
  gap: theme.spacing(1.5),
  padding: theme.spacing(2, 2.5),
  borderRadius: Number(theme.shape.borderRadius) * 1.5,
  backgroundColor: alpha(theme.palette.grey[500], 0.12),
}));
const StyledTextArea = styled('div')(({ theme }) => ({
  marginLeft: theme.spacing(2),
  width: '100%',
  height: '150px',
  borderRadius: Number(theme.shape.borderRadius) * 1.5,
  backgroundColor: alpha(theme.palette.grey[500], 0.12),
}));

const StyledInformation = styled('div')(({ theme }) => ({
  marginLeft: theme.spacing(2),
  display: 'flex',
  flexGrow: '1',
  maxHeight: '770px',
  overflowY: 'scroll',
  gap: theme.spacing(1.5),
  padding: theme.spacing(2, 2.5),
  borderRadius: Number(theme.shape.borderRadius) * 1.5,
  backgroundColor: alpha(theme.palette.grey[500], 0.12),
}));

const WrapSelectable = styled('div')(({ theme }) => ({
  marginLeft: theme.spacing(2),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  // justifyContent: 'space-between',
  border: '1px solid #e3e3e3',
  gap: theme.spacing(1.5),
  padding: theme.spacing(2, 2.5),
  width: '100%',
  height: '150px',
  borderRadius: Number(theme.shape.borderRadius) * 1.5,
  backgroundColor: alpha(theme.palette.grey[500], 0.12),
}));
