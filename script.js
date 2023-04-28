let listTask = [];
document.querySelector('input').focus();

function addTask(event) {
    event.preventDefault();
    const newTaskElement = document.getElementById('new-task');
    const task = newTaskElement.value.trim();

    if (task !== '') {
        const newTask = {
            description: task,
            completed: false
        };
        listTask.push(newTask);
        saveListLocalStorage();
        updateList();
        newTaskElement.value = '';
    }
}

const newTaskElement = document.getElementById('new-task');
newTaskElement.addEventListener('keypress', function (event) {
    if (event.key === 'Enter') {
        addTask(event);
    }
});

function removeTask(i) {
    listTask.splice(i, 1);
    document.querySelector('input').focus();
    saveListLocalStorage();
    updateList();
}

function editTask(i) {
    const list = document.getElementById('task-list');
    const itemList = list.children[i];
    const task = listTask[i];

    itemList.innerHTML = `
      <input type="text" class="form-control mr-2" value="${task.description}" id="edit-task-${i}" onkeydown="handleEditTaskKeyDown(event, ${i})">
      <button class="btn btn-sm btn-outline-success" onclick="saveTask(${i})"><img src="img/save.svg" alt="Save" /></button>
      <button class="btn btn-sm btn-outline-secondary" onclick="updateList()"><img src="img/cancel.svg" alt="Cancel" /></button>
    `;
    const input = document.getElementById(`edit-task-${i}`);
    input.focus();
    input.selectionStart = input.selectionEnd = input.value.length;
}

function handleEditTaskKeyDown(event, i) {
    const key = event.key;
    if (key === "Enter") {
        saveTask(i);
    } else if (key === "Escape") {
        updateList();
    }
}

function saveTask(i) {
    const inputEditTaskElement = document.querySelector(`#edit-task-${i}`);
    const task = inputEditTaskElement.value.trim();

    if (task !== '') {
        listTask[i].description = task;
        document.querySelector('input').focus();
        saveListLocalStorage();
        updateList();
    }
}

function updateList() {
    const listElement = document.getElementById('task-list');
    listElement.innerHTML = '';

    listTask.forEach((task, i) => {
        const itemList = document.createElement('li');
        itemList.className = 'list-group-item d-flex justify-content-between align-items-center';
        itemList.innerHTML = `
        <p style="cursor:pointer; margin-bottom: 0; text-decoration: ${task.completed ? 'line-through' : 'none'}; color: ${task.completed ? 'Chartreuse' : '#212529'}" onclick="completedTask(this)">${task.description}</p>
        <div>
          <button class="btn btn-sm btn-outline-primary mr-2" onclick="editTask(${i})"><img src="img/edit.svg" alt="Edit" /></button>
          <button class="btn btn-sm btn-outline-danger" onclick="removeTask(${i})"><img src="img/remove.svg" alt="Remove" /></button>
        </div>`;
        listElement.appendChild(itemList);
    });
}


function completedTask(element) {
    const index = [...element.parentNode.parentNode.children].indexOf(element.parentNode);
    const task = listTask[index];

    if (element.style.textDecoration === 'line-through' || element.style.color === 'Chartreuse') {
        element.style.textDecoration = 'none';
        element.style.color = '#212529';
        task.completed = false;
    } else {
        element.style.textDecoration = 'line-through';
        element.style.color = 'Chartreuse';
        task.completed = true;
    }
    saveListLocalStorage();
}

function saveListLocalStorage() {
    localStorage.setItem('listTask', JSON.stringify(listTask));
}

function LoadListLocalStorage() {
    const listLocalStorage = JSON.parse(localStorage.getItem('listTask'));

    if (listLocalStorage !== null) {
        listTask = listLocalStorage;
        updateList();
    }
}

LoadListLocalStorage();

document.getElementById('form').addEventListener('submit', function (e) {
    e.preventDefault();
    addTask();
});