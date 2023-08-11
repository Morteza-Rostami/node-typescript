"use strict";

import express, { Request, Response } from 'express'
import http from 'http'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import compression from 'compression'
import cors from 'cors'
import dotenv from 'dotenv'
import logger from './utils/logger';
import { connectToDatabase, disconnectFromDatabase } from './utils/db';
import { CORS_ORIGIN } from './constants/const';
import helmet from 'helmet'
//import { graphqlHTTP } from 'express-graphql';
//import { schema } from './schema/schema'
import morgan from 'morgan';

// import routes
import userRoute from './modules/user/user.route';
import authRoute from './modules/auth/auth.route';
import videoRoute from './modules/video/video.route';
import adminRoute from './modules/admin/admin.route';
import pizzaRoute from './modules/pizza/pizza.route';

// middleware
import deserializeUser from './middleware/deserializeUser';
//import { schema } from './schema/traversy/schema';
//import { ApolloServer, Config, ExpressContext } from "apollo-server-express";

const app = express()
dotenv.config()

if (process.env.MODE_ENV === 'development') {
  app.use(cors({
    // port that client is running
    origin: CORS_ORIGIN,
    // cookies
    credentials: true,
  }))
}

// make app more secure by seeing some headers
//app.use(helmet())
//app.use(helmet.contentSecurityPolicy());
//app.use(helmet.crossOriginEmbedderPolicy());
app.use(helmet.crossOriginOpenerPolicy());
app.use(helmet.crossOriginResourcePolicy());
app.use(helmet.dnsPrefetchControl());
//app.use(helmet.expectCt());
app.use(helmet.frameguard());
app.use(helmet.hidePoweredBy());
app.use(helmet.hsts());
app.use(helmet.ieNoOpen());
app.use(helmet.noSniff());
app.use(helmet.originAgentCluster());
app.use(helmet.permittedCrossDomainPolicies());
app.use(helmet.referrerPolicy());
app.use(helmet.xssFilter());

app.use(compression())
app.use(cookieParser())
// json data
app.use(bodyParser.json())
// form data
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'))


//app.use(formidable());

// deserialize user from the token (middleware)
app.use(deserializeUser);

const server = http.createServer(app)
const PORT = process.env.PORT || 8080

server.listen(PORT, async () => {
  // after server starts: connect to the db 
  await connectToDatabase()
  logger.info(`server is running! at ${PORT}`)
})

//===============================================

app.use(express.static('public'));

//===============================================

// routes
app.use('/api/users', userRoute);
app.use('/api/auth', authRoute);
app.use('/api/videos', videoRoute);
app.use('/api/admin', adminRoute);
app.use('/api/pizzas', pizzaRoute)

// catch all route
app.get('*', (req: Request, res: Response) => res.json({ msg: 'catch all route.' }))

//===============================================================================

// grave full shut down

function graceFulShutdown(signal: string): void {

  // SIGINT is when: ctrl + c
  // this is an event that runs: when we end the process.
  process.on(signal, async () => {
    // close the node server
    server.close()

    // disconnect db
    await disconnectFromDatabase()

    logger.info('end of the process', signal)

    // close the process
    process.exit(0)
  })
}

const signals = ['SIGTERM', 'SIGINT']

for (let i = 0; i < signals.length; i++) {
  logger.info(signals[i])
  graceFulShutdown(signals[i]);
}