import express, { json } from 'express';

const app = express();
app.use(json());

app.get('/hello', (req, res) => res.send('Hello!'));
app.get('/hello/:name', (req, res) => res.send(`Hello, ${req.params.name}!`));
app.post('/hello', (req, res) => res.send(`Hello, ${req.body.name}!`));



app.listen(8000, () => console.log('Server Running on Port 8000'));