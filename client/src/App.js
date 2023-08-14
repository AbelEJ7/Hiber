import {CssBaseline,ThemeProvider} from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { themeSettings } from "theme";
import Layout from "pages/layout/Layout.component";
import Dashboard  from "pages/dashboard/Dashboard.component";
import Products from "pages/products/products.component";
import LoginPage from "pages/login/LoginPage.component";
import RequestForm from "pages/login/RequestForm.component";
import AsRequestTable from "pages/AsRequestTable/AsRequestTable";
import MaRequestTable from "pages/MaRequestTable/MaRequestTable";
import DRequestTable from "pages/director/DRequestTable";
import TaskAssign from "pages/director/TaskAssign";
import Proposal from "pages/approval/ProposalDetails";
import MyTask from "pages/officer/MyTask";
import UnitPrice from "pages/officer/UnitPrice";
import OfficerProposal from "pages/officer/OfficerProposal";
import AssignedProcurment from "pages/officer/AssignedProcurment";
import DetailProcurment from "pages/officer/DetailProcurment";
import Tender from "pages/officer/Tendet";
import TenderNews from "pages/supplier/TenderNews";
import MyTender from "pages/supplier/MyTender";
import TechnicalForm from "pages/supplier/TechnicalForm";
import FinancialForm from "pages/supplier/FinancialForm";
import OnGoing from "pages/officer/OnGoing";
import OnGoingDetail from "pages/officer/OnGoingDetail";
import FinancialWiner from "pages/officer/FinancialWiner";
import FinancialWinnerItem from "pages/officer/FinancialWinnerItem";
import TechnicalList from "pages/officer/TechnicalList";
import TechnicalDetail from "pages/officer/TechnicalDetail";
import ProposalList from "pages/approval/ProposalList";
import Employee from "pages/Admin/Employee";
import District from "pages/Admin/District";
import PdfReader from "components/PdfReader";
import BidHistory from "pages/supplier/BidHistory";
import SessionExpired from "pages/components/SessionExpired";



function App() {
  const mode = useSelector((state) => state.auth.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  const userPossition = useSelector((state) => state.auth.user?.position);
//  console.log(userPossition)
  const isAuth = Boolean(useSelector((state) => state.auth.user?.token));
  const [loading, setLoading] = useState(true);
  window.addEventListener('beforeunload', () => {
    setLoading(true);
  });
  
  window.addEventListener('load', () => {
    setLoading(false);
  });
  

  return (
  <>
       {/* {loading && ( <Backdrop
                  sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                  open={loading}
                >
                  <CircularProgress color="secondary" />
                </Backdrop>)} */}
       <BrowserRouter>
      <ThemeProvider  theme={theme}>
        <CssBaseline />
        <Routes> 
     
            {isAuth ? ( <>
              <Route path="/session-expired" element={<SessionExpired />} />
              {userPossition === "assistant" && (
                  <Route element={<Layout />}>
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/requestsform" element={<RequestForm />} />
                    <Route path="/requeststatus" element={<AsRequestTable />} />
                  </Route>
                )}
                 {userPossition === "manager" && (
                  <Route element={<Layout />}>
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/requestaction" element={<MaRequestTable />} />
                    <Route path="/requeststatus" element={<AsRequestTable />} />
                  </Route>
                )}
                {userPossition === "director" && (
                  <Route element={<Layout />}>
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/requests" element={<DRequestTable />} />
                    <Route path="/taskassign" element={<TaskAssign />} />
                  </Route>
                )}
                 {userPossition === "approvalbody" && (
                  <Route element={<Layout />}>
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/proposals" element={<ProposalList />} />
                    <Route path="/proposals/details/:prop_id" element={<Proposal />} />
                    <Route path="/pdf" element={<PdfReader />} />

                    <Route path="/report" element={<TaskAssign />} />
                  </Route>
                )}
                 {userPossition === "marketofficer" && (
                  <Route element={<Layout />}>
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/mytasks" element={<MyTask />} />
                    <Route path="/requests" element={<DRequestTable />} />
                    <Route path="/unitprice" element={<UnitPrice />} />
                    <Route path="/proposal" element={<OfficerProposal />} />
                    <Route path="/procurment" element={<AssignedProcurment />} />
                    <Route path="/procurment/:id" element={<DetailProcurment />} />
                    <Route path="/tender" element={<Tender />} />
                    <Route path="/ongoing" element={<OnGoing />} />
                    <Route path="/ongoingdetails/:id" element={<OnGoingDetail />} />
                    <Route path="/ongoingdetails/financialwinner/:bidid" element={<FinancialWiner />} />
                    <Route path="/ongoingdetails/financialwinner/item/:bidid/:item_id" element={<FinancialWinnerItem />} />
                    <Route path="/ongoingdetails/technicallist/:bidid" element={<TechnicalList />} />
                    <Route path="/ongoingdetails/technicallist/detail/:bidid/:sup_id" element={<TechnicalDetail />} />
                    

                    <Route path="/report" element={<TaskAssign />} />

                  </Route>
                )}
                {userPossition ==="supplier" && (
                   <Route element={<Layout />}>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/tendernews" element={<TenderNews />} />
                <Route path="/mytender" element={<MyTender />} />
                <Route path="/mytender/technical/:supplier_Id" element={<TechnicalForm />} />
                <Route path="/mytender/financial/:bidid/:participant" element={<FinancialForm />} />
                <Route path="/mytender/bidhistory/:bidid" element={<BidHistory />} />

              </Route>
                )
                }
                {userPossition ==="admin" && (
                   <Route element={<Layout />}>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/employee" element={<Employee />} />
                {/* <Route path="/branch" element={<Branch />} /> */}
              </Route>
                )
                  
                }
            </>) : (
                     <Route path="/" element={<LoginPage />} />
            ) }
            
             
            
        </Routes>
       </ThemeProvider>
    </BrowserRouter>
    </>
  );
}

export default App;
