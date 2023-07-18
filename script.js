const LOCAL_STORAGE_LIST_KEY = 'task.lists'
const LOCAL_STORAGE_SELECTED_LIST_ID_KEY = 'task.selectedListId'
let lists = JSON.parse(localStorage.getItem(LOCAL_STORAGE_LIST_KEY)) || []
let selectedListId = localStorage.getItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY)

//<--- SIDE BAR STARTS HERE --->

const sidebar = document.querySelector(".sidebar");
const sidebarOpenBtn = document.querySelector("#sidebar-open");
const sidebarCloseBtn = document.querySelector("#sidebar-close");
const sidebarLockBtn = document.querySelector("#lock-icon");
const section = document.querySelector("section");



// Function to adjust the section margin based on the sidebar state
const adjustSectionMargin = () => {
  if (sidebar.classList.contains("close")) {
    section.style.marginLeft = "80px";
  } else {
    section.style.marginLeft = "275px";
  }
};

// Function to toggle the lock state of the sidebar
const toggleLock = () => {
  sidebar.classList.toggle("locked");
  // If the sidebar is not locked
  if (!sidebar.classList.contains("locked")) {
    sidebar.classList.add("hoverable");
    sidebarLockBtn.classList.replace("bx-lock-alt", "bx-lock-open-alt");
  } else {
    sidebar.classList.remove("hoverable");
    sidebarLockBtn.classList.replace("bx-lock-open-alt", "bx-lock-alt");
  }
  adjustSectionMargin(); // Adjust the section margin when locking/unlocking the sidebar
};

// Function to hide the sidebar when the mouse leaves
const hideSidebar = () => {
  if (sidebar.classList.contains("hoverable")) {
    sidebar.classList.add("close");
    adjustSectionMargin(); // Adjust the section margin when hiding the sidebar
  }
};

// Function to show the sidebar when the mouse enters
const showSidebar = () => {
  if (sidebar.classList.contains("hoverable")) {
    sidebar.classList.remove("close");
    adjustSectionMargin(); // Adjust the section margin when showing the sidebar
  }
};

// Function to show and hide the sidebar
const toggleSidebar = () => {
  sidebar.classList.toggle("close");
  adjustSectionMargin(); // Adjust the section margin when toggling the sidebar
};

// If the window width is less than 800px, close the sidebar and remove hoverability and lock
if (window.innerWidth < 800) {
  sidebar.classList.add("close");
  sidebar.classList.remove("locked");
  sidebar.classList.remove("hoverable");
}

// Adding event listeners to buttons and sidebar for the corresponding actions
sidebarLockBtn.addEventListener("click", toggleLock);
sidebar.addEventListener("mouseleave", hideSidebar);
sidebar.addEventListener("mouseenter", showSidebar);
sidebarOpenBtn.addEventListener("click", toggleSidebar);
sidebarCloseBtn.addEventListener("click", toggleSidebar);

// Adjust the section margin on page load
window.addEventListener("load", adjustSectionMargin);

//<---SIDEBAR ENDS HERE---> 


//<---NEW LIST POP MODAL AND IMPLENTATION STARTS HERE --->

//Pop up modal for adding a new list
const listsContainer = document.querySelector('[list-menu]');
const addNewList = document.querySelector(".add-new-list");
const addListInput = document.querySelector('.add-list-input');
const listDisplayContainer = document.querySelector('section');
const listTitleElement = document.querySelector(".task-title");
let selectedA = document.querySelector(".link");
let listIconElement =  document.querySelector("[data-icon]");
const deleteListButton = document.querySelector("div[delete-task-list]");
const undonelistCount = document.querySelector(".undone-task");
const donelistCount = document.querySelector(".done-task");
const taskContainer = document.querySelector("div[task-container]");
const doneTaskContainer = document.querySelector("div[completed-task-con]");
const delCompletedTaskButton = document.querySelector("div[del-completed-task]");
const errorParagraph = document.querySelector('.task-popup p');

const delButton = document.querySelector('.bxs-trash');
const taskBox = document.querySelector("div[task-box]");
const content = document.querySelector('.content');
const taskInput = document.querySelector('.to_do_task');

// Event listener for list selection
listsContainer.addEventListener('click', e => {
  const liTarget = e.target.closest("li");
  selectedListId = liTarget.id
  saveAndRender()
});


// Event listener for adding a new list
addNewList.addEventListener("click", function(){
  document.querySelector(".task-popup").classList.add("active");

  // Clear any existing error messages
  errorParagraph.textContent = '';
});
// Close pop up modal
document.querySelector(".close-task-popup").addEventListener("click", function(){
  document.querySelector(".task-popup").classList.remove("active");
});

// Get all the task icons
const taskIcons = document.querySelectorAll('.task-icon');

// Add click event listener to each task icon
taskIcons.forEach((taskIcon) => {
  taskIcon.addEventListener('click', () => {
    // Check if the clicked icon already has the "selected-icon" class
    const isSelected = taskIcon.classList.contains('selected-icon');

    // If the icon is already selected, remove the class
    if (isSelected) {
      taskIcon.classList.remove('selected-icon');
    } else {
      // If the icon is not selected, remove the class from all icons and add it to the clicked icon
      taskIcons.forEach((icon) => {
        icon.classList.remove('selected-icon');
      });
      taskIcon.classList.add('selected-icon');
    }
  });
});

// Event listener for delete list button
deleteListButton.addEventListener('click', e => {
  lists = lists.filter(list => list.id !== selectedListId)
  selectedListId = null
  saveAndRender()
})

// Get the necessary elements
const addButt = document.querySelector('.add-butt');
const menuItem = document.querySelector('.menu_item');

// Add click event listener to the add button
addButt.addEventListener('click', () => {
  const selectedIcon = document.querySelector('.selected-icon');
  const inputValue = addListInput.value.trim()
  const capitalizedValue = inputValue.charAt(0).toUpperCase() + inputValue.slice(1);
  // Check if both input value and icon are empty
  if (inputValue.trim() === '' && !selectedIcon) {
    errorParagraph.innerHTML = '*Enter a list name' + '<br>' + '*Select an icon';
  } else if (inputValue.trim() === '') {
    errorParagraph.textContent = '*Enter a list name';
  } else if (!selectedIcon) {
    errorParagraph.textContent = '*Select an icon';
  } else if (inputValue.length > 20) {
    errorParagraph.textContent = "Name is too long";
  } else {
    const listIcon = getSelectedIcon(selectedIcon);
    const list = createList(capitalizedValue, listIcon);

    addListInput.value = '';
    lists.push(list);
    document.querySelector(".task-popup").classList.remove("active");
    saveAndRender();

  }
});


// Event listener for task completion
taskContainer.addEventListener('click', e => {
  console.log(e.target)
  if (e.target.classList.contains('to_do_task')) {
    const taskInput = e.target;
    const taskBox = taskInput.closest('.task_box');
    const selectedList = lists.find(list => list.id === selectedListId);
    const selectedTask = selectedList.tasks.find(task => task.name === taskInput.value);

    if (taskInput.classList.contains('done')) {
      taskInput.classList.remove('done');
      selectedTask.complete = false;
      // taskContainer.appendChild(taskBox);
    } else {
      taskInput.classList.add('done');
      selectedTask.complete = true;
      renderDoneTasks(selectedList)
      taskContainer.removeChild(taskBox);


      // doneTaskContainer.appendChild(taskBox);
    }

    save();
    renderUndoneTaskCount(selectedList);
    renderDoneTaskCount(selectedList);
  }
});

// Event listener for adding a new task
const form = document.querySelector("form");
form.addEventListener("submit", e => {
  e.preventDefault()
  let addTaskInput = document.querySelector(".add_input")
  let taskInputValue = addTaskInput.value;
  
  const taskCreate = createTask(taskInputValue)
  if (taskInputValue === ""){
    alert("Enter a task") 
  } else if (taskInputValue.length > 100) {
    alert("task name too long") 
  } else {
    const selectedList = lists.find(list => list.id === selectedListId);
    selectedList.tasks.push(taskCreate);
    saveAndRender();
    addTaskInput.value = ""
  }
});

doneTaskContainer.addEventListener("click", e => {
  const taskBox = e.target.closest(".task_box");
  if (taskBox) {
    const taskId = taskBox.getAttribute("data-task-id");

    // Find the selected list
    const selectedList = lists.find(list => list.id === selectedListId);

    // Find the task in the completed tasks using the task id
    const completedTask = selectedList.tasks.find(task => task.id === taskId && task.complete);

    // Remove the task from the completed tasks
    selectedList.tasks = selectedList.tasks.filter(task => task.id !== taskId);

    // Update the task completion status
    completedTask.complete = false;

    // Add the task back to the list of tasks
    selectedList.tasks.push(completedTask);

    // Render the updated tasks
    saveAndRender();
  }
});

delCompletedTaskButton.addEventListener('click', () => {
  const selectedList = lists.find(list => list.id === selectedListId);
  selectedList.tasks = selectedList.tasks.filter(task => !task.complete);
  saveAndRender();
});

// Helper function to get the selected icon
function getSelectedIcon(ChosenIcon) {
  if (ChosenIcon) {
    const selectedIconElement = ChosenIcon.querySelector('i');
    if (selectedIconElement) {
      return selectedIconElement.className
    }
  }
}

// Helper function to create a new list object
function createList(name, icon) {
  return { id: Date.now().toString(), name: name, icon: icon, tasks: [] }
}

// Helper function to create a new task object
function createTask(name, complete = false) {
  return { id: Date.now().toString(), name: name, complete: complete }
}

// Save and render the changes
function saveAndRender() {
  save()
  render()
}

// Render the lists and the selected list's tasks
function render() {
  clearElement(listsContainer)
  renderLists()
  const selectedList = lists.find(list => list.id === selectedListId)
  console.log(selectedList)

  if (!selectedListId) {
    listDisplayContainer.style.display = 'none'
  } else {
    listDisplayContainer.style.display = ''
    listTitleElement.textContent = selectedList.name
    listIconElement.className = selectedList.icon; 
    
    renderUndoneTaskCount(selectedList)
    renderDoneTaskCount(selectedList);
    clearElement(taskContainer)
    renderTasks(selectedList)
    renderDoneTasks(selectedList)
  }
}

// Save the lists and the selected list ID to localStorage
function save() {
  localStorage.setItem(LOCAL_STORAGE_LIST_KEY, JSON.stringify(lists))
  localStorage.setItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY, selectedListId)
}

// Render the list items in the sidebar
function renderLists() {
  lists.forEach( list => {
    menuItem.innerHTML += `
      <li class="item" id=${list.id}>
        <a href="#" class="link flex">
          <i class="${list.icon}"></i>
          <span>${list.name}</span>
        </a>
      </li>`;
    
    const listItem = document.getElementById(list.id);
    const listItemLink = listItem.querySelector('a');

    if (list.id === selectedListId) {
      listItemLink.classList.add('active-list');
    }
  });
}


// Render the tasks of the selected list
function renderTasks(selectedList) {
  clearElement(taskContainer);

  const undoneTasks = selectedList.tasks.filter(task => !task.complete);

  undoneTasks.forEach(task => {
    const taskBox = document.createElement("div");
    taskBox.classList.add("task_box");
    taskBox.setAttribute("data-task-id", task.id);

    const content = document.createElement("div");
    content.classList.add("content");

    const taskInput = document.createElement("input");
    taskInput.id = task.id;
    taskInput.classList.add("to_do_task");
    taskInput.readOnly = true;
    taskInput.value = task.name;

    const taskBtnContainer = document.createElement("div");
    taskBtnContainer.classList.add("task_btn_container");

    const editButton = document.createElement("i");
    editButton.classList.add("bx", "bxs-edit");

    const delButton = document.createElement("i");
    delButton.classList.add("bx", "bxs-trash");

    content.appendChild(taskInput);
    taskBtnContainer.appendChild(editButton);
    taskBtnContainer.appendChild(delButton);
    taskBox.appendChild(content);
    taskBox.appendChild(taskBtnContainer);
    taskContainer.appendChild(taskBox);

    editButton.addEventListener("click", function() {
      if (editButton.classList.contains("bxs-edit")) {
        // Switch to edit mode
        editButton.classList.replace("bxs-edit", "bxs-save");
        taskInput.classList.replace("to_do_task", "edit_input");
        taskInput.readOnly = false;
        taskInput.focus();
      } else {
        // Save changes and switch back to view mode
        editButton.classList.replace("bxs-save", "bxs-edit");
        taskInput.classList.replace("edit_input", "to_do_task");
        taskInput.readOnly = true;

        const selectedList = lists.find(list => list.id === selectedListId);
        const selectedTask = selectedList.tasks.find(task => task.id === taskInput.id);

        selectedTask.name = taskInput.value;
        renderDoneTasks(selectedList)
        saveAndRender();
      }
    });

    delButton.addEventListener("click", function() {
      const selectedList = lists.find(list => list.id === selectedListId);
      selectedList.tasks = selectedList.tasks.filter(task => task.id !== taskInput.id);
      saveAndRender();
    });
  });

  renderDoneTaskCount(selectedList);
}


// Clear all child elements of a given element
function clearElement(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild)
  }
}

// Render the count of undone tasks
function renderUndoneTaskCount(selectedList) {
  const incompleteTaskCount = selectedList.tasks.filter(task => !task.complete).length
  const taskString = incompleteTaskCount === 1 ? "task" : "tasks"
  undonelistCount.innerText = `${incompleteTaskCount} ${taskString} remaining`
}

// Render the count of done tasks
function renderDoneTaskCount(selectedList) {
  const doneTaskCount = selectedList.tasks.filter(task => task.complete).length;
  const taskString = doneTaskCount === 1 ? "task" : "tasks";
  donelistCount.innerText = `${doneTaskCount} ${taskString} completed`;
}

// Render the done tasks in the completed task container
// Render the done tasks in the completed task container
function renderDoneTasks(selectedList) {
  clearElement(doneTaskContainer);

  selectedList.tasks.forEach(task => {
    if (task.complete) {
      const taskBox = document.createElement("div");
      taskBox.classList.add("task_box");
      taskBox.setAttribute("data-task-id", task.id);

      const taskName = document.createElement("p");
      taskName.classList.add("done");
      taskName.textContent = task.name;

      taskBox.appendChild(taskName);
      doneTaskContainer.appendChild(taskBox);
    }
  });

  renderDoneTaskCount(selectedList);

  if (selectedList.tasks.some(task => task.complete)) {
    delCompletedTaskButton.style.display = "block";
  } else {
    delCompletedTaskButton.style.display = "none";
  }
}


// Initial rendering of the lists and the selected list's tasks
render();


