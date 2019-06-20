const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { APP_SECRET, getUserId } = require('../utils')


async function signup(parent, args, context, info) {
  const password = await bcrypt.hash(args.password, 10)
  const user = await context.prisma.createUser({ ...args, password })

  const token = jwt.sign({ userId: user.id }, APP_SECRET)

  return {
    token,
    user,
  }
}

async function login(parent, args, context, info) {
  const user = await context.prisma.user({ email: args.email })
  if (!user) {
    throw new Error('No such user found')
  }

  const valid = await bcrypt.compare(args.password, user.password)
  if (!valid) {
    throw new Error('Invalid password')
  }

  const token = jwt.sign({ userId: user.id }, APP_SECRET)

  return {
    token,
    user,
  }
}

function post(parent, args, context, info) {
  const userId = getUserId(context)
  return context.prisma.createLink({
    url: args.url,
    description: args.description,
    postedBy: { connect: { id: userId } },
  })
}

function addFlightController(parent, args, context, info){
  const userId = getUserId(context)
  console.log("Adding Flight Controller as", userId, args)

  return context.prisma.createFlightController({
    postedBy: { connect: { id: userId } },
    ...args
  })
}

async function updateLink(parent, args, context, info) {
  const userId = getUserId(context)
  console.log('updateLink', args)
  const existingLink = await context.prisma.link({ id: args.id })
  console.log('existingLink', existingLink)
  if (!existingLink) {
    throw new Error('No such link found by that ID')
  }

  let updatedLink = {...existingLink, ...args};
  console.log("updated link", updatedLink);

  return context.prisma.updateLink(updatedLink)
}

async function vote(parent, args, context, info) {
  // 1
  const userId = getUserId(context)

  // 2
  const linkExists = await context.prisma.$exists.vote({
    user: { id: userId },
    link: { id: args.linkId },
  })
  if (linkExists) {
    throw new Error(`Already voted for link: ${args.linkId}`)
  }

  // 3
  return context.prisma.createVote({
    user: { connect: { id: userId } },
    link: { connect: { id: args.linkId } },
  })
}



module.exports = {
  signup,
  login,
  post,
  updateLink,
  vote,
  addFlightController,
}

// Mutation: {

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