const { parse } = require("pg-connection-string");

const url = "postgresql://neondb_owner:npg_3LtEKUoV0umT@ep-autumn-tooth-anopqbtv-pooler.c-6.us-east-1.aws.neon.tech/neondb?sslmode=require&pgbouncer=true&connect_timeout=30";

try {
  console.log(parse(url));
} catch (e) {
  console.log("PARSE ERROR:", e.message);
}
