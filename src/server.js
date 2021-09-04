import express, { json } from 'express';
import { MongoClient } from 'mongodb';

const app = express();
app.use(json());

const withDB = async (operations, res) => {
    try {

        const uri = 'mongodb+srv://<auth_details>@cluster0.lk6zp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';
        const client = await MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        const db = client.db('my-blog');

        await operations(db);

        client.close();
    } catch (error) {
        res.status(500).json({ message: 'Error in DB connection!', error });
    }
};


//API endpoint to get associated data of an article
app.get('/api/articles/:name', async (req, res) => {
    withDB(async (db) => {
        const articleName = req.params.name;
        const articleInfo = await db.collection('articles').findOne({ name: articleName });

        res.status(200).json(articleInfo);
    }, res);
});

//API endpoint for upvoting an article
app.post('/api/articles/:name/upvote', (req, res) => {
    withDB(async (db) => {
        const articleName = req.params.name;
        const articleInfo = await db.collection('articles').findOne({ name: articleName });

        await db.collection('articles').updateOne({ name: articleName }, {
            '$set': {
                upvotes: articleInfo.upvotes + 1
            }
        });

        const updatedArticleInfo = await db.collection('articles').findOne({ name: articleName });

        res.status(200).json(updatedArticleInfo);
    }, res);
});

//API endpoint for adding comment on an article
app.post('/api/articles/:name/add-comment', (req, res) => {
    withDB(async (db) => {
        const articleName = req.params.name;
        const { username, text } = req.body;

        const articleInfo = await db.collection('articles').findOne({ name: articleName });

        await db.collection('articles').updateOne({ name: articleName }, {
            '$set': {
                comments: articleInfo.comments.concat({ username, text })
            }
        });

        const updatedArticleInfo = await db.collection('articles').findOne({ name: articleName });
        res.status(200).json(updatedArticleInfo);
    }, res);
});



app.listen(8000, () => console.log('Server Running on Port 8000'));