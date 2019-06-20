async function feed(parent, args, context, info) {
  const where = args.filter ? {
    OR: [
      { description_contains: args.filter },
      { url_contains: args.filter },
    ],
  } : {}

  const links = await context.prisma.links({
    where,
    skip: args.skip,
    first: args.first,
    orderBy: args.orderBy
  })


  const count = await context.prisma
    .linksConnection({
      where,
    })
    .aggregate()
    .count()

  return {
    links,
    count,
  }
}

async function flightControllerFeed(parent, args, context, info) {

  const fcs = await context.prisma.flightControllers()

  const count = await context.prisma
    .flightControllersConnection()
    .aggregate()
    .count()

  return {
    flightControllers: fcs,
    count
  }
}

async function userList(parent, args, context, info){
  let users = context.prisma.users()
  return {users}
}

function info(){
  return 'A clone of Hackernews'
}

// link: (parent, args) => {
//   let linkFound;
//   _.each(links, (link) => {
//     if(link.id === args.id){
//       linkFound = link;
//     }
//   })
//   return (linkFound) ? linkFound : {}
// }

module.exports = {
  feed,
  info,
  flightControllerFeed,
  userList
}
