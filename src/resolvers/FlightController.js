function postedBy(parent, args, context) {
  return context.prisma.flightControllers({ id: parent.id }).postedBy()
}


module.exports = {
  postedBy,
}
