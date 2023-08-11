import { NextFunction, Request, Response } from "express"
import { createPizza, getPizzas, searchPizza } from "./pizza.action";
import { StatusCodes } from "http-status-codes";
import { Pizza } from "./pizza.model";

const pizzaController = {

  // GET: /api/pizzas?limit=2&page=1
  getList: function (req: Request, res: Response, next: NextFunction) {
    let pizzas: any = [];
    const errGetPizzas = { msg: 'no pizzas, err: 1' };

    try {

      // GET: /pizzas
      pizzas = getPizzas();

      //console.log()
      if (!pizzas) return res.status(400).json(errGetPizzas);

      //return res.status(200).json(pizzas);
      res.locals.data = pizzas;
      next();

    } catch (err: any) {
      const failed = { msg: '/api/pizzas/ failed', err: err.message };
      return res.status(400).json(failed);
    }
  },

  // GET: /api/pizzas?term=""
  searchPizza: async function (req: Request, res: Response) {
    const { term } = req.params;
    const errNoTerm = { msg: 'search term is required.', err: 1 };

    if (!term) return res.status(StatusCodes.BAD_REQUEST).json(errNoTerm);

    try {
      const user = await searchPizza(term);

    } catch (err: any) {
      const failed = { msg: 'GET: /api/pizzas/search failed', err: err.message };
      return res.status(400).json(failed);
    }
  },

  // GET: /api/pizzas?filter=""
  // GET: /api/pizzas?term=""&filter=""

  create: async function (req: Request, res: Response) {
    console.log(req.body, req.files);
    try {
      // ** use: express-validator
      let {
        name,
        description,
        price,
        rating,
      }: any = req.body;

      // errors
      const errPizzaCreate = { msg: 'create pizza failed', err: 1 };
      console.log('files names', res.locals.files);
      // create user
      price = Number(price);
      rating = Number(rating);
      const user = await createPizza({
        name,
        description,
        price,
        rating,
        image: res.locals.files[0],
      });

      if (!user) return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(errPizzaCreate);

      const success = { msg: 'pizza is created', err: 0 };
      return res.status(StatusCodes.CREATED).json(success);

    } catch (err: any) {
      const failed = { msg: 'POST: /api/pizzas failed', err: err.message };
      return res.status(400).json(failed);
    }
  }
}

export default pizzaController