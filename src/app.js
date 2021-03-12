import { ApolloServer } from 'apollo-server';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

let links = [
  {
    id: 'link-0',
    url: 'www.google.com',
    description: 'Goooooooogle',
  },
];

let idCount = links.length;

const resolvers = {
  Query: {
    info: () => `API is working properly!`,
    feed: () => links,
    link: (_, args) => links.find((link) => link.id === args.id),
  },
  Mutation: {
    post: (_, args) => {
      const link = {
        id: `link-${idCount++}`,
        description: args.description,
        url: args.url,
      };
      links.push(link);
      return link;
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

const server = new ApolloServer({
  typeDefs: fs.readFileSync(path.join(__dirname, 'schema.graphql'), 'utf8'),
  resolvers,
});

server.listen().then(({ url }) => console.log(`Server is running on ${url}`));
