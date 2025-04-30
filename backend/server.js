const db = require('./db');
const express = require('express');
const cors = require('cors');
const app = express();
app.use(express.json());
const Person = require('./models/person')
const Allfield = require('./models/fields')
require("dotenv").config();
const path = require('path');

// Serve static files from the frontend build folder
app.use(express.static(path.join(__dirname, 'client/dist')));

// For any route not handled by the API, send back index.html (for React Router)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/dist', 'index.html'));
});


app.use(cors({ 
    origin:'https://todo-frontend-umber-tau.vercel.app',
    credentials: true
  }));



//////////////////////////// registration 
app.post('/registration', async (req, res) => {


    try {
        const { name, username, password } = req.body;
        console.log("Received:", { name, username, password });
        const findusername = await Person.findOne({ username: username });
        if (findusername) {
            return res.status(409).json({ message: "username already exist" });

        }
        const newPerson = new Person({ name, username, password });
        await newPerson.save();
        res.status(200).json({ message: "Registration successfull" });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: "internal server error" });
    }


})

////////////////////////////////////////login
app.post("/", async (req, res) => {
    const { username, password } = req.body;
    try {
        const personusername = await Person.findOne({ username: username })
        if (!personusername) {
            return res.status(404).json({ message: "invalid username" })
        }
        const passwordmatch = await personusername.comparepassword(password);
        if (!passwordmatch) {
            return res.status(409).json({ message: "password incorrect" });
        }
        res.status(200).json({ message: "login successfully" })
    }
    catch (error) {
        res.status(500).json({ error: "internal server error" })
    }

})

/////////////////// add field into mongodb
app.post('/field', async (req, res) => {
    const { username, tasks } = req.body;

    try {
        // Check if user already has a task list
        const userTasks = await Allfield.findOne({ username });

        if (userTasks) {
            // Agar user ke paas tasks already hain toh naye tasks ko add karo
            await Allfield.updateOne({ username }, { $push: { tasks: { $each: tasks } } });
            res.status(200).json({ message: "Task added to existing list" });
        } else {
            // Pehli baar user hai
            const newTask = new Allfield({ username, tasks });
            await newTask.save();
            res.status(201).json({ message: "Task added to new list" });
        }
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});

//////////////// get all tasks
app.get('/field', async (req, res) => {
    const { username } = req.query;

    if (!username) {
        return res.status(400).json({ error: "Username is required" });
    }

    try {
        const userTasks = await Allfield.findOne({ username });

        if (!userTasks) {
            return res.status(404).json({ tasks: [] });  // Agar tasks nahi hain toh empty array bhejo
        }

        res.status(200).json({ tasks: userTasks.tasks });  // Bas tasks ko return karo
    } catch (error) {
        console.error("Error fetching tasks:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

////////////// delete  one task
app.delete('/field', async (req, res) => {
    const { username, taskText } = req.body;

    if (!username || !taskText) {
        return res.status(400).json({ error: "Username and task text are required" });
    }

    try {
        // Find the user's task list
        const userTasks = await Allfield.findOne({ username });

        if (!userTasks) {
            return res.status(404).json({ message: "No tasks found for this user" });
        }

        // Find the index of the task to delete
        const taskIndex = userTasks.tasks.findIndex(task => task.text === taskText);

        if (taskIndex === -1) {
            return res.status(404).json({ message: "Task not found" });
        }

        // Remove the task from the list
        userTasks.tasks.splice(taskIndex, 1);

        // Save the updated task list
        await userTasks.save();

        res.status(200).json({ message: "Task deleted successfully" });
    } catch (error) {
        console.error("Error deleting task:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});


// to tick the all compltetd task
app.put('/field/update-task', async (req, res) => {
    const { username, taskText, completed } = req.body;

    if (!username || !taskText) {
        return res.status(400).json({ error: "Username and task text are required" });
    }

    try {
        // Find the user's task list
        const userTasks = await Allfield.findOne({ username });

        if (!userTasks) {
            return res.status(404).json({ message: "No tasks found for this user" });
        }

        // Find the task to update
        const task = userTasks.tasks.find(task => task.text === taskText);

        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        // Update the completion status
        task.completed = completed;

        // Save the updated task list
        await userTasks.save();

        res.status(200).json({ message: "Task completion status updated successfully" });
    } catch (error) {
        console.error("Error updating task:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});


const PORT=process.env.PORT ;
app.listen(PORT, () => {
    console.log("server is connected on port 3000");

})