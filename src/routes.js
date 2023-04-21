import { randomUUID } from "node:crypto";
import { Database } from "./database.js";
import { buildRoutePath } from "./utils/build-route-path.js";

const database = new Database();

export const routes = [
  {
    method: "GET",
    path: buildRoutePath("/tasks"),
    handler: (req, res) => {
      const { search } = req.query;

      const tasks = database.select(
        "tasks",
        search
          ? {
              title: search,
              description: search,
            }
          : null
      );

      return res.end(JSON.stringify(tasks));
    },
  },
  {
    method: "POST",
    path: buildRoutePath("/tasks"),
    handler: (req, res) => {
      const { title, description } = req.body;
      console.log(title, description);

      const task = {
        id: randomUUID(),
        title,
        description,
        completed_at: null,
        created_at: new Date(),
        updated_at: new Date(),
      };

      database.insert("tasks", task);

      return res.writeHead(201).end();
    },
  },
  {
    method: "PUT",
    path: buildRoutePath("/tasks/:id"),
    handler: (req, res) => {
      const { id } = req.params;
      const { title, description } = req.body;

      const task = database.exists("tasks", id);

      if (!task) {
        return res.writeHead(404).end("task not found");
      }

      task.title = title || task.title;
      task.description = description || task.description;
      task.updated_at = new Date();

      database.update("tasks", id, task);

      return res.writeHead(204).end();
    },
  },
  {
    method: "PUT",
    path: buildRoutePath("/tasks/:id/complete"),
    handler: (req, res) => {
      const { id } = req.params;

      const task = database.exists("tasks", id);

      if (!task) {
        return res.writeHead(404).end("task not found");
      }

      task.completed_at = task.completed_at ? null : new Date();

      console.log("ATUALIZANNNNNNN");

      database.update("tasks", id, task);

      return res.writeHead(204).end();
    },
  },
  {
    method: "DELETE",
    path: buildRoutePath("/tasks/:id"),
    handler: (req, res) => {
      const { id } = req.params;

      const task = database.exists("tasks", id);

      if (!task) {
        return res.writeHead(404).end("task not found");
      }

      database.delete("tasks", id);

      return res.writeHead(204).end();
    },
  },
];
