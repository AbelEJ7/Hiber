import React from 'react'
import {
    Box,Divider, Drawer,IconButton,List,ListItem,listItem,ListItemButton,ListItemIcon,ListItemText,Typography,useTheme
} from "@mui/material";
import {
    ChevronLeft,ChevronRightOutlined,HomeOutlined
    ,Groups2Outlined,ReceiptLongOutlined, PointOfSaleOutlined,TodayOutlined, PriceCheckOutlined, AssignmentOutlined, BallotOutlined
} from "@mui/icons-material";
import { useEffect, useState } from 'react';
import { useLocation,useNavigate } from 'react-router-dom';
import FlexBetween from './FlexBetween';
import hibre from '../assets/Hibret-bank-logo.jpg'

const navItems = [
  {
    text: "Dashboard",
    icon: <HomeOutlined />,
  },
  {
    text: "Client Facing",
    icon: null,
  },
  {
    text: "Task",
    icon: <AssignmentOutlined />,
  }, 
  {
    text: "Supplier",
    icon: <Groups2Outlined />,
  },
  {
    text: "Requests",
    icon: <ReceiptLongOutlined />,
  },
  {
    text: "Products",
    icon: <BallotOutlined />,
  },
 
  
  {
    text: "Unit price",
    icon: <PriceCheckOutlined />,
  },
  {
    text: "Managment",
    icon: null,
  },
  {
    text: "onGoing",
    icon: <PointOfSaleOutlined />,
  },
  {
    text: "History",
    icon: <TodayOutlined />,
  },
];

const SideBar = ({
  user,
  drawerWidth,
  isSidebarOpen,
  setIsSidebarOpen,
  isNonMobile,
}) => {
  const { pathname } = useLocation();
  const [active, setActive] = useState("");
  const navigate = useNavigate();
  const theme = useTheme();

  useEffect(() => {
    setActive(pathname.substring(1));
  }, [pathname]);

  return (
    <Box component="nav">
      {isSidebarOpen && (
        <Drawer
          open={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          variant="persistent"
          anchor="left"
          sx={{
            width: drawerWidth,
            "& .MuiDrawer-paper": {
              color: theme.palette.secondary[200],
              backgroundColor: theme.palette.background.alt,
              boxSixing: "border-box",
              borderWidth: isNonMobile ? 0 : "2px",
              width: drawerWidth,
            },
          }}
        >
          <Box width="100%">
            <Box m="1.5rem 2rem 2rem 3rem">
              <FlexBetween color={theme.palette.secondary.main}>
                <Box display="flex" alignItems="center" gap="0.5rem">
                  <Box 
                component="img"
                alt="profile"
                src={hibre}
                height="52px"
                width="52px"
                borderRadius="50%"
                sx={{ objectFit: "cover" }}
              />
              <Typography variant="h4" fontWeight="bold">
                    Hiber Procurment
                  </Typography>
                </Box>
                {!isNonMobile && (
                  <IconButton onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                    <ChevronLeft />
                  </IconButton>
                )}
              </FlexBetween>
            </Box>
            <List>
              {navItems.map(({ text, icon }) => {
                if (!icon) {
                  return (
                    <Typography key={text} sx={{ m: "2.25rem 0 1rem 3rem" }}>
                      {text}
                    </Typography>
                  );
                }
                const lcText = text.toLowerCase();

                return (
                  <ListItem key={text} disablePadding>
                    <ListItemButton
                      onClick={() => {
                        navigate(`/${lcText}`);
                        setActive(lcText);
                      }}
                      sx={{
                        backgroundColor:
                          active === lcText
                            ? theme.palette.secondary[300]
                            : "transparent",
                        color:
                          active === lcText
                            ? theme.palette.primary[600]
                            : theme.palette.secondary[100],
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          ml: "2rem",
                          color:
                            active === lcText
                              ? theme.palette.primary[600]
                              : theme.palette.secondary[200],
                        }}
                      >
                        {icon}
                      </ListItemIcon>
                      <ListItemText primary={text} />
                      {active === lcText && (
                        <ChevronRightOutlined sx={{ ml: "auto" }} />
                      )}
                    </ListItemButton>
                  </ListItem>
                );
              })}
            </List>
          </Box>

          <Box position="absolute" bottom="2rem">
            <Divider />
          </Box>
        </Drawer>
      )}
    </Box>
  );
};

export default SideBar