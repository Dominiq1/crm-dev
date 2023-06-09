import { gql } from '@apollo/client';

const GET_CATEGORIES = gql`
  query GetAllCategories {
    categories {
      id
      title
      color
      description
      dateCreated
    }
  }
`;

const GET_CATEGORY = gql`
  query GetCategory($id: ID!) {
    category(id: $id) {
      id
      title
      color
      description
      dateCreated
    }
  }
`;


export { GET_CATEGORIES, GET_CATEGORY };
