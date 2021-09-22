//inputs
const input = document.querySelector(".input");

//containers
const todoContainer = document.querySelector(".todo-container");
const todoInfoContainer = document.querySelector(".todo-info__container");

//
const all = document.querySelector(".all");
const active = document.querySelector(".active");
const distributer = document.querySelector(".completed");
//buttons
const inputBtn = document.querySelector(".btn-input");
const moreBtn = document.querySelector(".more");
const tickBtn = document.querySelector(".tick");

//texts
const todoText = document.querySelector(".todo__text");
const items = document.querySelector(".items");

class App {
  //variables

  baseHolder = { dataHolder: [] };
  datanos = 0;
  currentItems = 0;
  #edit;
  #selectedNode;

  constructor() {
    all.style.color = "hsl(220, 98%, 61%)";
    inputBtn.addEventListener("click", this.storeData.bind(this));
    todoContainer.addEventListener("click", this.navigation.bind(this));
    todoInfoContainer.addEventListener("click", this.navigationBtn.bind(this));
    this.getData();
  }

  //functions

  getData() {
    const data = JSON.parse(localStorage.getItem("todoHistory"));
    if (!data) return;
    this.baseHolder  = data;
    this.todoInput([...this.baseHolder.dataHolder]);
  }

  setData() {
    localStorage.setItem("todoHistory", JSON.stringify(this.baseHolder));
  }

  storeData(e) {
    e.preventDefault();
    const inputText = input.value;
    this.baseHolder.dataHolder[this.datanos] = {
      id: [],
      status: [],
      text: [],
    };

    if (inputText != "") {
      this.baseHolder.dataHolder[this.datanos].id.push(this.datanos);
      this.baseHolder.dataHolder[this.datanos].text.push(inputText);
      this.baseHolder.dataHolder[this.datanos].status.push("Active");
      this.currentItems++;
      this.datanos++;
      this.HtmlCleaner();
      this.inIt();
    }
  }

  todoInput = (status) => {
    let html;
    status.forEach((val, i) => {
      const idValue = val?.id;
      if (idValue != undefined) {
        const text = val.text;
        const status = val.status[0];
        const decorationText =
          status == `Completed`
            ? `style="text-decoration: line-through;"`
            : `style="text-decoration: none;"`;
        const currentStatus = status == "Completed" ? `checked` : ``;
        const decorationBg =
          status == `Completed`
            ? `style = "background-color: rgb(33, 35, 54);"`
            : `background-color: hsl(234, 11%, 52%)`;

        html = `
     <div class="todo" draggable="true" ${decorationBg}>
          <input type="checkbox" class="checkbox" ${currentStatus}  data-set="${i}">
          <span class="todo__text todo-${i}" data-set="${i}" ${decorationText}>${text}</span>
          <img src="./images/more .svg" " class="more" />
           <span class="tick" data-set="${i}">✓</span>
          <img src="./images/icon-cross.svg"  class="cross" data-set="${i}"/>
     </div>
    `;
        todoContainer.insertAdjacentHTML(`beforeend`, html);
        items.textContent = this.currentItems;
      }
    });

    input.value = "";
  };

  removeTodo(e) {
    this.HtmlCleaner();
    const targetNumber = Number(e.target.dataset.set);
    delete this.baseHolder.dataHolder[targetNumber];
    this.currentItems--;
    items.textContent = this.currentItems;
    this.inIt();
  }

  editTodo(e) {
    const node = e.target.parentNode.children;
    this.#selectedNode = node[1].dataset.set;
    this.#edit = node;

    //input structure
    const input = document.createElement("input");
    input.type = "text";
    input.className = "input";
    input.value = this.#edit[1].textContent;

    //textNode structure
    this.#edit[1].replaceWith(input);
    this.todoEditer(this.#edit[0], "none");
    this.todoEditer(this.#edit[2], "none");
    this.todoEditer(this.#edit[3], "block");

    this.#edit[3]?.addEventListener("click", () => {
      this.baseHolder.dataHolder[this.#selectedNode].text.splice(0, 1);
      this.baseHolder.dataHolder[this.#selectedNode].text.push(input.value);
      input.replaceWith(this.#edit[1]);
      this.todoEditer(this.#edit[0], "block");
      this.todoEditer(this.#edit[2], "block");
      this.todoEditer(this.#edit[3], "none");
      this.HtmlCleaner();
      this.inIt();
    });
  }

  checkboxTodo(e) {
    const completedWorkValue = e.target.dataset.set;
    if (e.target.checked) {
      this.currentStatus("Completed", completedWorkValue);
    }
    if (!e.target.checked) {
      this.currentStatus("Active", completedWorkValue);
    }
  }

  checkAll(e) {
    this.HtmlCleaner();
    this.inIt();
    this.defaultColors(
      "hsl(220, 98%, 61%)",
      "hsl(234, 11%, 52%)",
      "hsl(234, 11%, 52%)"
    );
  }

  checkActives(e) {
    const todoActive = [...this.baseHolder.dataHolder]?.filter(
      (val) => val?.status[0] === "Active"
    );
    this.HtmlCleaner();
    this.todoInput(todoActive);
    this.defaultColors(
      "hsl(234, 11%, 52%)",
      "hsl(220, 98%, 61%)",
      "hsl(234, 11%, 52%)"
    );
  }

  checkCompleted(e) {
    const todoCompleted = [...this.baseHolder.dataHolder]?.filter(
      (val) => val?.status[0] === "Completed"
    );
    this.HtmlCleaner();
    this.todoInput(todoCompleted != undefined ? todoCompleted : []);
    this.defaultColors(
      "hsl(234, 11%, 52%)",
      "hsl(234, 11%, 52%)",
      "hsl(220, 98%, 61%)"
    );
  }

  clearCompletedTodo(e) {
    let currentItemsValue = 0;
    [...this.baseHolder.dataHolder]
      ?.filter((val) => val?.status[0] === "Completed")
      .map((val) => val.id[0])
      .forEach((val) => {
        delete this.baseHolder.dataHolder[val];
        currentItemsValue++;
      });
    this.currentItems -= currentItemsValue;
    items.textContent = this.currentItems;
    this.HtmlCleaner();
    this.inIt();
    this.defaultColors(
      "hsl(220, 98%, 61%)",
      "hsl(234, 11%, 52%)",
      "hsl(234, 11%, 52%)"
    );
  }

  ///////////////////////////////////
  //HELPER FUNCTIONS

  inIt() {
    this.todoInput([...this.baseHolder.dataHolder]);
    this.setData();
  }

  navigation(e) {
    //Dealing with cross
    if (e.target.classList.contains("cross")) {
      this.removeTodo(e);
    }

    //dealing with three dots
    if (e.target.classList.contains("more")) {
      this.editTodo(e);
    }

    //Dealing check Button
    if (e.target.classList.contains("checkbox")) {
      this.checkboxTodo(e);
    }
  }

  navigationBtn(e) {
    //Toggle All
    if (e.target.classList.contains("all")) {
      this.checkAll(e);
    }

    //Toggle Active
    if (e.target.classList.contains("active")) {
      this.checkActives(e);
    }

    //Toggle Completed
    if (e.target.classList.contains("completed")) {
      this.checkCompleted(e);
    }

    //Clear Completed
    if (e.target.classList.contains("clear-completed")) {
      this.clearCompletedTodo(e);
    }
  }

  defaultColors = (color1, color2, color3) => {
    all.style.color = color1;
    active.style.color = color2;
    distributer.style.color = color3;
  };

  // HtmlCleaner();
  HtmlCleaner = () => (todoContainer.innerHTML = "");

  todoEditer(target, display) {
    target.style.display = display;
  }

  currentStatus(status, value) {
    this.baseHolder.dataHolder[value].status.splice(0, 1);
    this.baseHolder.dataHolder[value].status.push(status);
    this.HtmlCleaner();
    this.inIt();
  }
}

const todoApp = new App();
