import { Video, VideoModel } from "./video.model"

const videoService = (() => {

  async function create({ }) {
    const video: Video = await VideoModel.create({});
    return video;
  }

  return {
    create,
  }
})()

export default videoService