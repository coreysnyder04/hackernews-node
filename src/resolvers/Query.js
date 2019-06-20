function feed(parent, args, context, info) {
  return context.prisma.links()
}
function info(){
  return  'A clone of Hackernews'
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
}