require('dotenv/config');

import compression from 'compression';
import { errors } from 'celebrate';
import express from 'express';
import cors from 'cors';

import { routes } from './routes';

const app = express();

app.use(cors());
app.use(compression());

app.use(express.json());
app.use(routes);

app.use(errors());

app.listen(process.env.PORT || 3333);

console.log(`Server is running in port: ${process.env.PORT || 3333}...`);
