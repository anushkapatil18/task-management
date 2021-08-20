const taskContainer = document.querySelector(".task__container");
const taskModal = document.querySelector(".task__modal__body");
let globaTaskData = []; // to store the inputs

const htmlModalDisplay = ({ id, url }) => {
  const date = new Date(parseInt(id));
  return ` <div id=${taskData.id}>
  <img
  src=${
    url ||
    `https://images.unsplash.com/photo-1572214350916-571eac7bfced?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=755&q=80`
  }
  alt="bg image"
  class="img-fluid place__holder__image mb-3"
  />
  <strong class="text-sm text-muted">Created on ${date.now()}</strong>
  <h2 class="my-3">${taskData.title}</h2>
  <p class="lead">
  ${taskData.description}
  </p></div>`;
};

const addNewCard = () => {
  // get task data
  const taskData = {
    id: `${Date.now()}`, //template literal for multiple lines
    title: document.getElementById("taskTitle").value,
    image: document.getElementById("imageURL").value,
    type: document.getElementById("taskType").value,
    description: document.getElementById("taskDescription").value
  };
   // getting the value inside the elements
  globaTaskData.push(taskData); // push the input to globalTaskData

  //update local storage
  localStorage.setItem("taskyCA",JSON.stringify({card: globaTaskData}));

  // generate HTML code to insert card onclick of "Save Changes" button

  const newCard = ` <div id=${taskData.id} class="col-md-6 col-lg-4 my-4">
  <div class="card">
    <div class="card-header gap-2 d-flex justify-content-end">
      <button class="btn btn-outline-info" name=${taskData.id} onclick="editCard.apply(this,arguments)">
        <i class="fal fa-pencil" name=${taskData.id}></i>
      </button>
      <button class="btn btn-outline-danger" name=${taskData.id} onclick="deleteCard.apply(this,arguments)">
        <i class="far fa-trash-alt" name=${taskData.id}></i>
      </button>
    </div>
    <div class="card-body">
      <img
        src=${taskData.image}
        alt="image"
        class="card-img"
      />
      <h5 class="card-title mt-4">${taskData.title}</h5>
      <p class="card-text">
        ${taskData.description}
      </p>
      <span class="badge bg-primary">${taskData.type}</span>
    </div>
    <div class="card-footer">
      <button class="btn btn-outline-primary" name=${taskData.id} data-bs-toggle="modal"
      data-bs-target="#showTask" onclick="openTask.apply(this, arguments)">Open Task</button>
    </div>
  </div>
</div>`;

  // Inject it to DOM
  taskContainer.insertAdjacentHTML("beforeend", newCard);
  
  // clear the form
  document.getElementById("taskTitle").value = "";
  document.getElementById("imageURL").value = "";
  document.getElementById("taskType").value = "";
  document.getElementById("taskDescription").value = "";

  return;
};

const loadExistingCards = () => {

  // check local storage
  const getData = localStorage.getItem("taskyCA");

  if(!getData) return;
  
  //parse JSON data to use the inputs, if exists
  const taskCards = JSON.parse(getData);

  globaTaskData = taskCards.card;


  //generate html code for those data
  globaTaskData.map((taskData) => {
    const newCard = ` <div id=${taskData.id} class="col-md-6 col-lg-4 my-4">
    <div class="card">
      <div class="card-header gap-2 d-flex justify-content-end">
      <button class="btn btn-outline-info" name=${taskData.id} onclick="editCard.apply(this,arguments)">
      <i class="fal fa-pencil" name=${taskData.id}></i>
    </button>
        <button class="btn btn-outline-danger" name=${taskData.id} onclick="deleteCard.apply(this,arguments)">
        <i class="far fa-trash-alt" name=${taskData.id}></i>
        </button>
      </div>
      <div class="card-body">
        <img
          src=${taskData.image}
          alt="image"
          class="card-img"
        />
        <h5 class="card-title mt-4">${taskData.title}</h5>
        <p class="card-text">
          ${taskData.description}
        </p>
        <span class="badge bg-primary">${taskData.type}</span>
      </div>
      <div class="card-footer">
        <button class="btn btn-outline-primary" name=${taskData.id} data-bs-toggle="modal"
        data-bs-target="#showTask" onclick="openTask.apply(this, arguments)"
        >Open Task</button>
      </div>
    </div>
  </div>`

  //inject it to the DOM
  taskContainer.insertAdjacentHTML("beforeend", newCard);

  });

  return;
}

// event: globally defined objet
const deleteCard = (event) => {
  const targerID = event.target.getAttribute("name"); // access to the html where the user has clicked
  const elementType = event.target.tagName;

  // compare the IDs of all card with the card(delete button clicked)
  const removeTask = globaTaskData.filter((task) => task.id !== targerID); //filter: 
  globaTaskData = removeTask;  // remove card details from globalTaskData array

  //update local storage
  localStorage.setItem("taskyCA",JSON.stringify({card: globaTaskData}));

  // access DOM to remove card
  if(elementType === "BUTTON"){
    return taskContainer.removeChild(event.target.parentNode.parentNode.parentNode);
  }
  else{
    return taskContainer.removeChild(event.target.parentNode.parentNode.parentNode.parentNode);
  }

};
const editCard = (event) => {
  const targerID = event.target.getAttribute("name"); // access to the html where the user has clicked
  const elementType = event.target.tagName;

  let taskTitle;
  let taskType;
  let taskDescription;
  let parentElement;
  let submitButton;

  if(elementType === "BUTTON"){
    parentElement = event.target.parentNode.parentNode;
  }
  else{
    parentElement = event.target.parentNode.parentNode.parentNode;
  }

  taskTitle = parentElement.childNodes[3].childNodes[3];
  taskDescription = parentElement.childNodes[3].childNodes[5];
  taskType= parentElement.childNodes[3].childNodes[7];
  submitButton = parentElement.childNodes[5].childNodes[1];

  taskTitle.setAttribute("contenteditable","true");
  taskDescription.setAttribute("contenteditable","true");
  taskType.setAttribute("contenteditable","true");
  submitButton.setAttribute("onclick","saveEdit.apply(this,arguments)");
  submitButton.innerHTML = "Save Changes";
  
};

const saveEdit=(event)=>{
  const targerID = event.target.getAttribute("name"); // access to the html where the user has clicked
  const elementType = event.target.tagName;

  let parentElement;

  if(elementType === "BUTTON"){
    parentElement = event.target.parentNode.parentNode;
  }
  else{
    parentElement = event.target.parentNode.parentNode.parentNode;
  }

  const taskTitle = parentElement.childNodes[3].childNodes[3];
  const taskDescription = parentElement.childNodes[3].childNodes[5];
  const taskType= parentElement.childNodes[3].childNodes[7];
  const submitButton = parentElement.childNodes[5].childNodes[1];

  const updatedData ={ 
     title: taskTitle.innerHTML,
     type: taskType.innerHTML,
     description: taskDescription.innerHTML
  };

  const updatedGlobalTasks = globaTaskData.map((task)=>{
     if(task.id === targerID){
       return {...task,...updatedData };
     }
     return task;
  });

  globaTaskData = updatedGlobalTasks;

  localStorage.setItem("taskyCA",JSON.stringify({card: globaTaskData}));

  taskTitle.setAttribute("contenteditable","false");
  taskDescription.setAttribute("contenteditable","false");
  taskType.setAttribute("contenteditable","false");
  submitButton.innerHTML = "Open Task";


};

const openTask = (event) => {
  if (!event) {
    event = window.event;
  }
  else{
  const getTask = state.globaTaskData.filter(({ id }) => id === event.target.id);
  taskModal.innerHTML = htmlModalDisplay(getTask[0]);
  }
};





