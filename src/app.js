import { ApolloServer } from 'apollo-server';
import fs from 'fs';
import path from 'path';
import pkg from '@prisma/client';
import { fileURLToPath } from 'url';

import { getUserId } from './utils.js';

import Query from './resolvers/Query.js';
import Mutation from './resolvers/Mutation.js';
import User from './resolvers/User.js';
import Link from './resolvers/Link.js';

const { PrismaClient } = pkg;

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const resolvers = {
  Query,
  Mutation,
  User,
  Link,
};

const prisma = new PrismaClient();

const server = new ApolloServer({
  typeDefs: fs.readFileSync(path.join(__dirname, 'schema.graphql'), 'utf8'),
  resolvers,
  context: ({ req }) => {
    return {
      ...req,
      prisma,
      userId: req && req.headers.authorization ? getUserId(req) : null,
    };
  },
});

server.listen().then(({ url }) => console.log(`Server is running on ${url}`));
