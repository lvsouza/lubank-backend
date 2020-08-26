import express from 'express';

const route = express.Router();
route.get('/', (_, res) => res.json("Lubank is working..."));

export const routes = route;
