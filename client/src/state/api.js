import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";


const func = () => {
  const storedState = localStorage.getItem('persist:root');
  if (storedState) {
    const parsedState = JSON.parse(storedState);
    const userObject = JSON.parse(parsedState.user);

    if (userObject && userObject.token) {
      return userObject.token;
    } else {
      console.log("Token not found in user object.");
      return null;
    }
  } else {
    console.log("Stored state not found.");
    return null;
  }
}

export const api = createApi({

    baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:3000",
              headers: {
                'Authorization': `Bearer ${func()}`
              }
             }), 
        reducerPath: "adminApi",
        tagTypes: ["User","Items","Customers","Tender","Transactions","Login","Register",
        "Request","Task","Proposal","Supplier","UnitPrice","Proposal","Employee","Branch"],

        endpoints:(build) => ({
          //assistant
            getRequest: build.query({
                query: (id) => `/requestsform/requests/${id}`,
                providesTags: ["User"],
            }),
            getAsRequest: build.query({
              query: (id) => `/requests/${id}`,
              providesTags: ["Request"],
          }),
          Request: build.mutation({
            query: (values) => ({
              url: '/request',
              method: 'POST',
              body: values,
            }),
            invalidatesTags: ["Request"]
          }),




          //Manager
          getRequestManager: build.query({
            query: (id) => `/manrequests/${id}`,
            providesTags: ["Request"],
        }),
          ManagerRequestStatus: build.mutation({
            query: (values) => ({
              url: '/requests/approve',
              method: 'PUT',
              body: values,
            }),
            invalidatesTags: ["Request"]
          }),
          ManagerRequestReject: build.mutation({
            query: (values) => ({
              url: '/requests/reject',
              method: 'PUT',
              body: values,
            }),
            invalidatesTags: ["Request"]
          }),
          //Director
          getOfficers: build.query({
            query:() => `/marketofficer`,
            providesTags:["Officer"],
        }),
        getProposalId: build.query({
          query:() => `proposalsid`,
          providesTags:["Officer"],
      }),
            getTask: build.query({
              query:(id) => `tasks/${id}`,
              providesTags:["Task"],
          }),
          getCategoriesId: build.query({
            query:(id) => `proposal/catagory/${id}`,
            providesTags:["Officer"],
        }),
          getNonFiltered: build.query({
            query:() => `/nonfilterd`,
            providesTags:["Request"],
        }),
          DirectorRequestStatus: build.mutation({
            query: (values) => ({
              url: '/filterdata',
              method: 'POST',
              body: values,
            }),  invalidatesTags: ["Request"]
          }),
            AssignTask: build.mutation({
              query: (values) => ({
                url: '/settasks',
                method: 'POST',
                body: values,
              }),
              invalidatesTags: ["Request"]
            }),
 
            //Officer

            getTechnical: build.query({
              query:({username,file_names}) => `/read-technical/${username}/${file_names}`,
              providesTags:["supplier"],
              }),

           getMyTask: build.query({
            query:(id) => `/mytasks/${id}`,
            providesTags:["Task"],
            }),
            getAssignedProcurment: build.query({
              query:() => `/assignedprocurment`,
              providesTags:["Task"],
              }),
              getAssignedByCategory: build.query({
                query:(id) => `/mytasks/detail/${id}`,
                providesTags:["Task"],
                }),
            getSupplierList: build.query({
              query:() => `/supplierlist`,
              providesTags:["Supplier"],
              }),
              getTender: build.query({
                query:() => `/tender`,
                providesTags:["Tender"],
                }),
                getItems: build.query({
                  query:() => `/items`,
                  providesTags:["Items"],
                  }),
                UpdateTender: build.mutation({
                  query: (values) => ({
                    url: '/updatebid',
                    method: 'PUT',
                    body: values,
                  }), invalidatesTags: ["Tender"]
                }),
              SetUnitPrice: build.mutation({
                query: (values) => ({
                  url: '/items/price',
                  method: 'PUT',
                  body: values,
                }), invalidatesTags: ["Items"]
              }),
              setTaskStatus: build.mutation({
                query: (values) => ({
                  url: '/mytasks/status',
                  method: 'PATCH',
                  body: values,
                }), invalidatesTags: ["Task"]
              }),
              GenerateProposal: build.mutation({
                query: (values) => ({
                  url: '/generateproposal ',
                  method: 'POST',
                  body: values,
                }),
                invalidatesTags: ["Proposal"]
              }),
              getProposal: build.query({
                query:() => '/proposals',
                providesTags:["Proposal"],
            }),
            getBid: build.query({
              query:(id) => `/tenders/${id}`,
              providesTags:["Proposal"],
          }),
            AddProposal: build.mutation({
              query: (values) => ({
                url: '/proposal/add',
                method: 'POST',
                body: values,
              }),
              invalidatesTags: ["Proposal"]
            }),
            UploadDocment: build.mutation({
              query: (values) => ({
                url: '/uploadbiddoc',
                method: 'POST',
                body: values,
              }),
              invalidatesTags: ["Tender"]
            }),
            GenerateBid: build.mutation({
              query: (values) => ({
                url: '/procurment/generate',
                method: 'POST',
                body: values,
              }),
              invalidatesTags: ["Proposal"]
            }),
            getOnGoing: build.query({
              query:(id) => `/ongoing/${id}`,
              providesTags:["Tender"],
          }),
          getOnGoingDetail: build.query({
            query:(id) => `/ongoing/detail/${id}`,
            providesTags:["Tender"],
        }),
        // getTechnicaList: build.query({
        //     query:(id) => `/technicallist/${id}`,
        //     providesTags:["Task"],
        //     }),
            getTechnicalList: build.query({
              query:(id) => `/technicallist/${id}`,
              providesTags:["Task"],
              }),
              getTechnicalDetail: build.query({
                query:(bid_id,sup_id) => `/technicaldetail/${bid_id}/${sup_id}`,
                providesTags:["Tender"],
            }),
            setTechnicalResult: build.mutation({
              query: (values) => ({
                url: '/evaluatetechnical',
                method: 'POST',
                body: values,
              }), invalidatesTags: ["Technical"]
            }),


              //Approval
              getProposals: build.query({
                query:() => `/proposals`,
                providesTags:["Proposal"],
            }),
              getDetailProposal: build.query({
                query:() => `/proposals/details/`,
                providesTags:["Proposal"],
            }),
            getDetailProposalCategory: build.query({
              query:(id) => `/proposals/details/category${id}`,
              providesTags:["Proposal"],
          }),
          approveProposal: build.mutation({
            query: (values) => ({
              url: '/approveproposal',
              method: 'PUT',
              body: values,
            }),
            invalidatesTags: ["Proposal"]
          }),
          checkProposal: build.mutation({
            query: (values) => ({
              url: '/proposals/details',
              method: 'PATCH',
              body: values,
            }),
            invalidatesTags: ["Request"]
          }),
              login: build.mutation({
                query: (values) => ({
                  url: '/login',
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: values,
                }),
                invalidatesTags: ["Login"],
              }),
              register: build.mutation({
                query: (values) => ({
                  url: '/register',
                  method: 'POST',
                  body: values,
                }),
                invalidatesTags: ["Register"]
              }),


              //Supplier
              getTenderNews: build.query({
                query:() => `/tendernews`,
                providesTags:["Tender"],
            }),

            getMyTender: build.query({
              query:(id) => `/mytender/${id}`,
              providesTags:["Tender"],
          }),

          getDocument: build.query({
            query:(bid_id) => `/mydocument/${bid_id}`,
            providesTags:["Tender"],
        }),

        getPdf: build.mutation({
          query:(bid_file) => `/bid-download/${bid_file}`,
              providesTags:["Tender"],
        }),

          getFinancialForm: build.query({
            query:(id) => `/mytender/financialform/${id}`,
            providesTags:["Tender"],
        }),
        getFinancialWinner: build.query({
          query:(id) => `/winner/${id}`,
          providesTags:["Tender"],
      }),
      getFinancialItemWinner: build.query({
        query:(bid_id,item_id) => `/winner/item/${bid_id}/${item_id}`,
        providesTags:["Tender"],
    }),
        FillTechnicalForm: build.mutation({
          query: (values) => ({
            url: '/mytender/technicalform',
            method: 'POST',
            body: values,
          }),
        invalidatesTags: ["Tender"]
      }),
          FillFinancialForm: build.mutation({
            query: (values) => ({
              url: '/mytender/financialform',
              method: 'POST',
              body: values,
            }),
          invalidatesTags: ["Tender"]
        }),
              TenderRegister: build.mutation({
                query: (values) => ({
                  url: '/tendernews/register',
                  method: 'POST',
                  body: values,
                }),
                invalidatesTags: ["Tender"]
              }),
             // Admin
             getEmployee: build.query({
              query:() => `/employee`,
              providesTags:["Employee"],
          }),

          InsertEmployee: build.mutation({
            query: (values) => ({
              url: '/addemployee',
              method: 'POST',
              body: values,
            }),
            invalidatesTags: ["Employee"]
          }),

          getBranch: build.query({
            query:() => `/branch`,
            providesTags:["Branch"],
        }),

        getDistrict: build.query({
          query:() => `/district`,
          providesTags:["Branch"],
      }),
      
        InsertBranch: build.mutation({
          query: (values) => ({
            url: '/addbranch',
            method: 'POST',
            body: values,
          }),
          invalidatesTags: ["Branch"]
        }),

        InsertDistrict: build.mutation({
          query: (values) => ({
            url: '/addbranch',
            method: 'POST',
            body: values,
          }),
          invalidatesTags: ["District"]
        }),
      //ASSISTANT GENERAL REQUESTS

        getTotalRequest: build.query({
          query:(user_id) => `totalrequest/${user_id}`,
          providesTags:["Branch"],
        }),

        getTotalPendingRequest: build.query({
          query:(user_id) => `totalpendings/${user_id}`,
          providesTags:["Branch"],
        }),

        getTotalApprovesRequest: build.query({
          query:(user_id) => `totalapproves/${user_id}`,
          providesTags:["Branch"],
        }),

        //BRANCH MANAGER GENERAL REQUESTS
        getManagerTotalApproveRequest: build.query({
          query:(branch_id) => `branchapproverequests/${branch_id}`,
          providesTags:["Branch"],
        }),

        getManagerTotalBranchRequest: build.query({
          query:(branch_id) => `branchrequests/${branch_id}`,
          providesTags:["Branch"],
        }),

        getManagerTotalPendingRequest: build.query({
          query:(branch_id) => `branchpendingrequests/${branch_id}`,
          providesTags:["Branch"],
        }),


        //MARKET OFFICER GENERAL REQUESTS
        getTotalTask: build.query({
          query:(user_id) => `totaltask/${user_id}`,
          providesTags:["Branch"],
        }),

        getMarketTotalRequest: build.query({
          query:() => `totalrequests/`,
          providesTags:["Branch"],
        }),
      }),
        


})

export const {
  useGetTotalTaskQuery,
  useGetMarketTotalRequestQuery,
  useGetManagerTotalApproveRequestQuery,
  useGetManagerTotalPendingRequestQuery,
  useGetManagerTotalBranchRequestQuery,

  useGetTotalApprovesRequestQuery,
  useGetTotalPendingRequestQuery,
  useGetTotalRequestQuery,

  useGetTechnicalQuery,
  useGetPdfMutation,
  useApproveProposalMutation,
  useInsertBranchMutation,
  useInsertEmployeeMutation,
  useGetBranchQuery,
  useGetEmployeeQuery,
  useGetCategoriesIdQuery,
  useGetProposalIdQuery,
  useSetTechnicalResultMutation,
  useGetTechnicalListQuery,
  useGetTechnicalDetailQuery,
  useGetDocumentQuery,
  useGetFinancialWinnerQuery,
  useGetFinancialItemWinnerQuery,
  useUploadDocmentMutation,
  useGetOnGoingDetailQuery,
  useGetBidQuery,
  useGetItemsQuery,
  useGetNonFilteredQuery,
  useManagerRequestRejectMutation,
  useGetRequestManagerQuery,
  useGetOnGoingQuery,
  useGetMyTenderQuery,
  useGetTenderQuery,
  useGetTenderNewsQuery,
  useGetFinancialFormQuery,
  useFillFinancialFormMutation,
  useFillTechnicalFormMutation,
  useTenderRegisterMutation,
  useUpdateTenderMutation,
  useGenerateBidMutation,
  useGetAssignedByCategoryQuery,
  useGetAssignedProcurmentQuery,
  useAddProposalMutation,
  useGetProposalQuery,
  useGenerateProposalMutation,
  useGetCustomersQuery,
  useGetTransactionsQuery,
  useLoginMutation,
  useRegisterMutation,
  useRequestMutation,
  useGetRequestQuery,
  useGetAsRequestQuery,
  useManagerRequestStatusMutation,
  useDirectorRequestStatusMutation,
  useGetTaskQuery,
  useAssignTaskMutation,
  useGetMyTaskQuery,
  useCheckProposalMutation
  ,useGetDetailProposalCategoryQuery,
  useGetProposalsQuery,
  useGetDetailProposalQuery,  
  useGetOfficersQuery,
  useGetSupplierListQuery,
  useSetTaskStatusMutation,
  useSetUnitPriceMutation
} = api ;