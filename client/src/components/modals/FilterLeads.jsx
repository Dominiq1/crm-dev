import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Autocomplete,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useQuery } from '@apollo/client';
import { GET_LEADS_VALUES } from '../../queries/leadQueries';

const FilterLeads = ({ filterLeadModal, setFilterLeadModal, list, callback }) => {
  const [label, setLable] = useState('FirstName');
  const [fieldValue, setFieldValue] = useState('firstName');
  const [filterValue, setFilterValue] = useState('');
  const [options, setOptions] = useState([]);

  // const { data, loading } = useQuery(GET_LEADS_VALUES, {
  //   variables: {
  //     label: filterValue,
  //     value: '',
  //   },
  // });

  useEffect(() => {
    if (list && fieldValue) {
      const options = list?.leads?.rows?.map((lead) => lead[fieldValue]);
      setOptions(options);
    }
  }, [list, fieldValue]);

  const handleFilter = ({ label, value }) => {
    setLable(label);
    setFieldValue(value);
  };

  const handleOnChange = (e, value) => {
    callback({ label: fieldValue, value });
  };

  return (
    <Dialog
      open={filterLeadModal}
      maxWidth="md"
      fullWidth
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      sx={{ overflow: 'hidden' }}
    >
      <DialogTitle
        id="alert-dialog-title"
        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
      >
        Advanced Lead Filters{' '}
        <Button sx={{ color: 'gray' }} onClick={() => setFilterLeadModal(false)}>
          <CloseIcon />
        </Button>
      </DialogTitle>
      <DialogContent sx={{ overflowY: 'hidden' }}>
        {/* <Box
          display="flex"
          alignItems="center"
          gap="4px"
          flexWrap="wrap"
          sx={{ borderTop: '1px solid #DADEE3', borderBottom: '1px solid #DADEE3', padding: '5px' }}
        >
          <Button sx={{ backgroundColor: '#fafafa', color: 'gray' }}>
            eAlerts <CloseIcon sx={{ height: '12px' }} />
          </Button>
        </Box> */}
        <Box display="flex" sx={{ borderBottom: '1px solid #DADEE3' }}>
          {/* sidebar */}
          <Box
            sx={{
              padding: '8px',
              maxHeight: '300px',
              overflowY: 'scroll',
              position: 'relative',
              flex: '.3',
              borderRight: '1px solid #DADEE3',
            }}
          >
            <Box display="flex" flexDirection="column" gap="15px">
              <Button
                sx={{ fontWeight: '500', borderRadius: '0', justifyContent: 'start', padding: '1px', color: 'gray' }}
                onClick={() =>
                  handleFilter({
                    label: 'First Name',
                    value: 'firstName',
                  })
                }
              >
                First Name
              </Button>
              <Button
                sx={{ fontWeight: '500', borderRadius: '0', justifyContent: 'start', padding: '0', color: 'gray' }}
                onClick={() =>
                  handleFilter({
                    label: 'Last Name',
                    value: 'lastName',
                  })
                }
              >
                Last Name
              </Button>
              <Button
                sx={{ fontWeight: '500', borderRadius: '0', justifyContent: 'start', padding: '0', color: 'gray' }}
                onClick={() =>
                  handleFilter({
                    label: 'Email',
                    value: 'email',
                  })
                }
              >
                Email
              </Button>
              <Button
                sx={{ fontWeight: '500', borderRadius: '0', justifyContent: 'start', padding: '0', color: 'gray' }}
                onClick={() =>
                  handleFilter({
                    label: 'Address',
                    value: 'Address',
                  })
                }
              >
                Address
              </Button>
              <Button
                sx={{ fontWeight: '500', borderRadius: '0', justifyContent: 'start', padding: '0', color: 'gray' }}
                onClick={() =>
                  handleFilter({
                    label: 'Agent Selected',
                    value: 'AgentSelected',
                  })
                }
              >
                Agent Selected
              </Button>
              <Button
                sx={{ fontWeight: '500', borderRadius: '0', justifyContent: 'start', padding: '0', color: 'gray' }}
                onClick={() =>
                  handleFilter({
                    label: 'Avg Listing Price',
                    value: 'AvgListingPrice',
                  })
                }
              >
                Avg Listing Price
              </Button>
              <Button
                sx={{ fontWeight: '500', borderRadius: '0', justifyContent: 'start', padding: '0', color: 'gray' }}
                onClick={() =>
                  handleFilter({
                    label: 'Birthday',
                    value: 'Birthday',
                  })
                }
              >
                Birthday
              </Button>
              <Button
                sx={{ fontWeight: '500', borderRadius: '0', justifyContent: 'start', padding: '0', color: 'gray' }}
                onClick={() =>
                  handleFilter({
                    label: 'Buyer Agent',
                    value: 'BuyerAgent',
                  })
                }
              >
                Buyer Agent
              </Button>
              <Button
                sx={{ fontWeight: '500', borderRadius: '0', justifyContent: 'start', padding: '0', color: 'gray' }}
                onClick={() =>
                  handleFilter({
                    label: 'Buyer Agent Category',
                    value: 'BuyerAgentCategory',
                  })
                }
              >
                Buyer Agent Category
              </Button>
              <Button
                sx={{ fontWeight: '500', borderRadius: '0', justifyContent: 'start', padding: '0', color: 'gray' }}
                onClick={() =>
                  handleFilter({
                    label: 'City',
                    value: 'City',
                  })
                }
              >
                City
              </Button>
              <Button
                sx={{ fontWeight: '500', borderRadius: '0', justifyContent: 'start', padding: '0', color: 'gray' }}
                onClick={() =>
                  handleFilter({
                    label: 'First Visit Date',
                    value: 'FirstVisitDate',
                  })
                }
              >
                First Visit Date
              </Button>
              <Button
                sx={{ fontWeight: '500', borderRadius: '0', justifyContent: 'start', padding: '0', color: 'gray' }}
                onClick={() =>
                  handleFilter({
                    label: 'Globally Opted Out Of Alerts',
                    value: 'GloballyOptedOutOfAlerts',
                  })
                }
              >
                Globally Opted Out Of Alerts
              </Button>
              <Button
                sx={{ fontWeight: '500', borderRadius: '0', justifyContent: 'start', padding: '0', color: 'gray' }}
                onClick={() =>
                  handleFilter({
                    label: 'Globally Opted Out Of Buyer Agent Email',
                    value: 'GloballyOptedOutOfBuyerAgentEmail',
                  })
                }
              >
                Globally Opted Out Of Buyer Agent Email
              </Button>
              <Button
                sx={{ fontWeight: '500', borderRadius: '0', justifyContent: 'start', padding: '0', color: 'gray' }}
                onClick={() =>
                  handleFilter({
                    label: 'Globally Opted Out Of Email',
                    value: 'GloballyOptedOutOfEmail',
                  })
                }
              >
                Globally Opted Out Of Email
              </Button>
              <Button
                sx={{ fontWeight: '500', borderRadius: '0', justifyContent: 'start', padding: '0', color: 'gray' }}
                onClick={() =>
                  handleFilter({
                    label: 'Globally Opted Out Of Lender Email',
                    value: 'GloballyOptedOutOfLenderEmail',
                  })
                }
              >
                Globally Opted Out Of Lender Email
              </Button>
              <Button
                sx={{ fontWeight: '500', borderRadius: '0', justifyContent: 'start', padding: '0', color: 'gray' }}
                onClick={() =>
                  handleFilter({
                    label: 'Globally Opted Out Of Listing Agent Email',
                    value: 'GloballyOptedOutOfListingAgentEmail',
                  })
                }
              >
                Globally Opted Out Of Listing Agent Email
              </Button>
              <Button
                sx={{ fontWeight: '500', borderRadius: '0', justifyContent: 'start', padding: '0', color: 'gray' }}
                onClick={() =>
                  handleFilter({
                    label: 'Home Closing Date',
                    value: 'HomeClosingDate',
                  })
                }
              >
                Home Closing Date
              </Button>
              <Button
                sx={{ fontWeight: '500', borderRadius: '0', justifyContent: 'start', padding: '0', color: 'gray' }}
                onClick={() =>
                  handleFilter({
                    label: 'Last Agent Call Date',
                    value: 'LastAgentCallDate',
                  })
                }
              >
                Last Agent Call Date
              </Button>
              <Button
                sx={{ fontWeight: '500', borderRadius: '0', justifyContent: 'start', padding: '0', color: 'gray' }}
                onClick={() =>
                  handleFilter({
                    label: 'Last Agent Note',
                    value: 'LastAgentNote',
                  })
                }
              >
                Last Agent Note
              </Button>
              <Button
                sx={{ fontWeight: '500', borderRadius: '0', justifyContent: 'start', padding: '0', color: 'gray' }}
                onClick={() =>
                  handleFilter({
                    label: 'Last Lender Call Date',
                    value: 'LastLenderCallDate',
                  })
                }
              >
                Last Lender Call Date
              </Button>
              <Button
                sx={{ fontWeight: '500', borderRadius: '0', justifyContent: 'start', padding: '0', color: 'gray' }}
                onClick={() =>
                  handleFilter({
                    label: 'Last Visit Date',
                    value: 'LastVisitDate',
                  })
                }
              >
                Last Visit Date
              </Button>
              <Button
                sx={{ fontWeight: '500', borderRadius: '0', justifyContent: 'start', padding: '0', color: 'gray' }}
                onClick={() =>
                  handleFilter({
                    label: 'Lead Type',
                    value: 'LeadType',
                  })
                }
              >
                Lead Type
              </Button>
              <Button
                sx={{ fontWeight: '500', borderRadius: '0', justifyContent: 'start', padding: '0', color: 'gray' }}
                onClick={() =>
                  handleFilter({
                    label: 'Lender',
                    value: 'Lender',
                  })
                }
              >
                Lender
              </Button>
              <Button
                sx={{ fontWeight: '500', borderRadius: '0', justifyContent: 'start', padding: '0', color: 'gray' }}
                onClick={() =>
                  handleFilter({
                    label: 'Lender Category',
                    value: 'LenderCategory',
                  })
                }
              >
                Lender Category
              </Button>
              <Button
                sx={{ fontWeight: '500', borderRadius: '0', justifyContent: 'start', padding: '0', color: 'gray' }}
                onClick={() =>
                  handleFilter({
                    label: 'Lender Opt In',
                    value: 'LenderOptIn',
                  })
                }
              >
                Lender Opt In
              </Button>
              <Button
                sx={{ fontWeight: '500', borderRadius: '0', justifyContent: 'start', padding: '0', color: 'gray' }}
                onClick={() =>
                  handleFilter({
                    label: 'Link',
                    value: 'Link',
                  })
                }
              >
                Link
              </Button>
              <Button
                sx={{ fontWeight: '500', borderRadius: '0', justifyContent: 'start', padding: '0', color: 'gray,' }}
                onClick={() =>
                  handleFilter({
                    label: 'Listing Agent',
                    value: 'ListingAgent',
                  })
                }
              >
                Listing Agent
              </Button>
              <Button
                sx={{ fontWeight: '500', borderRadius: '0', justifyContent: 'start', padding: '0', color: 'gray,' }}
                onClick={() =>
                  handleFilter({
                    label: 'Listing Agent Category',
                    value: 'ListingAgentCategory',
                  })
                }
              >
                Listing Agent Category
              </Button>
              <Button
                sx={{ fontWeight: '500', borderRadius: '0', justifyContent: 'start', padding: '0', color: 'gray,' }}
                onClick={() =>
                  handleFilter({
                    label: 'Next Call Due',
                    value: 'NextCallDue',
                  })
                }
              >
                Next Call Due
              </Button>
              <Button
                sx={{ fontWeight: '500', borderRadius: '0', justifyContent: 'start', padding: '0', color: 'gray,' }}
                onClick={() =>
                  handleFilter({
                    label: 'Opt In Date',
                    value: 'OptInDate',
                  })
                }
              >
                Opt In Date
              </Button>
              <Button
                sx={{ fontWeight: '500', borderRadius: '0', justifyContent: 'start', padding: '0', color: 'gray,' }}
                onClick={() =>
                  handleFilter({
                    label: 'Original Campaign',
                    value: 'OriginalCampaign',
                  })
                }
              >
                Original Campaign
              </Button>
              <Button
                sx={{ fontWeight: '500', borderRadius: '0', justifyContent: 'start', padding: '0', color: 'gray,' }}
                onClick={() =>
                  handleFilter({
                    label: 'Original Source',
                    value: 'OriginalSource',
                  })
                }
              >
                Original Source
              </Button>
              <Button
                sx={{ fontWeight: '500', borderRadius: '0', justifyContent: 'start', padding: '0', color: 'gray,' }}
                onClick={() =>
                  handleFilter({
                    label: 'Register Date',
                    value: 'RegisterDate',
                  })
                }
              >
                Register Date
              </Button>
              <Button
                sx={{ fontWeight: '500', borderRadius: '0', justifyContent: 'start', padding: '0', color: 'gray,' }}
                onClick={() =>
                  handleFilter({
                    label: 'State',
                    value: 'State',
                  })
                }
              >
                State
              </Button>
              <Button
                sx={{ fontWeight: '500', borderRadius: '0', justifyContent: 'start', padding: '0', color: 'gray,' }}
                onClick={() =>
                  handleFilter({
                    label: 'Visit Total',
                    value: 'VisitTotal',
                  })
                }
              >
                Visit Total
              </Button>
              <Button
                sx={{ fontWeight: '500', borderRadius: '0', justifyContent: 'start', padding: '0', color: 'gray,' }}
                onClick={() =>
                  handleFilter({
                    label: 'Zip Code',
                    value: 'ZipCode',
                  })
                }
              >
                ZipCode
              </Button>
              <Button
                sx={{ fontWeight: '500', borderRadius: '0', justifyContent: 'start', padding: '0', color: 'gray,' }}
                onClick={() =>
                  handleFilter({
                    label: 'Description',
                    value: 'description',
                  })
                }
              >
                Description
              </Button>
              <Button
                sx={{ fontWeight: '500', borderRadius: '0', justifyContent: 'start', padding: '0', color: 'gray,' }}
                onClick={() =>
                  handleFilter({
                    label: 'eAlerts',
                    value: 'eAlerts',
                  })
                }
              >
                E Alerts
              </Button>
              <Button
                sx={{ fontWeight: '500', borderRadius: '0', justifyContent: 'start', padding: '0', color: 'gray,' }}
                onClick={() =>
                  handleFilter({
                    label: 'Email Invalid',
                    value: 'emailInvalid',
                  })
                }
              >
                Email Invalid
              </Button>
              <Button
                sx={{ fontWeight: '500', borderRadius: '0', justifyContent: 'start', padding: '0', color: 'gray,' }}
                onClick={() =>
                  handleFilter({
                    label: 'Listing View Count',
                    value: 'listingviewcount',
                  })
                }
              >
                Listing View Count
              </Button>
              <Button
                sx={{ fontWeight: '500', borderRadius: '0', justifyContent: 'start', padding: '0', color: 'gray,' }}
                onClick={() =>
                  handleFilter({
                    label: 'Phone',
                    value: 'phone',
                  })
                }
              >
                Phone
              </Button>
              <Button
                sx={{ fontWeight: '500', borderRadius: '0', justifyContent: 'start', padding: '0', color: 'gray,' }}
                onClick={() =>
                  handleFilter({
                    label: 'Phone Status',
                    value: 'phoneStatus',
                  })
                }
              >
                Phone Status
              </Button>
              <Button
                sx={{ fontWeight: '500', borderRadius: '0', justifyContent: 'start', padding: '0', color: 'gray,' }}
                onClick={() =>
                  handleFilter({
                    label: 'Did Leave Review',
                    value: 'didLeaveReviews',
                  })
                }
              >
                Did Leave Review
              </Button>
              <Button
                sx={{ fontWeight: '500', borderRadius: '0', justifyContent: 'start', padding: '0', color: 'gray,' }}
                onClick={() =>
                  handleFilter({
                    label: 'Did Closing Gift',
                    value: 'didClosingGift',
                  })
                }
              >
                Did Closing Gift
              </Button>
              <Button
                sx={{ fontWeight: '500', borderRadius: '0', justifyContent: 'start', padding: '0', color: 'gray,' }}
                onClick={() =>
                  handleFilter({
                    label: 'Did Social Media Friends',
                    value: 'didsocialMediaFriends',
                  })
                }
              >
                Did Social Media Friends
              </Button>
              <Button
                sx={{ fontWeight: '500', borderRadius: '0', justifyContent: 'start', padding: '0', color: 'gray,' }}
                onClick={() =>
                  handleFilter({
                    label: 'Did Post Card Drip',
                    value: 'didPostCardDrip',
                  })
                }
              >
                Did Post Card Drip
              </Button>
              <Button
                sx={{ fontWeight: '500', borderRadius: '0', justifyContent: 'start', padding: '0', color: 'gray,' }}
                onClick={() =>
                  handleFilter({
                    label: 'Did Anniversary Drip',
                    value: 'didAnniversaryDrip',
                  })
                }
              >
                Did Anniversary Drip
              </Button>
            </Box>
          </Box>
          {/* aside content */}
          <Box flex=".7" padding="20px">
            <Autocomplete
              options={options}
              onChange={(e, value) => handleOnChange(e, value)}
              value={filterValue}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={label}
                  variant="outlined"
                  fullWidth
                  size="small"
                  value={fieldValue}
                  // onChange={(e) => handleOnChange(e)}
                />
              )}
            />
          </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'right', gap: '5px' }}>
        <Button onClick={() => setFilterLeadModal(false)} variant="outlined" sx={{ padding: '5px 16px' }}>
          Cancel
        </Button>
        <Button variant="contained" sx={{ padding: '6px 26px', color: '#fff' }}>
          View Results
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FilterLeads;
