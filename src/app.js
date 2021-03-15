import { ApolloServer } from 'apollo-server';
import fs from 'fs';
import path from 'path';
import pkg from '@prisma/client';
import { fileURLToPath } from 'url';

const { PrismaClient } = pkg;

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const resolvers = {
  Query: {
    info: () => `API is working properly!`,
    feed: (parent, args, context) => {
      return context.prisma.link.findMany();
    },
    link: (_, args) => links.find((link) => link.id === args.id),
  },
  Mutation: {
    post: (parent, args, context, info) => {
      const newLink = context.prisma.link.create({
        data: {
          url: args.url,
          description: args.description,
        },
      });
      return newLink;
    },
    updateLink: (_, args) => {
      const index = links.findIndex((link) => link.id === args.id);
      links[index] = {
        ...links[index],
        ...args,
      };
      return links[index];
    },
    deleteLink: (_, args) => {
      let deletedLink;
      links = links.filter((link) => {
        if (link.id === args.id) {
          deletedLink = link;
        }
        return link.id !== args.id;
      });
      return deletedLink;
    },
  },
};

const prisma = new PrismaClient();

const server = new ApolloServer({
  typeDefs: fs.readFileSync(path.join(__dirname, 'schema.graphql'), 'utf8'),
  resolvers,
  context: {
    prisma,
  },
});

server.listen().then(({ url }) => console.log(`Server is running on ${url}`));
