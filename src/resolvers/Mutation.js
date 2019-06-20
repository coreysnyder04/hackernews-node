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

async function updateLink(parent, args, context, info) {
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

module.exports = {
  signup,
  login,
  post,
  updateLink,
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