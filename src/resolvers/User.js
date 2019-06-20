function links(parent, args, context) {
  return context.prisma.user({ id: parent.id }).links()
}

function flightControllers(parent, args, context) {
  return context.prisma.user({ id: parent.id }).flightControllers()
}

module.exports = {
  links,
  flightControllers,
}
