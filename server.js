// load environment variables from the .env file
require("dotenv").config();

// import dependencies
const express = require("express");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");

// initialize app and prisma client
const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

// get all the tasks
app.get("/tasks", async (req, res) => {
  try {
    const tasks = await prisma.task.findMany();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// add a new task
app.post("/tasks", async (req, res) => {
  const { text } = req.body;
  try {
    const newTask = await prisma.task.create({
      data: {
        text,
      },
    });
    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// update a task
app.patch("/tasks/:id", async (req, res) => {
  const { id } = req.params;
  const { completed } = req.body;
  try {
    const updatedTask = await prisma.task.update({
      where: { id },
      data: { completed },
    });
    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// delete a task
app.delete("/tasks/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.task.delete({
      where: { id },
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
