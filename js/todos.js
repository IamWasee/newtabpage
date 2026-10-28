import { load, save } from "./storage.js";

let todos = load("todos", []);

const list = document.getElementById("todos");
const count = document.getElementById("todo-count");
const form = document.getElementById("todo-form");

function commit() {
  save("todos", todos);
  render();
}

function render() {
  list.replaceChildren();

  if (todos.length === 0) {
    const empty = document.createElement("li");
    empty.className = "empty";
    empty.textContent = "Nothing yet. Enjoy the quiet.";
    list.append(empty);
  }

  for (const todo of todos) {
    const li = document.createElement("li");
    li.classList.toggle("done", todo.done);

    const box = document.createElement("input");
    box.type = "checkbox";
    box.checked = todo.done;
    box.setAttribute("aria-label", `Mark "${todo.text}" done`);
    box.addEventListener("change", () => {
      todo.done = box.checked;
      commit();
    });

    const text = document.createElement("span");
    text.className = "text";
    text.textContent = todo.text;

    const del = document.createElement("button");
    del.className = "del";
    del.type = "button";
    del.textContent = "×";
    del.setAttribute("aria-label", `Delete "${todo.text}"`);
    del.addEventListener("click", () => {
      todos = todos.filter((t) => t.id !== todo.id);
      commit();
    });

    li.append(box, text, del);
    list.append(li);
  }

  const left = todos.filter((t) => !t.done).length;
  count.textContent = todos.length ? `${left} left` : "";
}

export function initTodos() {
  form.addEventListener("submit", (e) => {
    e.preventDefault(); // stop the browser from reloading the page
    const text = form.text.value.trim();
    if (!text) return;
    todos.push({ id: crypto.randomUUID(), text, done: false });
    form.reset();
    commit();
  });
  render();
}
