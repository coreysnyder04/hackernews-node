const { GraphQLServer } = require('graphql-yoga')
const _ = require('underscore')

let links = [{
  id: 'link-0',
  url: 'www.howtographql.com',
  description: 'Fullstack tutorial for GraphQL'
}]

let idCount = links.length

const resolvers = {
  Query: {
    info: () => 'A clone of Hackernews',
    feed: () => links,
    link: (parent, args) => {
      let linkFound;
      _.each(links, (link) => {
        if(link.id === args.id){
          linkFound = link;
        }
      })

      return (linkFound) ? linkFound : {}
    }
  },
  Mutation: {
    post: (parent, args) => {
      const link = {
        id: `link-${idCount++}`,
        description: args.description,
        url: args.url,
      }
      links.push(link)
      return link
    },
    updateLink: (parent, {id, url, description}) => {
      let found = _.findWhere(links, {id});
      if(found){
        found.url = url;
        found.description = description;
        return found
      }
    },
    deleteLink: (parent, {id}) => {
      links = _.reject(links, (link)=> link.id===id)
    }

  }
}

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers,
})

server.start(() => console.log(`Server is running on http://localhost:4000`))