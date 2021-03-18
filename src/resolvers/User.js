function links(parent, args, context) {
  return context.prisma.user.findUnique({ where: { id: parent.id } }).links();
}

const User = { links };

export default User;
