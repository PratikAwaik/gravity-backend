import { gql } from "apollo-server";

export const typeDefs = gql`
  type Link {
    id: String
    title: String
    url: String
  }

  type Query {
    links: [Link]!
  }
`;
