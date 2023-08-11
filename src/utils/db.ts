import mongoose from "mongoose";
import logger from "./logger";

const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017'

// connect to the db
export async function connectToDatabase() {
  try {
    await mongoose.connect(MONGO_URL, { dbName: 'pizza' })
    logger.info('connected to db')
  } catch (err) {
    logger.error(err, 'filed to connect to the db!')
    process.exit(1)
  }
}

// disconnect from the db
export async function disconnectFromDatabase() {
  await mongoose.connection.close()
  logger.info('db disconnected!')
  return
}

// init mongoose
/* mongoose.Promise = Promise;
mongoose.connect(MONGO_URL)
mongoose.connection
  .on(
    'connected',
    () => console.log('connected to mongoose!')
  )
  .on(
    'error',
    (error: Error) => console.log(error)
  ) */