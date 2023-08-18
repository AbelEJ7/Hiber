import { Box, Typography,Card , CardContent,CardMedia , CardActionArea ,useTheme, Fab, Button, Menu, MenuItem, LinearProgress} from "@mui/material";
import AddProposalDialog from "components/AddProposalDialog";
import GenerateProposalDialog from "components/GenerateProposalDialog";
import Header from "components/Header";
import SetDeadlLine from "components/SetDeadLine";
import UploadDoc from "components/UploadDocDialog";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useGenerateProposalMutation ,useAddProposalMutation, useUpdateTenderMutation, useGetMyTenderQuery, useGetDocumentQuery, useGetPdfMutation} from "state/api";
import { Download } from "@mui/icons-material";
import { useRef } from "react";

const MyTender = () => {

  const [selectedRow, setSelectedRow] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const id = useSelector((state) => state.auth.user.supplier_id);
  const {data , isLoading} = useGetMyTenderQuery(id);
  const iframeRef = useRef(null);
  const [margin,setmargin] = useState(0);
  const [GetPdf] = useGetPdfMutation();

  const openMenu = Boolean(anchorEl);
  const theme = useTheme();
  const navigate= useNavigate()

  const handleClick = (event,values) => {
    setAnchorEl(event.currentTarget);
    setSelectedRow(values)
   // console.log(selectedRow)
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleTechnical = () => {
    const supplierid = selectedRow.bid_participate_id;
    const user_id=id;
    navigate(`/mytender/technical/${supplierid}`)  
  }

 const handleFinancial = () => {
  const bid_participate_id = selectedRow.bid_id;
  const supplierid = selectedRow.bid_participate_id;
  navigate(`/mytender/financial/${bid_participate_id}/${supplierid}`)
 }

 const handleGetDoc = async() => {
    console.log("🚀 ~ file: MyTender.jsx:48 ~ handleGetDoc ~ date:", selectedRow);
    const response= await GetPdf();
  const pdfData = new Uint8Array(response.data.data); // Convert the Array to Uint8Array
  const blob = new Blob([pdfData], { type: 'application/pdf' }); // Create a Blob from the Uint8Array

  const url = URL.createObjectURL(blob); // Create a URL for the Blob
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'original.pdf'); // Set the filename for the download
  document.body.appendChild(link);

  link.click(); // Simulate a click on the anchor element to trigger the download

  // Clean up after the download
  URL.revokeObjectURL(url);
    console.log("🚀 ~ file: MyTender.jsx:53 ~ handleGetDoc ~ response:", response.data.data)
 }

 const handleReadGetDoc = async()=>{
    try {
    console.log("🚀 ~ file: MyTender.jsx:48 ~ handleGetDoc ~ date:", selectedRow);

      const response = await GetPdf({bid_upload_date: selectedRow?.bid_upload_date,bid_file: selectedRow?.bid_file});
      const pdfData = new Uint8Array(response?.data.data); // Convert the Array to Uint8Array
      const blob = new Blob([pdfData], { type: 'application/pdf' }); // Create a Blob from the Uint8Array
  
      const url = URL.createObjectURL(blob); 
  
      console.log("I Frame: ",iframeRef)
      if (iframeRef.current.src === "http://localhost:3001/null") {
        console.log("PDF already loaded, clearing the iframe.");
        iframeRef.current.src = url;
        setmargin(3)
      } else {
        iframeRef.current.src = null;
        setmargin(0)
      }
      URL.revokeObjectURL(url);
    } catch (error) {
      
    }
 }

 const handleBidHistory = async()=>{
  const bid_id = selectedRow.bid_id;
  navigate(`/mytender/bidhistory/${bid_id}`,{state: {bid_title:selectedRow.bid_title }})
 }
    return (
        
        <Box  m="1.5rem 2.5rem" >
          <Header title="MY TENDERS"   />
            <Box
                //  mt="40px"
                display="grid"
                gridTemplateColumns="repeat(4, 1fr)"
                // gridAutoRows="140px"
                gap="20px"
                 > 
                 {data && (
                  <>
                   {data || !isLoading ? (
                  data.map((data) => (
            <Card key={data.bid_participate_id} sx={{ maxWidth: 345 }}>
          
                <CardActionArea onClick={(event) => handleClick(event, data)}>
                  <CardMedia
                    component="img"
                    height="140"
                    image="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Y29tcHV0ZXJ8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60"
                    alt="Bid image"/>

                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                     Title: {data.bid_title}
                    </Typography>
                    <Typography variant="h6" color="text.secondary">
                      Date: {data.date}
                    </Typography>
                    <Typography variant="h5"> 
                       Status : {data.bid_done == 0?'on Going':'Bid Closed'}
                    </Typography>
                  </CardContent>
                </CardActionArea>
            </Card>
            ))
            ) : (
              <LinearProgress variant="success" />
            )}
              </>
              )} 
          
    
            </Box>
            {selectedRow?.bid_done == 0?(
              <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={openMenu}
                onClose={handleClose}
                MenuListProps={{
                  'aria-labelledby': 'basic-button',
                }}
            >
              <MenuItem onClick={handleTechnical}>Set Technical </MenuItem>
              <MenuItem onClick={handleFinancial}>Set Financial</MenuItem>
              <MenuItem onClick={handleGetDoc}>Download Bid Document</MenuItem>
              <MenuItem onClick={handleReadGetDoc}>Read Bid Document Online</MenuItem>
          </Menu>
            ):
            (
            <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={openMenu}
            onClose={handleClose}
            MenuListProps={{
              'aria-labelledby': 'basic-button',
            }}
            >
              <MenuItem onClick={handleBidHistory}>Bid History</MenuItem>
            </Menu>
            )
            }
            {
              iframeRef.current?.src !== 'default_url.pdf' &&(
                <iframe
                  ref={iframeRef}
                  style={{ border: "none" ,marginTop: margin+"em"}}
                  title="PDF Viewer"
                  width="100%"
                  height="320px">
                </iframe>
              )
            }
        </Box>
        
    )
}

export default MyTender;