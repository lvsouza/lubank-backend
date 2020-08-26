import express from 'express';

const app = express();

app.get('/', () => {
    console.log('Hello');
});

app.listen(3333);
