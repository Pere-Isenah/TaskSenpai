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
const listsContainer = document.querySelector("menu_items");
const addNewList = document.querySelector(".add-new-list");
const addListInput = document.querySelector('.add-list-input');

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


// Get the necessary elements
const addButt = document.querySelector('.add-butt');
const menuItem = document.querySelector('.menu_item');


// Add click event listener to the add button
addButt.addEventListener('click', () => {
  const selectedIcon = document.querySelector('.selected-icon');
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
  // Get the input value
  const inputValue = addListInput.value;

  // Create a new list item element
  const newItem = document.createElement('li');
  newItem.classList.add('item');

  // Create the anchor tag element
  const link = document.createElement('a');
  link.classList.add('link', 'flex');

  // Generate a unique ID for the anchor tag
  const uniqueId = generateUniqueId();
  link.href = '#' + uniqueId;

  // Create the icon tag element
  const icon = document.createElement('i');
  if (selectedIcon) {
    const selectedIconElement = selectedIcon.querySelector('i');
    if (selectedIconElement) {
      icon.className = selectedIconElement.className;
    }
  }

  // Create the span element
  const span = document.createElement('span');
  span.textContent = inputValue;

  // Append the elements to the new list item
  link.appendChild(icon);
  newItem.appendChild(link);
  link.appendChild(span);

  // Append the new list item to the menu_item
  menuItem.appendChild(newItem);

  // Clear the input value
  addListInput.value = '';
}});

// Function to generate a unique ID
function generateUniqueId() {
  return '_' + Math.random().toString(36).substr(2, 9);
}

//<---NEW LIST POP MODAL AND IMPLENTATION ENDS HERE --->


//<--- ADDING,DELETING,SAVING,EDITING TASK AND FUNCTIONALITY START HERE ---> 

// add task, edit task and save task function
const form = document.querySelector("form");
const container = document.querySelector(".box");
const btn = document.querySelector(".add_btn");
// let del_btn = document.querySelectorAll("button");

 
form.addEventListener("submit", function add_task(e) {
    e.preventDefault();
    let task_input = form.elements["task"]
    let task_input_value = task_input.value;
    if (task_input_value === ""){
        alert("Enter a task")
    } else {
        //adding task input and conainer div
        const task_container = document.querySelector(".task_container");
        const task_box = document.createElement("div");
        task_box.classList.add("task_box")
        task_container.appendChild(task_box);
        const task_content_el = document.createElement('div');
		task_content_el.classList.add('content');
        task_box.appendChild(task_content_el)




        //adding task  
        const task = document.createElement("input");
        task.value = task_input_value
        task.classList.add("to_do_task")
        task.readOnly=true;
        task_content_el.appendChild(task);
        
        //adding task_btn_container div
        const task_btn_container = document.createElement("div");
        task_btn_container.classList.add("task_btn_container");
        task_box.appendChild(task_btn_container)

        //adding edit and delete button
        const edit_button = document.createElement("i");
        edit_button.classList.add("bx", "bxs-edit","to_do_task")
        // edit_button.textContent = "edit"
        task_btn_container.appendChild(edit_button);
        
        const del_button = document.createElement("i");
        del_button.classList.add("bx","bxs-trash",)
        // del_button.textContent = "delete"
        task_btn_container.appendChild(del_button);
        task_input.value = ""
    

    
    edit_button.addEventListener("click", function edit_task(e){
        console.log(edit_button.classList.item(1))
        if (edit_button.classList.item(1) == "bxs-edit") {
            // edit_button.innerText = "save";
            edit_button.classList.replace("bxs-edit","bxs-save")
            task.classList.replace("to_do_task","edit_input")
            task.readOnly = false;
            task.focus();
        } else {
            edit_button.classList.item(1) == "bxs-save";
            edit_button.classList.replace("bxs-save","bxs-edit")
            task.classList.replace("edit_input","to_do_task")
            task.readOnly = true;
        }   
    });
    del_button.addEventListener("click", function del_task(e){
        task_container.removeChild(task_box)
    });
    task.addEventListener("click",function taskDone(e){
        if (task.classList == "to_do_task"){
        task.classList.replace("to_do_task","done")
    } else {
            task.classList.replace("done","to_do_task")
        }
    });
    }
})

//<--- ADDING,DELETING,SAVING,EDITING TASK AND FUNCTIONALITY ENDS HERE ---> 
