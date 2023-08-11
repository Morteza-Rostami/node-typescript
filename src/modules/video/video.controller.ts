import busboy from "busboy"
import { Request, Response } from "express"
import videoService from "./video.service"
import { StatusCodes } from "http-status-codes";
import { Video } from "./video.model";
import fs from 'fs'

const MIME_TYPES = ['video/mp4'];

// get the path to where we store the video
function getPath({
  videoId,
  extension,
}: {
  videoId: Video['videoId'],
  extension: Video['extension'],
}) {
  return `${process.cwd}/public/videos/${videoId}.${extension}`;
}

const videoController = (function () {

  function getVideo(): void {

  }

  // api/video/upload
  async function upload(req: Request, res: Response) {

    // store junks of the video
    const bb = busboy({
      headers: req.headers,
    })

    // create a VideoModel object
    const video: any = await videoService.create({});

    // store video file
    bb.on('file', async (_, file, info) => {

      // check the mime type of video
      if (!MIME_TYPES.includes(info.mimeType)) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          msg: 'invalid video type',
          err: 1
        })

        // delete the videoModel object

      }

      // get video extension. ex: video/mp4
      const extension = info.mimeType.split('/')[1];

      // path to 
      const filePath = getPath({
        videoId: video.videoId,
        extension: extension,
      })

      video.extension = extension;

      await video.save();

      // write to file path
      const stream = fs.createWriteStream(filePath);
      file.pipe(stream);
    })

    // finish upload
    bb.on('close', () => {
      res.writeHead(StatusCodes.CREATED), {
        Connection: 'close',
        "Content-Type": 'application/json',
      }
    })

    // write vidoe to response
    res.write(JSON.stringify(video));
    res.end();

    return req.pipe(bb);
  }

  return {
    getVideo,
    upload,
  }
})()

export default videoController