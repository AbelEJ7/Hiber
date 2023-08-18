

import { Box, Typography,Card , CardContent,CardMedia , CardActionArea ,useTheme,Menu, MenuItem, LinearProgress} from "@mui/material";
import Header from "components/Header";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {  useGetTenderNewsQuery, useGetTenderQuery, useTenderRegisterMutation} from "state/api";

import Pay from "./pay";

const TenderNews = () => {

  const [selectedRow, setSelectedRow] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);
  const user = useSelector((state) => state.auth.user);
 
   
   const theme = useTheme()
   const {data , isLoading} = useGetTenderNewsQuery();
  //  console.log(data)
   const [TenderRegister] = useTenderRegisterMutation();

  const handleClick = (event,values) => {
    setAnchorEl(event.currentTarget);
    setSelectedRow(values)
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleRegister = async() => {
    const values = {
      sup_id:user.supplier_id,
      bid_id:selectedRow
      
    }
    console.log(values)
      const result = await  TenderRegister(values);

  }

  
   const values={
    id:"sa"
   }
    return (
     
    
    
        <Box  m="1.5rem 2.5rem" >
          <Header title="TENDER NEWS"  />
           
            <Box
                display="grid"
                gridTemplateColumns="repeat(4, 1fr)"
                // gridAutoRows="140px"
                gap="20px"
                 > 
                   {data && (
                  <>
                   {data || !isLoading ? (
                  data.map((data) => (
           <Card key={data.bid_id} sx={{ maxWidth: 345 }}>
        
      <CardActionArea onClick={(event) => handleClick(event, data.bid_id)}>
        <CardMedia
          component="img"
          height="140"
          image="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Y29tcHV0ZXJ8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60"
          alt="Bid image"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
           Tender for Year 2023 Computer
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Details:{data.date}
          </Typography>
          <Typography variant="h5"> 
           Status : on going
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
            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={openMenu}
                onClose={handleClose}
                MenuListProps={{
                  'aria-labelledby': 'basic-button',
                }}
              >
                <MenuItem onClick={handleRegister}><Pay name={user.supplier_id} email={user.email} /> </MenuItem>
                
              </Menu>
                </Box>
                
            )
        }

        export default TenderNews;