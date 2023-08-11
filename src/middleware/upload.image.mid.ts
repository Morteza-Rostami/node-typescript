import { NextFunction, Request, Response } from "express";
import { IMAGE_SIZE_LIMIT, MB } from "../constants/const";
import path from "path";
//import { customAlphabet } from "nanoid";
import randomstring from 'randomstring';

//const nanoid = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyz', 10);

//~~~~~~~~~~~~~~~~((*******************))
//~~~~~~~~~~~~~~~~((*******************))

// check if req.files exist
export function filesExists(req: Request, res: Response, next: NextFunction) {
  const errNoFile = { msg: 'Middle: /filesExists', err: 1 };

  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).json(errNoFile);
  }
  next();
}

//~~~~~~~~~~~~~~~~((*******************))
//~~~~~~~~~~~~~~~~((*******************))

// limit file size
export function fileSizeLimiter(req: Request, res: Response, next: NextFunction) {
  const files: any = req.files;

  // just for typescript, we are cheking files not being empty, inside a middleware.
  if (!files) return;

  const filesOverLimit: any[] = [];

  // push all files that are over limit
  Object.keys(files).forEach(key => {

    if (files[key].size > IMAGE_SIZE_LIMIT) {
      filesOverLimit.push(files[key].name);
    }
  })

  if (filesOverLimit.length) {
    const properVerb = filesOverLimit.length > 1 ? 'are' : 'is';

    const sentence = `upload filed, ${filesOverLimit.toString()} ${properVerb} over the file size limit of ${MB} mb.`.replace(',', ', ');

    const message = filesOverLimit.length < 3
      ? sentence.replace(',', ' and')
      : sentence.replace(/,(?=[^,]*$)/, ' and');

    return res.status(413).json({ msg: message, err: 1 });
  }

  next();
}

//~~~~~~~~~~~~~~~~((*******************))
//~~~~~~~~~~~~~~~~((*******************))

// file extension limiter
export function fileExtLimiter(allowedExtArray: any[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const files: any = req.files;

    if (!files) return;

    const fileExtensions: string[] = [];

    Object.keys(files).forEach(key => {
      fileExtensions.push(path.extname(files[key].name));
    })

    // allowed extension
    const allowed = fileExtensions.every(ext => allowedExtArray.includes(ext));

    // if even one file not allowed: upload fails
    if (!allowed) {
      const message = `upload failed. only ${allowedExtArray.toString()} files allowed.`
        .replace(',', ', ');

      return res.status(422).json({ msg: message, err: 1 });
    }

    next();
  }
}

//~~~~~~~~~~~~~~~~((*******************))
//~~~~~~~~~~~~~~~~((*******************))

// upload image to server
export function uploadImage(req: Request, res: Response, next: NextFunction) {

  const files: any = req.files;
  const fileNames: string[] = [];

  Object.keys(files).forEach((key: any) => {
    const rootDir = path.dirname(process.cwd());
    const fileName = randomstring.generate(10) + files[key].name;
    const filepath = path.join(rootDir, 'backend/public/images', fileName);

    console.log(files, filepath, path.dirname(__dirname))
    // write to server
    files[key].mv(filepath, (err: any) => {
      console.log(err)
      const failed = { msg: 'write image to server failed', err: err };
      if (err) return res.status(500).json(failed);
    })

    fileNames.push(fileName);
  })

  // send uploaded files names into controller
  res.locals.files = fileNames;
  next();

  /* const success = {
    msg: 'file upload success',
    err: 0,
    data: Object.keys(files).toString(),
  }
  return res.json(success); */
}