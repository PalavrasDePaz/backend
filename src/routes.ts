import { Router } from 'express';
import { Request, Response } from 'express';

const router: Router = Router();

router.get('/', async (req: Request, res: Response) => {
  res.send('Hello World Palavras de Paz!');
});

export default router;
