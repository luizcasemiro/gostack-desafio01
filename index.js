const express = require("express");

const server = express();

const projects = [];
let reqCounter = 0;

server.use(express.json());

server.use((req, res, next) => {
  reqCounter++;
  console.log(
    `Requisição ${reqCounter} - METHOD: ${req.method} - URL: ${req.url}`
  );
  next();
});

const projectIdIsValid = (req, res, next) => {
  const { id } = req.params;
  const index = projects.findIndex(project => project.id === id);
  if (!projects[index]) {
    return res.status(400).json({ error: "Project does not found" });
  }
  return next();
};

server.post("/projects", (req, res) => {
  const { id, title } = req.body;
  const project = { id: String(id), title: String(title), tasks: [] };
  projects.push(project);
  return res.json(project);
});

server.post("/projects/:id/tasks", projectIdIsValid, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  const index = projects.findIndex(project => project.id === id);
  projects[index] = {
    ...projects[index],
    tasks: [...projects[index].tasks, title]
  };
  return res.json(projects[index]);
});

server.get("/projects", (req, res) => {
  return res.json(projects);
});

server.put("/projects/:id", projectIdIsValid, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  const index = projects.findIndex(project => project.id === id);
  projects[index] = { ...projects[index], title: String(title) };
  return res.json(projects[index]);
});

server.delete("/projects/:id", projectIdIsValid, (req, res) => {
  const { id } = req.params;
  const index = projects.findIndex(project => project.id === id);
  projects.splice(index, 1);
  return res.send();
});

server.listen(3000);
