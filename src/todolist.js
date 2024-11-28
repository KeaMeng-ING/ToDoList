import { format } from "date-fns";
import deleteIcon from "./assets/deleteIcon.svg";
import editIcon from "./assets/editIcon.svg";

export const domManipulator = function () {
  // Display Each ToDo
  function displayToDo(lists, allList = {}) {
    // console.log("in displayToDo");
    console.log(lists);

    // Query the main Container
    const listContainer = document.querySelector(".list-container");

    lists.forEach((list) => {
      // Each List Div
      const listBox = document.createElement("div");
      listBox.classList.add("list-box");
      listBox.classList.add(list.priority);

      const iconContainer = document.createElement("div");
      iconContainer.classList.add("icon-container");

      // Div that contain all the element such as text and icon
      const listElement = document.createElement("div");
      listElement.classList.add("list");

      const detailButton = document.createElement("button");
      detailButton.textContent = "Details";
      detailButton.classList.add("detail-btn");
      detailButton.addEventListener("click", () => {
        renderDetail(list);
      });

      const textContainer = document.createElement("div");
      textContainer.classList.add("text-container");

      const title = document.createElement("p");
      title.classList.add("list-title");
      title.textContent = list.title;

      // Make Date Config
      const date = document.createElement("p");
      // console.log(list.dueDate);
      const dateObject = new Date(list.dueDate);
      const dateMonth = format(dateObject, "MMM");
      const dateDay = format(dateObject, "do");
      date.textContent = `${dateMonth} ${dateDay}`;
      date.classList.add("list-date");

      const deleteButton = document.createElement("button");
      deleteButton.classList.add("svg-btn", "delete-btn");
      deleteButton.innerHTML = `<img src="${deleteIcon}" alt="Delete Icon">`;

      const editButton = document.createElement("button");
      editButton.classList.add("svg-btn", "edit-btn");
      editButton.innerHTML = `<img src="${editIcon}" alt="Edit Icon" >`;
      editButton.addEventListener("click", () => {
        editList(list, title, date, listBox);
      });

      const checkBox = document.createElement("input");
      checkBox.type = "checkbox";
      if (list.checked) {
        checkBox.checked = true;
        title.classList.add("title-checked");
        date.classList.add("date-checked");
        detailButton.classList.add("detail-checked");
        editButton.classList.add("edit-checked");
        deleteButton.classList.add("delete-checked");
      }
      checkBox.addEventListener("change", () => {
        const isChecked = checkBox.checked;
        title.classList.toggle("title-checked", isChecked);
        date.classList.toggle("date-checked", isChecked);
        detailButton.classList.toggle("detail-checked", isChecked);
        editButton.classList.toggle("edit-checked", isChecked);
        deleteButton.classList.toggle("delete-checked", isChecked);
        list.checked = isChecked;
        localStorage.setItem("list", JSON.stringify(allList));
      });

      textContainer.appendChild(checkBox);
      textContainer.appendChild(title);
      listElement.appendChild(textContainer);
      iconContainer.appendChild(detailButton);
      iconContainer.appendChild(date);
      iconContainer.appendChild(editButton);
      iconContainer.appendChild(deleteButton);
      listBox.appendChild(listElement);
      listElement.appendChild(iconContainer);
      listContainer.appendChild(listBox);
    });
  }

  // Render the detail of each todo
  const renderDetail = function (list) {
    const overlay = document.querySelector(".detail_overlay");
    overlay.classList.add("overlay_active");
    const detailContainer = document.querySelector(".detail-dialog");
    detailContainer.showModal();
    detailContainer.textContent = "";

    const detailBox = document.createElement("div");
    detailBox.classList.add("detail-box");

    const title = document.createElement("h2");
    title.classList.add("detail-title");
    title.textContent = list.title;

    const detailDescription = document.createElement("div");
    detailDescription.classList.add("detail-description");
    const descriptionTitle = document.createElement("h3");
    descriptionTitle.textContent = "Description: ";
    const descriptions = document.createElement("p");
    descriptions.textContent = list.description;
    detailDescription.appendChild(descriptionTitle);
    detailDescription.appendChild(descriptions);

    const detailPriority = document.createElement("div");
    detailPriority.classList.add("detail-priority");
    const priorityTitle = document.createElement("h3");
    priorityTitle.textContent = "Priority: ";
    const priority = document.createElement("p");
    priority.textContent = list.priority;
    detailPriority.appendChild(priorityTitle);
    detailPriority.appendChild(priority);

    const detailDueDate = document.createElement("div");
    detailDueDate.classList.add("detail-due-date");
    const dueDateTitle = document.createElement("h3");
    dueDateTitle.textContent = "Due Date: ";
    const dueDate = document.createElement("p");
    dueDate.textContent = list.dueDate;
    detailDueDate.appendChild(dueDateTitle);
    detailDueDate.appendChild(dueDate);

    const closeButton = document.createElement("button");
    closeButton.classList.add("close-btn");
    closeButton.innerHTML = "&times;";
    closeButton.addEventListener("click", () => {
      detailContainer.close();
      overlay.classList.remove("overlay_active");
    });

    const titleContainer = document.createElement("div");
    titleContainer.classList.add("title-container");
    titleContainer.appendChild(title);
    titleContainer.appendChild(closeButton);

    detailBox.appendChild(titleContainer);
    detailBox.appendChild(detailDescription);
    detailBox.appendChild(detailPriority);
    detailBox.appendChild(detailDueDate);

    detailContainer.appendChild(detailBox);
  };

  // Display all ToDos and attach delete, Edit event listener
  function renderAllToDos(list, allList = {}) {
    const listArray = Object.values(list).flat();

    // Sort it based on the date
    listArray.sort((a, b) => {
      return new Date(a.dueDate) - new Date(b.dueDate);
    });

    if (toDosManager().getCurrentProject() === "home") {
      displayToDo(listArray, list);
    } else {
      displayToDo(listArray, allList);
    }

    toDosManager().attachDeleteEventListeners(list, allList);
    localStorage.setItem("list", JSON.stringify(list));

    if (Object.keys(allList).length !== 0) {
      localStorage.setItem("list", JSON.stringify(allList));
    }
  }

  // Render when add new todo
  function renderAdd(list) {
    const addDialog = document.querySelector(".add-dialog");

    const addForm = document.querySelector("#add-list");

    const contentDiv = document.createElement("div");
    contentDiv.className = "add-content";

    const textAreaDiv = document.createElement("div");
    textAreaDiv.className = "text-area";

    const titleInput = document.createElement("input");
    titleInput.type = "text";
    titleInput.name = "title";
    titleInput.placeholder = "Title: Pay bills";
    titleInput.required = true;
    titleInput.className = "add-title";

    const descriptionTextarea = document.createElement("textarea");
    descriptionTextarea.name = "description";
    descriptionTextarea.className = "add-description";
    descriptionTextarea.placeholder = "Details: rent, electricity, water bills";

    textAreaDiv.appendChild(titleInput);
    textAreaDiv.appendChild(document.createElement("br"));
    textAreaDiv.appendChild(descriptionTextarea);
    textAreaDiv.appendChild(document.createElement("br"));
    contentDiv.appendChild(textAreaDiv);

    const detailInputDiv = document.createElement("div");
    detailInputDiv.className = "detail-input";

    // Add due date
    const dueDateDiv = document.createElement("div");
    dueDateDiv.className = "add-dueDate";

    const dueDateLabel = document.createElement("label");
    dueDateLabel.setAttribute("for", "due-date");
    dueDateLabel.textContent = "Due Date: ";

    const dueDateInput = document.createElement("input");
    dueDateInput.type = "date";
    dueDateInput.id = "due-date";
    dueDateInput.placeholder = "DD/MM/YYYY";
    dueDateInput.required = true;

    dueDateDiv.appendChild(dueDateLabel);
    dueDateDiv.appendChild(dueDateInput);
    detailInputDiv.appendChild(dueDateDiv);
    detailInputDiv.appendChild(document.createElement("br"));

    // Add priority
    const submitDiv = document.createElement("div");
    submitDiv.className = "submit-div";

    const priorityDiv = document.createElement("div");
    priorityDiv.className = "add-priority";

    const priorityLabel = document.createElement("label");
    priorityLabel.setAttribute("for", "priority");
    priorityLabel.textContent = "Priority: ";

    const priorityButtonsDiv = document.createElement("div");
    priorityButtonsDiv.className = "priority-buttons";

    const lowPriorityInput = document.createElement("input");
    lowPriorityInput.type = "radio";
    lowPriorityInput.id = "low-priority";
    lowPriorityInput.name = "priority";
    lowPriorityInput.value = "low";
    lowPriorityInput.required = true;

    const lowPriorityLabel = document.createElement("label");
    lowPriorityLabel.setAttribute("for", "low-priority");
    lowPriorityLabel.className = "priority-low";
    lowPriorityLabel.textContent = "Low";

    const mediumPriorityInput = document.createElement("input");
    mediumPriorityInput.type = "radio";
    mediumPriorityInput.id = "medium-priority";
    mediumPriorityInput.name = "priority";
    mediumPriorityInput.value = "medium";
    mediumPriorityInput.required = true;

    const mediumPriorityLabel = document.createElement("label");
    mediumPriorityLabel.setAttribute("for", "medium-priority");
    mediumPriorityLabel.className = "priority-medium";
    mediumPriorityLabel.textContent = "Medium";

    const highPriorityInput = document.createElement("input");
    highPriorityInput.type = "radio";
    highPriorityInput.id = "high-priority";
    highPriorityInput.name = "priority";
    highPriorityInput.value = "high";
    highPriorityInput.required = true;

    const highPriorityLabel = document.createElement("label");
    highPriorityLabel.setAttribute("for", "high-priority");
    highPriorityLabel.className = "priority-high";
    highPriorityLabel.textContent = "High";

    priorityButtonsDiv.appendChild(lowPriorityInput);
    priorityButtonsDiv.appendChild(lowPriorityLabel);
    priorityButtonsDiv.appendChild(mediumPriorityInput);
    priorityButtonsDiv.appendChild(mediumPriorityLabel);
    priorityButtonsDiv.appendChild(highPriorityInput);
    priorityButtonsDiv.appendChild(highPriorityLabel);

    const submitButton = document.createElement("button");
    submitButton.type = "submit";
    submitButton.className = "add-task";
    submitButton.textContent = "Add To Do";

    priorityDiv.appendChild(priorityLabel);
    priorityDiv.appendChild(priorityButtonsDiv);
    submitDiv.appendChild(priorityDiv);
    submitDiv.appendChild(submitButton);
    detailInputDiv.appendChild(submitDiv);

    // Add submit button

    contentDiv.appendChild(detailInputDiv);
    addForm.appendChild(contentDiv);

    // Append form to the body or a specific container

    const overlay = document.querySelector(".add_overlay");
    overlay.classList.add("overlay_active");

    addDialog.appendChild(addForm);
    addDialog.showModal();

    addForm.addEventListener("submit", (event) => {
      // console.log("in submit");
      event.preventDefault();
      const title = addForm.elements["title"].value;
      const description = addForm.elements["description"].value;
      const priority = addForm.elements["priority"].value;
      const dueDate = addForm.elements["due-date"].value;

      const project = toDosManager().getCurrentProject();

      list[project].push(
        toDosManager().createTask(title, description, priority, dueDate)
      );

      closeAddDialog();
      overlay.classList.add("overlay_active");

      // Display and need all list to renderNumProject
      const listContainer = document.querySelector(".list-container");
      listContainer.textContent = "";
      listContainer.classList.remove("no-task");
      renderAllToDos(list[project]);
      renderNumProject(list);
      localStorage.setItem("list", JSON.stringify(list));
    });
  }

  // Render to display each project
  function renderProject(list) {
    const projectsObject = Object.assign({}, list);
    delete projectsObject.home;
    delete projectsObject.today;
    delete projectsObject.week;
    console.log(projectsObject);

    const projectContainer = document.querySelector(".projects");
    for (let project in projectsObject) {
      const projectBox = document.createElement("li");
      projectBox.classList.add("nav-item");

      const projectSpan = document.createElement("span");
      projectSpan.classList.add("nav-text");
      projectSpan.classList.add("project-name");
      projectSpan.textContent =
        project.charAt(0).toUpperCase() + project.slice(1);

      const projectCount = document.createElement("span");
      projectCount.classList.add("nav-text");

      projectBox.appendChild(projectSpan);
      projectBox.appendChild(projectCount);
      projectContainer.appendChild(projectBox);
    }
  }

  // Render the form to add new project
  const renderAddProject = function (list) {
    const addForm = document.querySelector("#add-list");
    const contentDiv = document.createElement("div");
    contentDiv.className = "add-project-div";

    const titleInput = document.createElement("input");
    titleInput.type = "text";
    titleInput.name = "title";
    titleInput.placeholder = "Title: Pay bills";
    titleInput.required = true;
    titleInput.className = "add-title";

    const submitButton = document.createElement("button");
    submitButton.type = "submit";
    submitButton.className = "add-project";
    submitButton.textContent = "Add Project";

    contentDiv.appendChild(titleInput);
    contentDiv.appendChild(submitButton);
    addForm.appendChild(contentDiv);

    submitButton.addEventListener("click", (event) => {
      event.preventDefault();
      const title = addForm.elements["title"].value;

      if (list[title.toLowerCase()]) {
        return;
      }
      list[title.toLowerCase()] = [];
      closeAddDialog();
      localStorage.setItem("list", JSON.stringify(list));
      location.reload();
    });
  };

  // Render the form to add new project or todo
  const renderForm = function (list) {
    const addDialog = document.querySelector(".add-dialog");
    addDialog.style.display = "grid";
    const addForm = document.querySelector("#add-list");
    addRenderHeaderNav();
    addForm.textContent = "";
    renderAdd(list);

    const addDialogNav = document.querySelectorAll(".add-nav-element");
    addDialogNav.forEach((nav) => {
      nav.addEventListener("click", () => {
        addDialogNav.forEach((navItem) =>
          navItem.classList.remove("add-nav-selected")
        );
        nav.classList.add("add-nav-selected");

        addForm.textContent = "";
        if (nav.textContent == "To Do") {
          renderAdd(list);
        } else {
          renderAddProject(list);
        }
      });
    });
  };

  // Render the count number of each project
  function renderNumProject(list) {
    console.log(list);
    const projectName = document.querySelectorAll(".project-name");

    for (let i = 0; i < projectName.length; i++) {
      const project = projectName[i].textContent.toLowerCase();
      if (project === "home") {
        const listArray = Object.values(list).flat();
        projectName[i].nextElementSibling.textContent = listArray.length;
        projectName[i].nextElementSibling.classList.add("project-count");
        continue;
      } else if (list[project]) {
        projectName[i].nextElementSibling.textContent = list[project].length;
        projectName[i].nextElementSibling.classList.add("project-count");
      }
    }
  }

  function renderEmptyProject(display, list) {
    display.classList.add("no-task");

    const emptyProject = document.createElement("div");
    emptyProject.textContent = "Empty Project!";
    emptyProject.classList.add("no-task-header");

    const emptyProjectText = document.createElement("div");
    emptyProjectText.textContent = "Create a new to-do item or delete project.";
    emptyProjectText.classList.add("no-task-text");

    const emptyProjectButton = document.createElement("button");
    emptyProjectButton.textContent = "Delete Project";
    emptyProjectButton.classList.add("no-task-button");
    emptyProjectButton.addEventListener("click", () => {
      toDosManager().deleteProject(display, list);
    });

    display.appendChild(emptyProject);
    display.appendChild(emptyProjectText);
    display.appendChild(emptyProjectButton);
  }

  const editList = function (list, titles, date, listBox) {
    const overlay = document.querySelector(".edit_overlay");
    overlay.classList.add("overlay_active");
    const editDialog = document.querySelector(".edit-dialog");
    editDialog.showModal();
    const editHeader = document.createElement("div");
    editHeader.className = "editHeader";
    const editForm = document.querySelector("#edit-list");

    const editTitle = document.createElement("input");
    editTitle.type = "text";
    editTitle.name = "title";
    editTitle.className = "edit_name";
    editTitle.value = titles.textContent;

    const closeButton = document.createElement("button");
    closeButton.classList.add("edit-close-btn");
    closeButton.innerHTML = "&times;";
    closeButton.addEventListener("click", () => {
      editDialog.close();
      closeButton.remove();
      editForm.textContent = "";
      overlay.classList.remove("overlay_active");
    });

    editHeader.appendChild(editTitle);
    editHeader.appendChild(closeButton);
    editForm.appendChild(editHeader);

    const editDescription = document.createElement("textarea");
    editDescription.name = "description";
    editDescription.className = "edit_description";
    editDescription.value = list.description;

    editForm.appendChild(editDescription);

    const detailInputDiv = document.createElement("div");
    detailInputDiv.className = "detail-input";

    // Add due date
    const dueDateDiv = document.createElement("div");
    dueDateDiv.className = "add-dueDate";

    const dueDateLabel = document.createElement("label");
    dueDateLabel.setAttribute("for", "due-date");
    dueDateLabel.textContent = "Due Date: ";

    const dueDateInput = document.createElement("input");
    dueDateInput.type = "date";
    dueDateInput.id = "due-date";
    dueDateInput.placeholder = "DD/MM/YYYY";
    dueDateInput.required = true;

    dueDateDiv.appendChild(dueDateLabel);
    dueDateDiv.appendChild(dueDateInput);
    detailInputDiv.appendChild(dueDateDiv);
    detailInputDiv.appendChild(document.createElement("br"));

    editForm.appendChild(detailInputDiv);

    const submitDiv = document.createElement("div");
    submitDiv.className = "submit-div";

    const priorityDiv = document.createElement("div");
    priorityDiv.className = "add-priority";

    const priorityLabel = document.createElement("label");
    priorityLabel.setAttribute("for", "priority");
    priorityLabel.textContent = "Priority: ";

    const priorityButtonsDiv = document.createElement("div");
    priorityButtonsDiv.className = "priority-buttons";

    const lowPriorityInput = document.createElement("input");
    lowPriorityInput.type = "radio";
    lowPriorityInput.id = "low-priority";
    lowPriorityInput.name = "priority";
    lowPriorityInput.value = "low";
    lowPriorityInput.required = true;

    const lowPriorityLabel = document.createElement("label");
    lowPriorityLabel.setAttribute("for", "low-priority");
    lowPriorityLabel.className = "priority-low";
    lowPriorityLabel.textContent = "Low";

    const mediumPriorityInput = document.createElement("input");
    mediumPriorityInput.type = "radio";
    mediumPriorityInput.id = "medium-priority";
    mediumPriorityInput.name = "priority";
    mediumPriorityInput.value = "medium";
    mediumPriorityInput.required = true;

    const mediumPriorityLabel = document.createElement("label");
    mediumPriorityLabel.setAttribute("for", "medium-priority");
    mediumPriorityLabel.className = "priority-medium";
    mediumPriorityLabel.textContent = "Medium";

    const highPriorityInput = document.createElement("input");
    highPriorityInput.type = "radio";
    highPriorityInput.id = "high-priority";
    highPriorityInput.name = "priority";
    highPriorityInput.value = "high";
    highPriorityInput.required = true;

    const highPriorityLabel = document.createElement("label");
    highPriorityLabel.setAttribute("for", "high-priority");
    highPriorityLabel.className = "priority-high";
    highPriorityLabel.textContent = "High";

    priorityDiv.appendChild(priorityLabel);
    priorityDiv.appendChild(priorityButtonsDiv);
    priorityButtonsDiv.appendChild(lowPriorityInput);
    priorityButtonsDiv.appendChild(lowPriorityLabel);
    priorityButtonsDiv.appendChild(mediumPriorityInput);
    priorityButtonsDiv.appendChild(mediumPriorityLabel);
    priorityButtonsDiv.appendChild(highPriorityInput);
    priorityButtonsDiv.appendChild(highPriorityLabel);

    editForm.appendChild(priorityDiv);

    const submitButton = document.createElement("button");
    submitButton.type = "submit";
    submitButton.className = "edit-task";
    submitButton.textContent = "Edit To Do";

    submitDiv.appendChild(priorityDiv);
    submitDiv.appendChild(submitButton);
    editForm.appendChild(submitDiv);

    editForm.elements["due-date"].value = list.dueDate;
    editForm.elements["priority"].value = list.priority;

    submitButton.addEventListener("click", (event) => {
      event.preventDefault();
      // console.log("in submit");
      list.title = editForm.elements["title"].value;
      list.description = editForm.elements["description"].value;

      if (list.priority != editForm.elements["priority"].value) {
        listBox.classList.remove("low");
        listBox.classList.remove("medium");
        listBox.classList.remove("high");
        // console.log(list.priority);
        listBox.classList.add(
          editForm.elements["priority"].value.toLowerCase()
        );
      }

      list.priority = editForm.elements["priority"].value;
      list.dueDate = editForm.elements["due-date"].value;
      titles.textContent = list.title;
      const dateObject = new Date(list.dueDate);
      const dateMonth = format(dateObject, "MMM");
      const dateDay = format(dateObject, "do");
      date.textContent = `${dateMonth} ${dateDay}`;

      editForm.textContent = "";
      editDialog.close();
      overlay.classList.remove("overlay_active");
    });
  };

  const closeAddDialog = function () {
    const addDialog = document.querySelector(".add-dialog");

    addDialog.textContent = "";

    addDialog.close();
    addDialog.style.display = "none";
    // addDialog.style.display = "grid";

    const addForm = document.createElement("form");
    addForm.id = "add-list";
    addDialog.appendChild(addForm);
  };

  const addRenderHeaderNav = function () {
    const addDialog = document.querySelector(".add-dialog");
    const headerDiv = document.createElement("div");
    const overlay = document.querySelector(".add_overlay");
    headerDiv.className = "add-header";

    const headerTitle = document.createElement("h2");
    headerTitle.textContent = "Create a new...";

    const closeButton = document.createElement("button");
    closeButton.type = "button";
    closeButton.className = "close";
    closeButton.innerHTML = "&times;";
    closeButton.addEventListener("click", () => {
      closeAddDialog();
      overlay.classList.remove("overlay_active");
    });

    headerDiv.appendChild(headerTitle);
    headerDiv.appendChild(closeButton);
    addDialog.appendChild(headerDiv);

    const navbarDiv = document.createElement("div");
    navbarDiv.className = "add-navbar";
    const navbarList = document.createElement("ul");

    const todoNavItem = document.createElement("li");
    todoNavItem.className = "add-nav-element add-nav-selected";
    todoNavItem.textContent = "To Do";

    const projectNavItem = document.createElement("li");
    projectNavItem.className = "add-nav-element";
    projectNavItem.textContent = "Project";

    navbarList.appendChild(todoNavItem);
    navbarList.appendChild(projectNavItem);
    navbarDiv.appendChild(navbarList);
    addDialog.appendChild(navbarDiv);
  };

  return {
    renderAdd,
    renderAllToDos,
    renderProject,
    renderNumProject,
    renderAddProject,
    renderForm,
    renderEmptyProject,
  };
};

export const toDosManager = function () {
  // Create a new list
  const createTask = (
    title,
    description,
    priority,
    dueDate,
    checked = false
  ) => {
    return {
      title,
      description,
      priority,
      dueDate,
      checked,
    };
  };

  // Create a new project
  const createProject = (name) => {
    return {
      name,
    };
  };

  const getCurrentProject = () => {
    return document
      .querySelector(".nav_selected .project-name")
      .textContent.toLowerCase();
  };

  const deleteProject = (display, list) => {
    console.log("dis");
    const project = getCurrentProject();
    console.log(project);
    delete list[project];

    const currentProject = document.querySelector(".nav_selected");
    currentProject.remove();

    const home = document.querySelector(".home_li");
    home.classList.add("nav_selected");
    display.textContent = "";
    display.classList.remove("no-task");
    localStorage.setItem("list", JSON.stringify(list));
    domManipulator().renderAllToDos(list);
    domManipulator().renderNumProject(list);
  };

  const attachDeleteEventListeners = function (list, allList) {
    const deleteBtn = document.querySelectorAll(".delete-btn");
    const nav = document.querySelector(".nav_selected");
    const key = nav.querySelector(".project-name").textContent;
    deleteBtn.forEach((btn) => {
      btn.addEventListener("click", () => {
        const taskTitle =
          btn.parentElement.parentElement.querySelector(
            ".list-title"
          ).textContent;
        if (key == "Home") {
          for (let key in list) {
            list[key] = list[key].filter((task) => task.title !== taskTitle);
            localStorage.setItem("list", JSON.stringify(list));
          }
        } else {
          for (let key in list) {
            if (list[key] && list[key].title === taskTitle) {
              list.splice(0, 1);
              localStorage.setItem("list", JSON.stringify(allList));
            }
          }
        }

        btn.parentElement.parentElement.parentElement.remove();
      });
    });
    domManipulator().renderNumProject(allList);
  };

  return {
    createTask,
    createProject,
    getCurrentProject,
    deleteProject,
    attachDeleteEventListeners,
  };
};
