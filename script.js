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
const listDisplayContainer = document.querySelector(".container");
const listTitleElement = document.querySelector(".task-title");
let selectedA = document.querySelector(".link");
let listIconElement =  document.querySelector("[data-icon]");
const deleteListButton = document.querySelector(".task-li-del-btn");
const undonelistCount = document.querySelector(".undone-task");
const donelistCount = document.querySelector(".done-task");
const taskContainer = document.querySelector(".task_container");

const delButton = document.querySelector('.bxs-trash');
const taskBox = document.querySelector(".task_box")
const content = document.querySelector('.content');
const taskInput = document.querySelector('.to_do_task');

listsContainer.addEventListener ('click', e => {
  const liTarget = e.target.closest("li");
    selectedListId = liTarget.id
    saveAndRender()
  
});

addNewList.addEventListener("click", function(){
  document.querySelector(".task-popup").classList.add("active");
});
//close pop up modal
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
  const inputValue = addListInput.value;
  if (addListInput.value == ""){
    NoListName = document.createElement("p");
    NoListName.textContent= "*Enter a task list name"
    const taskPop = document.querySelector(".task-popup");
    taskPop.insertBefore(NoListName, taskPop.children[1]);
  } else if(!selectedIcon) {
    NoIcon = document.createElement("p");
    NoIcon.textContent= "*Enter a task list name"
    const NewList = document.querySelector(".new-list");
    NewList.insertBefore(NoIcon, NewList.children[2]);
  } else{
    const listIcon = getSelectedIcon(selectedIcon)
    const list = createList(inputValue,listIcon);

    addListInput.value = '';
    lists.push(list)
    saveAndRender()}});


    taskContainer.addEventListener('click', e => {
      if (e.target.classList.contains('to_do_task')) {
        const taskInput = e.target;
        console.log(taskInput)
        // const taskBox = taskInput.closest('.task_box');
        const selectedList = lists.find(list => list.id === selectedListId);
        const selectedTask = selectedList.tasks.find(task => task.name === taskInput.value);
    
        if (taskInput.classList.contains('done')) {
          taskInput.classList.remove('done');
          selectedTask.complete = false;
        } else {
          taskInput.classList.add('done');
          selectedTask.complete = true;
        }
    
        save();
        renderUndoneTaskCount(selectedList);
        renderDoneTaskCount(selectedList);

      }
    });

const form = document.querySelector("form");
// const container = document.querySelector(".box");
// const btn = document.querySelector(".add_btn");
    // let del_btn = document.querySelectorAll("button");
    
     
form.addEventListener("submit", e => {
    e.preventDefault()
    let addTaskInput = document.querySelector(".add_input")
    let taskInputValue = addTaskInput.value;
    console.log(lists)
    const taskCreate = createTask(taskInputValue)
    if (taskInputValue === ""){
        alert("Enter a task") 
    } else {
      const selectedList = lists.find(list => list.id === selectedListId);
      selectedList.tasks.push(taskCreate);
      saveAndRender();
      addTaskInput.value = ""
    }
  });


    function getSelectedIcon(ChosenIcon) {
      // Create the icon tag element
  // const icon = document.createElement('i');
  if (ChosenIcon) {
    const selectedIconElement = ChosenIcon.querySelector('i');
    if (selectedIconElement) {
      // icon.className = selectedIconElement.className;
      // icon.className = list.icon;
      return selectedIconElement.className
    }
  }
    }

    function createList(name, icon) {
      return { id: Date.now().toString(), name: name, icon: icon, tasks: [] }
    }

    function createTask(name, complete = false) {
      return { id: Date.now().toString(), name: name, complete: complete }
    }
    
    function saveAndRender() {
      save()
      render()
    }
    function render() {
      clearElement(listsContainer)
      renderLists()
      const selectedList = lists.find(list => list.id === selectedListId)
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
      }
    }
    function save() {
      localStorage.setItem(LOCAL_STORAGE_LIST_KEY, JSON.stringify(lists))
      localStorage.setItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY, selectedListId)
    }
    
    function renderLists() {
      lists.forEach( list => {
    // Get the input 
    menuItem.innerHTML += ` <li class="item" id = ${list.id}>
    <a href="#" class="link flex">
    <i class= "${list.icon}"></i>
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



function renderTasks(selectedList) {
  clearElement(taskContainer);
  
  selectedList.tasks.forEach(task => {
    const taskBox = document.createElement("div");
    taskBox.classList.add("task_box");

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


delButton.addEventListener("click", () => {
    taskContainer.removeChild(taskBox);
  });

// taskInput.addEventListener("click", () => {
//   //     if (task.classList == "to_do_task"){
//   //     task.classList.replace("to_do_task","done")
//   // } else {
//   //         task.classList.replace("done","to_do_task")
//   //     }
//   task.complete = !task.complete; // Toggle the completion state
//   taskInput.classList.toggle('done');
//   save();
//   renderUndoneTaskCount(selectedList);
// });


function renderUndoneTaskCount(selectedList) {
  const incompleteTaskCount = selectedList.tasks.filter(task => !task.complete).length
  const taskString = incompleteTaskCount === 1 ? "task" : "tasks"
  undonelistCount.innerText = `${incompleteTaskCount} ${taskString} remaining`
}

function renderDoneTaskCount(selectedList) {
  const doneTaskCount = selectedList.tasks.filter(task => task.complete).length;
  const taskString = doneTaskCount === 1 ? "task" : "tasks";
  // const doneListCountElement = document.querySelector(".done-task");
  donelistCount.innerText = `${doneTaskCount} ${taskString} completed`;
}

// function render
                          //   // Create a new list item element
                          //   const newItem = document.createElement('li');
//   newItem.dataset.listId = list.id
//   newItem.classList.add('item');

function clearElement(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild)
  }
};

render()
//   // Create the anchor tag element
//   const link = document.createElement('a');
//   link.classList.add('link', 'flex');

//   // Generate a unique ID for the anchor tag
//   const uniqueId = generateUniqueId();
//   link.href = '#' + uniqueId;

//   // Create the icon tag element
//   const icon = document.createElement('i');
//   if (selectedIcon) {
//     const selectedIconElement = selectedIcon.querySelector('i');
//     if (selectedIconElement) {
//       // icon.className = selectedIconElement.className;
//       icon.className = list.icon;

//     }
//   }

//   // Create the span element
//   const span = document.createElement('span');
//   // span.textContent = inputValue;
//   span.textContent = list.name;

//   if (list.id === selectedListId) {
//     newItem.classList.add('active-list')
//   }
//   // Append the elements to the new list item
//   link.appendChild(icon);
//   newItem.appendChild(link);
//   link.appendChild(span);

//   // Append the new list item to the menu_item
//   menuItem.appendChild(newItem);

//   // Clear the input value
//   })}
// });

// Function to generate a unique ID
// function generateUniqueId() {
//   return '_' + Math.random().toString(36).substr(2, 9);
// }

//<---NEW LIST POP MODAL AND IMPLENTATION ENDS HERE --->


//<--- ADDING,DELETING,SAVING,EDITING TASK AND FUNCTIONALITY START HERE ---> 

// add task, edit task and save task function

    // else {
    //     //adding task input and conainer div
    //     const task_container = document.querySelector(".task_container");
    //     const task_box = document.createElement("div");
    //     task_box.classList.add("task_box")
    //     task_container.appendChild(task_box);
    //     const task_content_el = document.createElement('div');
		//     task_content_el.classList.add('content');
    //     task_box.appendChild(task_content_el)




    //     //adding task  
    //     const task = document.createElement("input");
    //     task.value = task_input_value
    //     task.classList.add("to_do_task")
    //     task.readOnly=true;
    //     task_content_el.appendChild(task);
        
    //     //adding task_btn_container div
    //     const task_btn_container = document.createElement("div");
    //     task_btn_container.classList.add("task_btn_container");
    //     task_box.appendChild(task_btn_container)

    //     //adding edit and delete button
    //     const edit_button = document.createElement("i");
    //     edit_button.classList.add("bx", "bxs-edit","to_do_task")
    //     // edit_button.textContent = "edit"
    //     task_btn_container.appendChild(edit_button);
        
    //     const del_button = document.createElement("i");
    //     del_button.classList.add("bx","bxs-trash",)
    //     // del_button.textContent = "delete"
    //     task_btn_container.appendChild(del_button);
    //     task_input.value = ""
    

    
    // edit_button.addEventListener("click", function edit_task(e){
    //     console.log(edit_button.classList.item(1))
    //     if (edit_button.classList.item(1) == "bxs-edit") {
    //         // edit_button.innerText = "save";
    //         edit_button.classList.replace("bxs-edit","bxs-save")
    //         task.classList.replace("to_do_task","edit_input")
    //         task.readOnly = false;
    //         task.focus();
    //     } else {
    //         edit_button.classList.item(1) == "bxs-save";
    //         edit_button.classList.replace("bxs-save","bxs-edit")
    //         task.classList.replace("edit_input","to_do_task")
    //         task.readOnly = true;
    //     }   
    // });
    // del_button.addEventListener("click", function del_task(e){
    //     task_container.removeChild(task_box)
    // });
    // task.addEventListener("click",function taskDone(e){
    //     if (task.classList == "to_do_task"){
    //     task.classList.replace("to_do_task","done")
    // } else {
    //         task.classList.replace("done","to_do_task")
    //     }
    // });
    // }


//<--- ADDING,DELETING,SAVING,EDITING TASK AND FUNCTIONALITY ENDS HERE ---> 
