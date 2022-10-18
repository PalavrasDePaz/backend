import { Router } from 'express';
import { Request, Response } from 'express';
import admin from './services/firebase';

const router: Router = Router();

router.get('/', async (req: Request, res: Response) => {
  const firebaseToken = req.headers.authorization?.split(' ')[1];

  if (!firebaseToken) {
    res.send('Nenhum header encontrado!');
  } else if (!firebaseToken[1]) {
    res.send('Nenhum token encontrado');
  } else {
    // idToken comes from the client app
    await admin
      .auth()
      .verifyIdToken(firebaseToken)
      .then((decodedToken) => {
        //const uid = decodedToken.uid;
        res.json({
          message:
            'Perguntei ao Firebase se seu token é válido e a resposta foi: Sim!'
        });
      })
      .catch((error: any) => {
        res.send(error);
      });
  }
});

export default router;
