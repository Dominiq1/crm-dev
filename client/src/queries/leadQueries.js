import { gql } from '@apollo/client';

export const GET_LEADS = gql`
  query Leads(
    $take: Int
    $skip: Int
    $filter: String
    $category: [String]
    $column: String
    $sort: String
    $filterModel: String
  ) {
    leads(
      take: $take
      skip: $skip
      filter: $filter
      category: $category
      column: $column
      sort: $sort
      filterModel: $filterModel
    ) {
      count
      rows {
        id
        firstName
        email
        lastName
        phone
        phoneStatus
        description
        emailInvalid
        GloballyOptedOutOfEmail
        GloballyOptedOutOfBuyerAgentEmail
        GloballyOptedOutOfListingAgentEmail
        GloballyOptedOutOfLenderEmail
        GloballyOptedOutOfAlerts
        OptInDate
        BuyerAgentCategory
        ListingAgentCategory
        LenderCategory
        BuyerAgent
        ListingAgent
        Lender
        OriginalSource
        OriginalCampaign
        LastAgentNote
        eAlerts
        VisitTotal
        listingviewcount
        AvgListingPrice
        NextCallDue
        LastAgentCallDate
        LastLenderCallDate
        FirstVisitDate
        LastVisitDate
        RegisterDate
        LeadType
        AgentSelected
        LenderOptIn
        Address
        City
        State
        ZipCode
        tagsList
        categoriesList
        didLeaveReview
        didClosingGift
        didsocialMediaFriends
        didPostCardDrip
        didAnniversaryDrip
        tags {
          id
          title
          dateCreated
        }
        categories {
          id
          title
          dateCreated
        }
        Link
        Birthday
        HomeClosingDate
      }
    }
  }
`;

export const GET_LEAD = gql`
  query Lead($id: ID) {
    lead(id: $id) {
      id
      firstName
      email
      lastName
      phone
      phoneStatus
      description
      emailInvalid
      GloballyOptedOutOfEmail
      GloballyOptedOutOfBuyerAgentEmail
      GloballyOptedOutOfListingAgentEmail
      GloballyOptedOutOfLenderEmail
      GloballyOptedOutOfAlerts
      OptInDate
      BuyerAgentCategory
      ListingAgentCategory
      LenderCategory
      BuyerAgent
      ListingAgent
      Lender
      OriginalSource
      OriginalCampaign
      LastAgentNote
      eAlerts
      VisitTotal
      listingviewcount
      AvgListingPrice
      NextCallDue
      LastAgentCallDate
      LastLenderCallDate
      FirstVisitDate
      LastVisitDate
      RegisterDate
      LeadType
      AgentSelected
      LenderOptIn
      Address
      City
      State
      ZipCode
      tagsList
      categoriesList
      tags {
        id
        title
        dateCreated
      }
      categories {
        id
        title
        dateCreated
      }
      Link
      Birthday
      HomeClosingDate
    }
  }
`;

export const NEW_LEAD_SUBSCRIPTION = gql`
  subscription OnNewLead {
    newLead {
      id
      LastName
      FirstName
      Description
      Address
    }
  }
`;

export const GET_FILTERS = gql`
  query GetFilter($userId: ID!) {
    getFilter(userId: $userId) {
      columns
      closedColumns
      isClosed
      pageSize
      page
      sort
      search
      user {
        id
        email
      }
    }
  }
`;

export const GET_LEADS_VALUES = gql`
  query leadFilter($label: String, $value: String) {
    leadFilter(label: $label, value: $value)
  }
`;
