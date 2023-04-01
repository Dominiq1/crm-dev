import * as React from 'react';
import { useState } from 'react';
import { useMutation } from '@apollo/client';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { Box } from '@mui/system';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import CsvUpload from '../DropBoxes/CsvUpload';
import { ADD_LEAD } from '../../mutations/leadMutations';

export default function AddLeadModal() {

  const [addLead, { loading, error, data }] = useMutation(ADD_LEAD);

  const [formData, setFormData] = useState(
    
    {
    firstName: "",
    email: "",
    lastName: "",
    phone: "",
    phoneStatus: "",
    descritpion: "",
    emailInvalid: "",
    GloballyOptedOutOfEmail: "",
    GloballyOptedOutOfBuyerAgentEmail: "",
    GloballyOptedOutOfListingAgentEmail: "",
    GloballyOptedOutOfLenderEmail: "",
    GloballyOptedOutOfAlerts: '',
    OptInDate: "",
    BuyerAgentCategory: "",
    ListingAgentCategory: "",
    LenderCategory: "",
    BuyerAgent: "",
    ListingAgent: "",
    Lender: "",
    OriginalSource: "",
    OriginalCampaign: "",
    LastAgentNote: "",
    eAlerts: "",
    VisitTotal: "",
    listingviewcount: "",
    AvgListingPrice: "",
    NextCallDue: "",
    LastAgentCallDate: "",
    LastLenderCallDate: "",
    FirstVisitDate: "",
    LastVisitDate: "",
    RegisterDate: "",
    LeadType: "",
    AgentSelected: "",
    LenderOptIn: "",
    Address: "",
    City: "",
    State: "",
    ZipCode: "",
    Tags: [],
    Link: "",
    Birthday: "",
    HomeClosingDate: "",


  });

  const [uploadInProcess, setUploaded] = useState(false);



 const [open, setOpen] = React.useState(false);





  const handleClickOpen = () => {
    setOpen(true);
  };



  const handleChange = (event) => {

    event.persist();
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
  
    });

    console.log(formData)

  };






  const handleClose = () => {
    setOpen(false);
  };




  const handleLeadSubmit = (e) => {

    console.log(formData)
    e.preventDefault();
    addLead({
      variables:formData,
    }).then((res) => {

      setFormData({
        firstName: "",
        email: "",
        lastName: "",
        phone: "",
        phoneStatus: "",
        emailInvalid: "",
        GloballyOptedOutOfEmail: "",
        GloballyOptedOutOfBuyerAgentEmail: "",
        GloballyOptedOutOfListingAgentEmail: "",
        GloballyOptedOutOfLenderEmail: "",
        GloballyOptedOutOfAlerts: "",
        OptInDate: "",
        BuyerAgentCategory: "",
        ListingAgentCategory: "",
        LenderCategory: "",
        BuyerAgent: "",
        ListingAgent: "",
        Lender: "",
        OriginalSource: "",
        OriginalCampaign: "",
        LastAgentNote: "",
        eAlerts: "",
        VisitTotal: "",
        listingviewcount: "",
        AvgListingPrice: "",
        NextCallDue: "",
        LastAgentCallDate: "",
        LastLenderCallDate: "",
        FirstVisitDate: "",
        LastVisitDate: "",
        RegisterDate: "",
        LeadType: "",
        AgentSelected: "",
        LenderOptIn: "",
        Address: "",
        City: "",
        State: "",
        ZipCode: "",
        Tags: [],
        Link: "",
        Birthday: "",
        HomeClosingDate: ""
      });

    console.log(res);
    setUploaded(false);
    console.log("Lead Submitted!");

    }).catch((err) => {
      
      console.log(err);
    });

  }


  return (

    <>
    { uploadInProcess ?( <div>
 
 <Button variant="outlined" onClick={handleClickOpen}>
  Add Lead
 </Button>
 <Dialog open={open} onClose={handleClose}>
   <DialogTitle>New Lead Info</DialogTitle>
   <DialogContent>
     <DialogContentText>
       Tell us about your new lead!
     </DialogContentText>


<Box>
<img src="https://img.freepik.com/premium-vector/3d-check-mark-icon-realistic-green-tick-button-isolated-white-background-vector-illustration_113065-1285.jpg" alt="CSV Upload" width="200" height="200" />

</Box>




   </DialogContent>
   <DialogActions>
      <Button onClick={handleClose}>Cancel</Button> 
    <Button onClick={() => setUploaded(false)}>Add Lead</Button> 
   </DialogActions>
 </Dialog>
</div> ) : ( <div>
 
 <Button variant="outlined" onClick={handleClickOpen}>
  Add Lead
 </Button>
 <Dialog open={open} onClose={handleClose}>
   <DialogTitle>New Lead Info</DialogTitle>
   <DialogContent>
     <DialogContentText>
       Tell us about your new lead!
     </DialogContentText>


     {/* <Button variant="outlined" onClick={handleClickOpen}>
 {CsvUpload()}
 </Button> */}
 
 


<TextField
autoFocus
margin="dense"
id="firstName"
label="First Name"
type="text"
fullWidth
variant="standard"
name="firstName"
value={formData.firstName}
onChange={handleChange}
/>

<TextField
autoFocus
margin="dense"
id="email"
label="Email Address"
type="email"
fullWidth
variant="standard"
name="email"
value={formData.email}
onChange={handleChange}
/>

<TextField
autoFocus
margin="dense"
id="lastName"
label="Last Name"
type="text"
fullWidth
variant="standard"
name="lastName"
value={formData.lastName}
onChange={handleChange}
/>


<TextField
autoFocus
margin="dense"
id="phone"
label="Phone"
type="text"
fullWidth
variant="standard"
name="phone"
value={formData.phone}
onChange={handleChange}
/>

<TextField
autoFocus
margin="dense"
id="phoneStatus"
label="Phone Status"
type="text"
fullWidth
variant="standard"
name="phoneStatus"
value={formData.phoneStatus}
onChange={handleChange}
/>

<TextField
autoFocus
margin="dense"
id="emailInvalid"
label="Email Invalid"
type="text"
fullWidth
variant="standard"
name="emailInvalid"
value={formData.emailInvalid}
onChange={handleChange}
/>

<TextField
autoFocus
margin="dense"
id="GloballyOptedOutOfEmail"
label="Globally Opted Out Of Email"
type="text"
fullWidth
variant="standard"
name="GloballyOptedOutOfEmail"
value={formData.GloballyOptedOutOfEmail}
onChange={handleChange}
/>

<TextField
autoFocus
margin="dense"
id="GloballyOptedOutOfBuyerAgentEmail"
label="Globally Opted Out Of Buyer Agent Email"
type="text"
fullWidth
variant="standard"
name="GloballyOptedOutOfBuyerAgentEmail"
value={formData.GloballyOptedOutOfBuyerAgentEmail}
onChange={handleChange}
/>

<TextField
autoFocus
margin="dense"
id="GloballyOptedOutOfListingAgentEmail"
label="Globally Opted Out Of Listing Agent Email"
type="text"
fullWidth
variant="standard"
name="GloballyOptedOutOfListingAgentEmail"
value={formData.GloballyOptedOutOfListingAgentEmail}
onChange={handleChange}
/>

<TextField
autoFocus
margin="dense"
id="GloballyOptedOutOfLenderEmail"
label="Globally Opted Out Of Lender Email"
type="text"
fullWidth
variant="standard"
name="GloballyOptedOutOfLenderEmail"
value={formData.GloballyOptedOutOfLenderEmail}
onChange={handleChange}
/>

<TextField
autoFocus
margin="dense"
id="GloballyOptedOutOfAlerts"
label="Globally Opted Out Of Alerts"
type="text"
fullWidth
variant="standard"
name="GloballyOptedOutOfAlerts"
value={formData.GloballyOptedOutOfAlerts}
onChange={handleChange}
/>

<TextField
autoFocus
margin="dense"
id="OptInDate"
label="Opt In Date"
type="text"
fullWidth
variant="standard"
name="OptInDate"
value={formData.OptInDate}
onChange={handleChange}
/>

<TextField
autoFocus
margin="dense"
id="BuyerAgentCategory"
label="Buyer Agent Category"
type="text"
fullWidth
variant="standard"
name="BuyerAgentCategory"
value={formData.BuyerAgentCategory}
onChange={handleChange}
/>

<TextField
autoFocus
margin="dense"
id="ListingAgentCategory"
label="Listing Agent Category"
type="text"
fullWidth
variant="standard"
name="ListingAgentCategory"
value={formData.ListingAgentCategory}
onChange={handleChange}
/>

<TextField
autoFocus
margin="dense"
id="LenderCategory"
label="Lender Category"
type="text"
fullWidth
variant="standard"
name="LenderCategory"
value={formData.LenderCategory}
onChange={handleChange}
/>

<TextField
autoFocus
margin="dense"
id="BuyerAgent"
label="Buyer Agent"
type="text"
fullWidth
variant="standard"
name="BuyerAgent"
value={formData.BuyerAgent}
onChange={handleChange}
/>

<TextField
autoFocus
margin="dense"
id="ListingAgent"
label="Listing Agent"
type="text"
fullWidth
variant="standard"
name="ListingAgent"
value={formData.ListingAgent}
onChange={handleChange}
/>

<TextField
autoFocus
margin="dense"
id="Lender"
label="Lender"
type="text"
fullWidth
variant="standard"
name="Lender"
value={formData.Lender}
onChange={handleChange}
/>

<TextField
autoFocus
margin="dense"
id="OriginalSource"
label="Original Source"
type="text"
fullWidth
variant="standard"
name="OriginalSource"
value={formData.OriginalSource}
onChange={handleChange}
/>

<TextField
autoFocus
margin="dense"
id="OriginalCampaign"
label="Original Campaign"
type="text"
fullWidth
variant="standard"
name="OriginalCampaign"
value={formData.OriginalCampaign}
onChange={handleChange}
/>

<TextField
autoFocus
margin="dense"
id="LastAgentNote"
label="Last Agent Note"
type="text"
fullWidth
variant="standard"
name="LastAgentNote"
value={formData.LastAgentNote}
onChange={handleChange}
/>

<TextField
autoFocus
margin="dense"
id="eAlerts"
label="E-Alerts"
type="text"
fullWidth
variant="standard"
name="eAlerts"
value={formData.eAlerts}
onChange={handleChange}
/>

<TextField
autoFocus
margin="dense"
id="VisitTotal"
label="Visit Total"
type="text"
fullWidth
variant="standard"
name="VisitTotal"
value={formData.VisitTotal}
onChange={handleChange}
/>

<TextField
autoFocus
margin="dense"
id="listingviewcount"
label="Listing View Count"
type="text"
fullWidth
variant="standard"
name="listingviewcount"
value={formData.listingviewcount}
onChange={handleChange}
/>

<TextField
autoFocus
margin="dense"
id="AvgListingPrice"
label="Average Listing Price"
type="text"
fullWidth
variant="standard"
name="AvgListingPrice"
value={formData.AvgListingPrice}
onChange={handleChange}
/>

<TextField
autoFocus
margin="dense"
id="NextCallDue"
label="Next Call Due"
type="text"
fullWidth
variant="standard"
name="NextCallDue"
value={formData.NextCallDue}
onChange={handleChange}
/>

<TextField
autoFocus
margin="dense"
id="LastAgentCallDate"
label="Last Agent Call Date"
type="text"
fullWidth
variant="standard"
name="LastAgentCallDate"
value={formData.LastAgentCallDate}
onChange={handleChange}
/>

<TextField
autoFocus
margin="dense"
id="LastLenderCallDate"
label="Last Lender Call Date"
type="text"
fullWidth
variant="standard"
name="LastLenderCallDate"
value={formData.LastLenderCallDate}
onChange={handleChange}
/>


<TextField
autoFocus
margin="dense"
id="FirstVisitDate"
label="FirstVisitDate"
type="text"
fullWidth
variant="standard"
name="FirstVisitDate"
value={formData.FirstVisitDate}
onChange={handleChange}
/>

<TextField
autoFocus
margin="dense"
id="LastVisitDate"
label="LastVisitDate"
type="text"
fullWidth
variant="standard"
name="LastVisitDate"
value={formData.LastVisitDate}
onChange={handleChange}
/>

<TextField
autoFocus
margin="dense"
id="RegisterDate"
label="RegisterDate"
type="text"
fullWidth
variant="standard"
name="RegisterDate"
value={formData.RegisterDate}
onChange={handleChange}
/>

<TextField
autoFocus
margin="dense"
id="LeadType"
label="LeadType"
type="text"
fullWidth
variant="standard"
name="LeadType"
value={formData.LeadType}
onChange={handleChange}
/>

<TextField
autoFocus
margin="dense"
id="AgentSelected"
label="AgentSelected"
type="text"
fullWidth
variant="standard"
name="AgentSelected"
value={formData.AgentSelected}
onChange={handleChange}
/>

<TextField
autoFocus
margin="dense"
id="LenderOptIn"
label="LenderOptIn"
type="text"
fullWidth
variant="standard"
name="LenderOptIn"
value={formData.LenderOptIn}
onChange={handleChange}
/>

<TextField
autoFocus
margin="dense"
id="Address"
label="Address"
type="text"
fullWidth
variant="standard"
name="Address"
value={formData.Address}
onChange={handleChange}
/>

<TextField
autoFocus
margin="dense"
id="City"
label="City"
type="text"
fullWidth
variant="standard"
name="City"
value={formData.City}
onChange={handleChange}
/>




<TextField
autoFocus
margin="dense"
id="State"
label="State"
type="text"
fullWidth
variant="standard"
name="State"
value={formData.State}
onChange={handleChange}
/>

<TextField
autoFocus
margin="dense"
id="ZipCode"
label="ZipCode"
type="text"
fullWidth
variant="standard"
name="ZipCode"
value={formData.ZipCode}
onChange={handleChange}
/>

<TextField
autoFocus
margin="dense"
id="Tags"
label="Tags"
type="text"
fullWidth
variant="standard"
name="Tags"
value={formData.Tags}
onChange={handleChange}
/>

<TextField
autoFocus
margin="dense"
id="Link"
label="Link"
type="text"
fullWidth
variant="standard"
name="Link"
value={formData.Link}
onChange={handleChange}
/>


<TextField
autoFocus
margin="dense"
id="Birthday"
label="Birthday"
type="text"
fullWidth
variant="standard"
name="Birthday"
value={formData.Birthday}
onChange={handleChange}
/>

<TextField
autoFocus
margin="dense"
id="HomeClosingDate"
label="Home Closing Date" 
type="text"
fullWidth
variant="standard"
name="HomeClosingDate"
value={formData.HomeClosingDate}
onChange={handleChange}
/>


   </DialogContent>
   <DialogActions>
     <Button onClick={handleClose}>Cancel</Button>
     <Button onClick={handleLeadSubmit}>Add Lead</Button>
   </DialogActions>
 </Dialog>
</div>)}
    
    </>
   
  );
}