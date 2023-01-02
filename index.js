const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();



// middleware 
app.use(cors())
app.use(express.json())

// mongodb connected
const uri = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@cluster0.i9b8vs8.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const users = client.db('ToDoList').collection('users');
        const tasks = client.db('ToDoList').collection('tasks');

        // create user
        app.post('/users', async (req, res) => {
            const userinfo = req.body;
            const result = await users.insertOne(userinfo);
            res.send(result);
        })

        // task added
        app.post('/tasks', async (req, res) => {
            const taskinfo = req.body;
            const result = await tasks.insertOne(taskinfo);
            res.send(result);
        })

        // own task get
        app.get('/tasks', async (req, res) => {
            const email = req.query.email;
            const result = await tasks.find({ userEmail: email, taskStatus: 'Uncompleted'}).toArray();
            res.send(result);
        })

        // delete task
        app.delete('/tasks/:id', async (req, res) => {
            const id = req.params.id;
            const result = await tasks.deleteOne({ _id: ObjectId(id) });
            res.send(result);
        })

        // update task
        app.put('/tasks/:id', async (req, res) => {
            const id = req.params.id;
            const updatetask = req.body.updateValue;
            const filter = { _id: ObjectId(id) }
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    taskcontent: updatetask
                }
            }

            const result = await tasks.updateOne(filter, updateDoc, options);
            res.send(result);
        })

        //complete task
        app.put('/tasksComplete/:id', async (req, res) => {
            const id = req.params.id;
            const status = req.body.taskStatus;
            const filter = {_id:ObjectId(id)}
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    taskStatus: status
                }
            }
            const result = await tasks.updateOne(filter, updateDoc, options);
            res.send(result);
        })


    }
    finally { }
}
run().catch(error => console.log(error))

app.get('/', (req, res) => {
    res.send('to do list server is running...')
})
app.listen(port, (req, res) => console.log('to do list server is running..'))