// import * as React from 'react';
import React, { useContext, useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import {
  Grid,
  Container,
  Typography,
  Button,
  Select,
  MenuItem,
  Divider,
  Avatar,
  Alert,
  Snackbar,
  DialogTitle,
} from '@mui/material';
import { Helmet } from 'react-helmet-async';
import { useTheme } from '@mui/system';
import { useMutation, useQuery } from '@apollo/client';
import CategoryGrid from '../inputs/CategoryInput';

// sections
import { GET_LEADS } from '../../queries/leadQueries';
import { NOTES } from '../../queries/noteQueries';
import { GET_CALLS } from '../../queries/callQueries';
import { GET_EALERTS } from '../../queries/eAlertQueries';

import TagBoxView from '../inputs/SearchTagBoxView';
import CategoryBoxView from '../inputs/SearchCategory';
import SnackBar from '../dataGrid/SnackBar';
import CallModal from '../modals/CallModal';
import MessageModal from '../modals/Message';

import EmailActionModal from '../modals/EmalActionModal';
import ChatUI from '../modals/ChatUI';
import Iconify from '../iconify/Iconify';
import CallBox from '../CallBox';
import { callContext } from '../../hooks/useCall';
import { SEND_CALL } from '../../mutations/sendCall';

export default function ProfileP({ rowId }) {
  const { isCall, setIsCall, userName, setUserName, setLeadId, leadId } = useContext(callContext);
  const [usersTags, setUsersTags] = useState(null);
  const [isMessageModal, setIsMessageModal] = useState(false);
  const [usersCategories, setUsersCategories] = useState(null);
  const [open, setOpen] = React.useState(false);

  const [users, setUsers] = useState([]);
  const [lead, setLead] = useState();
  const [selectedLead, setSelectedLead] = useState(null);

  const [arrayCell, setArrayCell] = useState(null);
  const theme = useTheme();

  const { loading: leadsLoading, error: leadsError, data: leadsData } = useQuery(GET_LEADS);
  const [sendCall, { data, loading, error }] = useMutation(SEND_CALL, {
    variables: { toNumber: lead?.phone, msg: 'Call', leadId },
  });


  //  GET CALLS
  const {
    loading: callsLoading,
    error: callsError,
    data: callsData,
  } = useQuery(GET_CALLS, {
    variables: { leadId: selectedLead ? selectedLead.id : null },
    skip: !selectedLead,
  });
//  GET ALERTS
  const {
    loading: ealertsLoading,
    error: ealertsError,
    data: ealertsData,
  } = useQuery(GET_EALERTS, {
    variables: { leadId: selectedLead ? selectedLead.id : null },
    skip: !selectedLead,
  });


  //  GET NOTES
  const {
    loading: notesLoading,
    error: notesError,
    data: notesData,
  } = useQuery(NOTES, {
    variables: { leadId: selectedLead ? selectedLead.id : null },
    skip: !selectedLead,
  });

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  const done = () => {
    console.log('updatedLead');
  };
  useEffect(() => {
    if (leadsData) {
      const { leads } = leadsData;

      setUsers(leads);
      setLead(leads[rowId]);
      setSelectedLead(leads[rowId]);

      // const defaultCategories = lead.categories.map((obj) => {
      //   const { title} = obj;

      //   const Title = title;
      //   const newItem = {
      //     title: Title,
      //   }

      //   return newItem;
      // });

      const defaultCategories = leads[rowId].categories.map((obj) => {
        const { title } = obj;

        const Title = title;

        const item = {
          title: Title,
        };

        return item;
      });

      // setUsersCategories(defaultCategories);

      const defaultTags = leads[rowId].tags.map((obj) => {
        const { title } = obj;

        const Title = title;

        const item = {
          title: Title,
        };

        return item;
      });

      setUsersTags(defaultTags);
      // setUsersCategories(defaultCategories);
    } else {
      setUsers([]);
    }
  }, [selectedLead]);

  useEffect(() => {
    if (lead) {
      setLead((prevLead) => ({ ...prevLead, ...lead }));
    }
  }, []);

  const handleLeadChange = (lead) => {
    setSelectedLead(lead);
  };

  const handleCall = async () => {
    try {
      await sendCall();
    } catch (error) {
      console.log('Error-', error);
    }
  };

  return (
    <>
      <Helmet>
        <title>RE CRM</title>
      </Helmet>
      <Container maxWidth="lg" sx={{ width: '70vw', minHeight: '75vh' }}>
        {isMessageModal ? (
          <ChatUI handleProfile={() => setIsMessageModal(false)} lead={lead} />
        ) : (
          <Grid>
            <DialogTitle>Profile </DialogTitle>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4} lg={3}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <Avatar
                    src="https://static.vecteezy.com/system/resources/previews/002/318/271/original/user-profile-icon-free-vector.jpg"
                    sx={{ width: '8em', height: '8em', mb: 2, borderRadius: '50%' }}
                  />

                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
                    <Button
                      sx={{ borderRadius: '100px' }}
                      onClick={() => {
                        setIsCall(true);
                        setUserName(lead?.firstName || '');
                        setLeadId(lead?.id || '');
                        window.localStorage.setItem('leadId', lead?.id || '');
                        window.localStorage.setItem('isCall', true);
                        window.localStorage.setItem('userName', lead?.firstName || '');
                        handleCall();
                      }}
                    >
                      <Iconify icon="eva:phone-fill" color="#18712" width={22} height={22} />
                    </Button>
                    <Button href="" sx={{ borderRadius: '100px' }} onClick={() => setIsMessageModal(true)}>
                      <Iconify icon="eva:email-fill" color="#18712" width={22} height={22} />
                    </Button>
                  </Box>

                  <Typography variant="h6" fontWeight="bold" mb={1}>
                    {lead ? `${lead.firstName} ${lead.lastName}` : 'none'}
                  </Typography>
                  <Typography variant="body1" fontWeight="bold" wordWrap="break-word" mb={1}>
                    {lead ? lead.phone : 'none'}
                  </Typography>
                  <Typography variant="body1" fontWeight="bold" wordWrap="break-word" mb={2}>
                    {lead ? lead.email : 'none'}
                  </Typography>

                  <Divider />

                  <Box mt={2} sx={{}}>
                    <Typography variant="h6" fontWeight="bold" mb={1}>
                      {arrayCell != null ? arrayCell : null}
                    </Typography>

                    {/* {usersTags ? (
                      <CategoryBoxView defaultValues={usersCategories} Lead={lead} successCheck={handleClick} />
                    ) : null}

                    {usersTags ? <TagBoxView defaultValues={usersTags} Lead={lead} successCheck={handleClick} /> : null} */}
                  </Box>
                </Box>
              </Grid>

              <Grid item xs={12} md={8} lg={9}>
                <Box
                  sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
                >
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="h4" fontWeight="bold" color="primary">
                      Lead
                    </Typography>
                    <Divider />
                    <Box
                      mt={2}
                      sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'left', alignItems: 'center' }}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                          alignItems: 'left',
                          width: '25%',
                          height: '10vh',
                        }}
                      >
                        <Typography variant="h6" fontWeight="bold">
                          Tags
                        </Typography>
                        {/* <Typography variant="body1" mt={1} sx={{ fontWeight: 'bold', color: 'green' }}>
                          {lead ? (
                            <>
                              {lead.tags.map((tag) => (
                                <p key={tag.id}>{tag.title}</p>
                              ))}
                            </>
                          ) : (
                            'none'
                          )}
                        </Typography> */}
                      </Box>

                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                          alignItems: 'left',
                          width: '25%',
                          height: '10vh',
                        }}
                      >
                        <Typography variant="h6" fontWeight="bold" mb={1}>
                          Categories
                        </Typography>
                        {/* <Typography variant="body1" mt={1} sx={{ fontWeight: 'bold', color: 'green' }}>
                          {lead ? (
                            <>
                              {lead.categories.map((tag) => (
                                <p key={tag.id}>{tag.title}</p>
                              ))}
                            </>
                          ) : (
                            'none'
                          )}
                        </Typography> */}
                      </Box>
                    </Box>
                  </Box>
                </Box>

                <Box mt={3}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <Typography variant="h5" fontWeight="bold" mb={2}>
                          Notes
                        </Typography>
                        {notesLoading ? (
                          <Typography variant="body1">Loading Notes...</Typography>
                        ) : notesData && notesData.notes && notesData.notes.length > 0 ? (
                          notesData.notes.map((note) => <SnackBar notes={notesData} type="Notes" />)
                        ) : (
                          <Typography variant="body1">No Notes</Typography>
                        )}
                      </Box>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <Typography variant="h5" fontWeight="bold" mb={2}>
                          Calls
                        </Typography>
                        {callsLoading ? (
                          <Typography variant="body1">Loading Calls...</Typography>
                        ) : callsData ? (
                          <SnackBar calls={callsData} type="Calls" />
                        ) : (
                          <Typography variant="body1">No Calls</Typography>
                        )}
                      </Box>
                    </Grid>

                    <Grid item xs={12}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <Typography variant="h5" fontWeight="bold" mb={2}>
                          E-Alerts
                        </Typography>
                        {ealertsLoading ? (
                          <Typography variant="body1">Loading E-Alerts...</Typography>
                        ) : ealertsData ? (
                          <SnackBar alerts={ealertsData} type="E-Alerts" />
                        ) : (
                          <Typography variant="body1">No E-Alerts</Typography>
                        )}
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              </Grid>
            </Grid>
          </Grid>
        )}
        <Snackbar open={open} autoHideDuration={2000} onClose={handleClose}>
          <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
            Updated Lead!
          </Alert>
        </Snackbar>
      </Container>
    </>
  );
}
