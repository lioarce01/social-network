// import * as jwt from "express-jwt";
// import jwksRsa from "jwks-rsa";
// import * as dotenv from "dotenv";

// dotenv.config();

// const AUTH0_DOMAIN = process.env.AUTH0_DOMAIN;
// const AUTH0_AUDIENCE = process.env.AUTH0_AUDIENCE;

// const checkJwt = jwt({
//   secret: jwksRsa.expressJwtSecret({
//     cache: true,
//     rateLimit: true,
//     jwksRequestsPerMinute: 5,
//     jwksUri: `https://${AUTH0_DOMAIN}/.well-known/jwks.json`,
//   }),
//   audience: `${AUTH0_AUDIENCE}`,
//   issuer: `https://${AUTH0_DOMAIN}/`,
//   algorithms: ["RS256"],
// });

// export default checkJwt;
