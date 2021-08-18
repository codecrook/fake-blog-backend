import express, { json } from 'express';

const app = express();
app.use(json());

const artclesInfo = {
    'learn-react': {
        upvotes: 0,
        comments: []
    },
    'learn-node': {
        upvotes: 0,
        comments: []
    },
    'my-thoughts-on-resume': {
        upvotes: 0,
        comments: []
    }
};

app.get('/hello', (req, res) => res.send('Hello!'));
app.get('/hello/:name', (req, res) => res.send(`Hello, ${req.params.name}!`));
app.post('/hello', (req, res) => res.send(`Hello, ${req.body.name}!`));

//API endpoint for upvoting an article
app.post('/api/articles/:name/upvote', (req, res) => {
    const articleName = req.params.name;
    artclesInfo[articleName].upvotes += 1;

    res.status(200).send(`${articleName} now has ${artclesInfo[articleName].upvotes} upvotes!`);
});

//API endpoint for adding comment on an article
app.post('/api/articles/:name/add-comment', (req, res) => {
    const articleName = req.params.name;
    const { username, text } = req.body;

    artclesInfo[articleName].comments.push({ username, text });

    res.status(200).send(`New comment added for atricle: ${articleName}!`);
});



app.listen(8000, () => console.log('Server Running on Port 8000'));