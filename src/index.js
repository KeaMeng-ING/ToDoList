import { domManipulator, toDosManager } from "./todolist";
// import { format } from "date-fns";
import "./styles.css";
// import { projects } from "./todolist";

const dom = domManipulator();
const toDo = toDosManager();

const listContainer = document.querySelector(".list-container");

const list = JSON.parse(localStorage.getItem("list")) || {
  home: [],
  today: [],
  week: [],
  gym: [],
  study: [],
  work: [],
};

// function cleanList(list) {
//   for (let key in list) {
//     if (list[key] == null || list[key].length === 0) {
//       delete list[key];
//     }
//   }
// }

// // Clean the list before rendering
// cleanList(list);

// console.log(list);

// localStorage.clear();

if (!localStorage.getItem("list")) {
  console.log("in creating");
  console.log("create new list");
  list.work.push(
    toDo.createTask(
      "Home Task 1",
      "Description for Home Task 1",
      "low",
      "2024-10-09",
      true
    )
  );
  list.home.push(
    toDo.createTask(
      "Home Task 2",
      "Description for Home Task 2",
      "medium",
      "2024-11-09",
      true
    )
  );
  list.today.push(
    toDo.createTask(
      "Today Task 1",
      "Description for Today Task 1",
      "high",
      "2024-10-09"
    )
  );
  list.today.push(
    toDo.createTask(
      "Today Task 2",
      "Description for Today Task 2",
      "medium",
      "2024-11-09"
    )
  );
}

// localStorage.clear();

// Render Project EERIR
dom.renderProject(list);
console.log(list);
dom.renderAllToDos(list);
dom.renderNumProject(list);

let navItems = document.querySelectorAll(".nav-item");
navItems.forEach((navItem) => {
  navItem.addEventListener("click", () => {
    navItems.forEach((navItem) => navItem.classList.remove("nav_selected"));
    navItem.classList.add("nav_selected");

    const projectNameSpan = navItem.querySelector(".project-name");
    const projectName = projectNameSpan.textContent.toLowerCase();
    listContainer.textContent = "";

    if (
      projectName === "home" ||
      (list[projectName] && list[projectName].length > 0)
    ) {
      listContainer.classList.remove("no-task");
      console.log("in home", list);
      console.log(projectName);
      const tasks = projectName === "home" ? list : list[projectName];
      console.log(tasks);
      dom.renderAllToDos(tasks, list);
    } else {
      console.log("in else", list);
      localStorage.setItem("list", JSON.stringify(list));
      dom.renderEmptyProject(listContainer, list);
    }
  });
});

const addTask = document.querySelector(".add-btn");
addTask.addEventListener("click", () => {
  dom.renderForm(list);
});
