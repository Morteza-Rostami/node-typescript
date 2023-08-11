import pino from "pino";

// get a pretty error log
const logger = pino({
  transport: {
    target: "pino-pretty",
    options: {
      colorize: true,
    },
  },
})

export default logger