import express from 'express';

const route = express.Router();
route.get('/', (_, res) => res.json("Working..."));

export const routes = route;
