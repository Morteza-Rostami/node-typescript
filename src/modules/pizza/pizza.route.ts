import express from 'express'
import { processRequestBody } from 'zod-express-middleware'
import pizzaController from './pizza.controller'
import { fileExtLimiter, fileSizeLimiter, filesExists, uploadImage } from '../../middleware/upload.image.mid';
import fileUpload from 'express-fileupload';
import { paginateMid } from '../../middleware/paginate.md';
import { Pizza } from './pizza.model';

const router = express.Router()

// POST: /api/pizzas/
router
  .route('/')
  .post(
    fileUpload({ createParentPath: true }),
    filesExists,
    fileSizeLimiter,
    fileExtLimiter(['.png', '.jpg', '.jpeg']),
    uploadImage,
    pizzaController.create)

// GET: /api/pizzas/
router
  .route('/')
  .get(
    pizzaController.getList,
    paginateMid(Pizza))

// GET: /api/pizzas?term='thing'

/* router
  .route('/search')
  .get() */

export default router