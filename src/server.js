import express, { json } from 'express';
import { MongoClient } from 'mongodb';

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

//API endpoint to get associated data of an article
app.get('/api/articles/:name', async (req, res) => {
    try {

        const uri = 'mongodb+srv://<auth_details>@cluster0.lk6zp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';
        const client = await MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        const db = client.db('my-blog')

        const articleName = req.params.name;
        const articleInfo = await db.collection('articles').findOne({ name: articleName });
        res.status(200).json(articleInfo);

        client.close();
    } catch (error) {
        res.status(500).json({ message: 'Error in DB connection!', error });
    }

});

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