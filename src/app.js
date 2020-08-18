const express = require("express");
const cors = require("cors");

const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const validateId = (request, response, next) => {
  const {id} = request.params;
  if(!isUuid(id)){
    return response.status(400).json({message: 'Invalid Id'})
  }
  return next();
}

app.use('/repositories/:id', validateId)

const repositories = [];

app.get("/repositories", (request, response) => {
  response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const {title, url, techs,} = request.body;

  const newRepository = {
    id: uuid(),
    title,
    url,
    techs,
  }

  repositories.push(newRepository);

  response.status(201).json(newRepository);
});

app.put("/repositories/:id", (request, response) => {
  const {id} = request.params;
  const {title, url, techs,} = request.body;
  const repositoryIndex = repositories.findIndex(repository => repository.id === id);
  
  if(repositoryIndex < 0){
    return response.status(400).json({message: 'Repository not found'});
  }

  repositories[repositoryIndex]={
    id,
    title,
    url,
    techs,
  }

  return response.json(repositories[repositoryIndex]);
});

app.delete("/repositories/:id", (request, response) => {
  const {id} = request.params;
  const repositoryIndex = repositories.findIndex(repository => repository.id === id);
  if(repositoryIndex < 0){
    return response.status(400).json({message: 'Repository not found'});
  }

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
  
});

app.post("/repositories/:id/like", (request, response) => {
  // TODO
});

module.exports = app;
