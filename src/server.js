
const ApolloServer = require('apollo-server').ApolloServer
const ApolloServerLambda = require('apollo-server-lambda').ApolloServer
const { gql } = require('apollo-server-lambda');

const typeDefs = gql`
  type Query {
    info: String!
    feed: [Link!]!
  }

  type Mutation {
    post(url: String!, description: String!): Link!,
    
    updateLink( id:String! , url: String!, description: String!): Link!
  }


  type Link {
    id: ID!
    description: String!
    url: String!
  }
`;

const users = [
  {
    id: '1',
    name: 'Elizabeth Bennet',
  },
  {
    id: '2',
    name: 'Fitzwilliam Darcy',
  },
];

let links = [{
  id: 'link-0',
  url: 'www.howtographql.com',
  description: 'Fullstack tutorial for GraphQL'
}]

const resolvers = {
  Query: {
    info: () => `This is the API of a Hackernews Clone`,
    feed: () => links,
  },
  Mutation: {
    // 2
    post: (parent, args) => {
  
    let idCount = links.length

       const link = {
        id: `link-${idCount++}`,
        description: args.description,
        url: args.url,
      }
      links.push(link)
      return link
    },
    updateLink: (parent, args) => {
      const link = links.find(link => link.id === args.id)
      if (!link) {
        throw new Error('Could not find link!!')
      }
      link.url = args.url
      link.description = args.description
      return link
    }
  },
}
const corsOptions = {
    origin: "http://localhost:3000",
};
  
function createLambdaServer () {
  return new ApolloServerLambda({
    typeDefs,
    resolvers,
    introspection: true,
    playground: true,
    cors: corsOptions

  });
}



function createLocalServer () {
  return new ApolloServer({
    typeDefs,
    resolvers,
    introspection: true,
    playground: true,
    cors: corsOptions
  });
}

module.exports = { createLambdaServer, createLocalServer }