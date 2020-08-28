import { Router } from 'express';

const route = Router();
route.get('/', (_, res) => res.json("Lubank is working..."));

export const routes = route;
