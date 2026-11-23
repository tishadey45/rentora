import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { betterAuth } from "better-auth";
import { jwt } from "better-auth/plugins";
import { MongoClient, type Db } from "mongodb";

const uri = process.env.MONGODB_URI as string;
const databaseName = "rentora";

type MongoPool = {
  client: MongoClient;
  closed: boolean;
};

type MongoClientInternals = {
  topology?: { isDestroyed?: () => boolean };
};

const globalStore = globalThis as typeof globalThis & {
  __rentoraMongoPool?: MongoPool;
};

function createPool(): MongoPool {
  const client = new MongoClient(uri, {
    maxPoolSize: 10,
  });

  const pool: MongoPool = { client, closed: false };

  client.on("topologyClosed", () => {
    pool.closed = true;
    if (globalStore.__rentoraMongoPool === pool) {
      globalStore.__rentoraMongoPool = undefined;
    }
  });

  return pool;
}

function isPoolUsable(pool: MongoPool): boolean {
  if (pool.closed) {
    return false;
  }

  const topology = (pool.client as unknown as MongoClientInternals).topology;
  if (topology?.isDestroyed?.()) {
    return false;
  }

  return true;
}

function getPool(): MongoPool {
  const existing = globalStore.__rentoraMongoPool;
  if (existing && isPoolUsable(existing)) {
    return existing;
  }

  const pool = createPool();
  globalStore.__rentoraMongoPool = pool;
  return pool;
}

function bindToLive<T extends object>(resolve: () => T): T {
  return new Proxy({} as T, {
    get(_target, property) {
      const live = resolve();
      const value = Reflect.get(live, property);
      return typeof value === "function" ? value.bind(live) : value;
    },
  });
}

const liveDatabase = bindToLive<Db>(() => getPool().client.db(databaseName));
const liveClient = bindToLive<MongoClient>(() => getPool().client);

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,
  emailAndPassword: {
    enabled: true,
  },
  account: {
    accountLinking: {
      // Allow "Sign in with Google" to link to an existing account that has the
      // same email (e.g. an email/password account). Same-email only; different
      // emails are still rejected.
      enabled: true,
      trustedProviders: ["google"],
      requireLocalEmailVerified: false,
    },
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "customer",
        input: false,
      },
    },
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  database: mongodbAdapter(liveDatabase, {
    client: liveClient,
  }),
  plugins: [jwt()],
});
