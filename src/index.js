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

if (!localStorage.getItem("list")) {
  console.log("in creating");
  console.log("create new list");
  list.work.push(
    toDo.createTask(
      "Complete Project Report",
      "Prepare the final report for the project",
      "high",
      "2024-12-01",
      false
    )
  );
  list.home.push(
    toDo.createTask(
      "Clean Living Room",
      "Organize and vacuum the living room",
      "low",
      "2024-12-03",
      false
    )
  );
  list.today.push(
    toDo.createTask(
      "Review Meeting Notes",
      "Go through the notes from today's meeting",
      "medium",
      "2024-11-28",
      false
    )
  );
  list.today.push(
    toDo.createTask(
      "Submit Assignment",
      "Submit the math assignment online",
      "high",
      "2024-11-28",
      false
    )
  );

  list.gym.push(
    toDo.createTask(
      "Morning Workout",
      "Complete 30 minutes of cardio and strength training",
      "medium",
      "2024-11-29",
      false
    )
  );
  list.gym.push(
    toDo.createTask(
      "Yoga Session",
      "Attend evening yoga class at the gym",
      "low",
      "2024-12-01",
      false
    )
  );
  list.study.push(
    toDo.createTask(
      "Complete Reading Assignment",
      "Read Chapter 5 of the textbook",
      "high",
      "2024-11-30",
      false
    )
  );
  list.study.push(
    toDo.createTask(
      "Practice Coding",
      "Solve 5 problems on LeetCode",
      "high",
      "2024-11-29",
      false
    )
  );
}

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
