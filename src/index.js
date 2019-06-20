const { GraphQLServer } = require('graphql-yoga')
const _ = require('underscore')
const { prisma } = require('./generated/prisma-client')

const resolvers = {
  Query: {
    info: () => 'A clone of Hackernews',
    feed: (root, args, context, info) => {
      return context.prisma.links()
    },
    // link: (parent, args) => {
    //   let linkFound;
    //   _.each(links, (link) => {
    //     if(link.id === args.id){
    //       linkFound = link;
    //     }
    //   })
    //   return (linkFound) ? linkFound : {}
    // }
  },
  Mutation: {
    post: (root, args, context) => {
      return context.prisma.createLink({
        url: args.url,
        description: args.description,
      })
    },
  },
  // Mutation: {
  //   post: (parent, args) => {
  //     const link = {
  //       id: `link-${idCount++}`,
  //       description: args.description,
  //       url: args.url,
  //     }
  //     links.push(link)
  //     return link
  //   },
  //   updateLink: (parent, {id, url, description}) => {
  //     let found = _.findWhere(links, {id});
  //     if(found){
  //       found.url = url;
  //       found.description = description;
  //       return found
  //     }
  //   },
  //   deleteLink: (parent, {id}) => {
  //     links = _.reject(links, (link)=> link.id===id)
  //   }
  // }
}

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers,
  context: { prisma },
})

server.start(() => console.log(`Server is running on http://localhost:4000`))