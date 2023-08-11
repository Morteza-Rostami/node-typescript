import { NextFunction, Request, Response } from "express";
import helper from "../utils/helpers";

export function paginateMid(model: any, filter = 'all') {
  return async (req: Request, res: Response, next: NextFunction) => {

    let { page = 1, limit = 2 } = req.query;
    page = Number(page);
    limit = Number(limit);
    const count = 0;

    try {

      const data = res.locals.data;
      //console.log('______________&&', await data.sort({ createdAt: 'desc' }))
      //console.log('SSSSSSSSSSSSSSsss', await data.limit(2).skip(1))
      console.log('------------', 'gbbbosdads');
      const errDataExist = { msg: 'pagination: no data', err: 1 };
      if (!data) return res.status(400).json(errDataExist);

      // when we use await =: mongoose excutes the query.
      const pag: any[] = await data
        .limit(limit * 1)
        .skip((page - 1) * limit);

      /* const data = await model.find({})
        .limit(limit * 1) // 2 * 1 = 2
        .skip((page - 1) * limit) // 1 - 1 = 0 * 2 = 0 */

      const errPagFailed = { msg: 'pagination: no data', err: 1 };
      if (!pag) return res.status(400).json(errPagFailed);

      // edit: pizza.image (url)
      /* const outcome = pag.map(doc => {
        const pizza = doc.toObject()
        pizza.image = helper.makeImgUrl(pizza.image, req);
        return pizza;
      }); */

      // total items
      const count = await model.count();
      const totalPage = Math.ceil(count / limit);
      const currentPage = page;
      const nextPage = page + 1;

      const pagObj = {
        data: pag,
        totalPage,
        currentPage,
        nextPage,
      };

      //console.log(pagObj.data.sort({ createdAt: -1 }))

      //res.locals.pag = pagObj;
      return res.status(200).json(pagObj);

      next();
    } catch (err: any) {
      const failed = { msg: 'pagination failed', err: err.message };
      return res.status(400).json(failed);
    }
  }
}