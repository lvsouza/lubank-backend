import { Router } from 'express';
import { celebrate, Joi } from 'celebrate';

import { CreateUserController } from './controllers';

const route = Router();

route.get('/', (_, res) => res.json("Lubank is working..."));

// Validação do token de acesso
route.use(celebrate({
    headers: Joi.object({
        authorization: Joi.string(),
        email: Joi.string().email({ minDomainSegments: 2 }),
        password: Joi.string()
    })
        .xor('password', 'authorization')
        .with('password', 'email')
        .unknown()
}));

// Rota para criação de usuário
const createUserController = new CreateUserController();
route.post('/api/signup', createUserController.validation, createUserController.execute);

export const routes = route;
