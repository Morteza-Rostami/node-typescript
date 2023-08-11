import path from "path";
//import os from 'os';
//import child_process from "child_process";
import { Request } from "express";

const helper = {

  makeImgUrl: (imgname: string, req: Request): string => {
    //const rootDir = path.dirname(process.cwd());
    console.log(`${process.env.PROTOCOL}${req.hostname}:${process.env.PORT}`)
    return path.join(`${process.env.PROTOCOL}${req.hostname}:${process.env.PORT}`, '/images/', imgname);
  },
}

export default helper;