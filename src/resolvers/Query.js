function feed(parent, args, context, info) {
  return context.prisma.link.findMany();
}

const Query = { feed };

export default Query;
