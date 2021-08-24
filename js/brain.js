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

//texts
const todoText = document.querySelector(".todo__text");
const items = document.querySelector(".items");

//variables
const baseHolder = { dataHolder: [] };
let datanos = 0,
  currentItems = 0;

// deafaults
all.style.color = "hsl(220, 98%, 61%)";
//functions
const defaultColors = (color1, color2, color3) => {
  all.style.color = color1;
  active.style.color = color2;
  distributer.style.color = color3;
};
const HtmlCleaner = () => (todoContainer.innerHTML = "");
// HtmlCleaner();

const todoInput = (status) => {
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
           <span class="tick" >✓</span>
          <img src="./images/icon-cross.svg"  class="cross" data-set="${i}"/>
     </div>
    `;
      todoContainer.insertAdjacentHTML(`beforeend`, html);
      items.textContent = currentItems;
    }
  });

  input.value = "";
};

todoEditer = (target, display) => {
  target.style.display = display;
};

const currentStatus = (status, value) => {
  baseHolder.dataHolder[value].status.splice(0, 1);
  baseHolder.dataHolder[value].status.push(status);
  HtmlCleaner();
  todoInput([...baseHolder.dataHolder]);
};

inputBtn.addEventListener("click", (e) => {
  e.preventDefault();
  const inputText = input.value;
  baseHolder.dataHolder[datanos] = {
    id: [],
    status: [],
    text: [],
  };

  if (inputText != "") {
    baseHolder.dataHolder[datanos].id.push(datanos);
    baseHolder.dataHolder[datanos].text.push(inputText);
    baseHolder.dataHolder[datanos].status.push("Active");
    currentItems++;
    datanos++;
    HtmlCleaner();
    todoInput([...baseHolder.dataHolder]);
  }
});

todoContainer.addEventListener("click", function (e) {
  //Dealing with cross
  if (e.target.classList.contains("cross")) {
    HtmlCleaner();
    const targetNumber = Number(e.target.dataset.set);
    delete baseHolder.dataHolder[targetNumber];
    currentItems--;
    items.textContent = currentItems;
    todoInput([...baseHolder.dataHolder]);
  }

  //dealing with three dots TODO:
  if (e.target.classList.contains("more")) {
    const input = document.createElement("input");
    const node = e.target.parentNode.children;
    const setValue = node[1].dataset.set;

    //input structure
    input.type = "text";
    input.className = "input";
    input.value = node[1].textContent;

    //textNode structure
    node[1].replaceWith(input);
    todoEditer(node[0], "none");
    todoEditer(node[2], "none");
    todoEditer(node[3], "block");

    node[3].addEventListener("click", () => {
      baseHolder.dataHolder[setValue].text.splice(0, 1);
      baseHolder.dataHolder[setValue].text.push(input.value);
      input.replaceWith(node[1]);
      todoEditer(node[0], "block");
      todoEditer(node[2], "block");
      todoEditer(node[3], "none");
      HtmlCleaner();
      todoInput([...baseHolder.dataHolder]);
    });
  }

  //Dealing check Button
  if (e.target.classList.contains("checkbox")) {
    let completedWorkValue;
    completedWorkValue = e.target.dataset.set;
    if (e.target.checked) {
      currentStatus("Completed", completedWorkValue);
    }
    if (!e.target.checked) {
      currentStatus("Active", completedWorkValue);
    }
  }
});

todoInfoContainer.addEventListener("click", (e) => {
  //Toggle All
  if (e.target.classList.contains("all")) {
    HtmlCleaner();
    todoInput([...baseHolder.dataHolder]);
    defaultColors(
      "hsl(220, 98%, 61%)",
      "hsl(234, 11%, 52%)",
      "hsl(234, 11%, 52%)"
    );
  }

  //Toggle Active
  if (e.target.classList.contains("active")) {
    const todoActive = [...baseHolder.dataHolder]?.filter(
      (val) => val?.status[0] === "Active"
    );
    HtmlCleaner();
    todoInput(todoActive);
    defaultColors(
      "hsl(234, 11%, 52%)",
      "hsl(220, 98%, 61%)",
      "hsl(234, 11%, 52%)"
    );
  }

  //Toggle Completed
  if (e.target.classList.contains("completed")) {
    const todoCompleted = [...baseHolder.dataHolder]?.filter(
      (val) => val?.status[0] === "Completed"
    );
    HtmlCleaner();
    todoInput(todoCompleted != undefined ? todoCompleted : []);
    defaultColors(
      "hsl(234, 11%, 52%)",
      "hsl(234, 11%, 52%)",
      "hsl(220, 98%, 61%)"
    );
  }

  //Clear Completed
  if (e.target.classList.contains("clear-completed")) {
    let currentItemsValue = 0;
    [...baseHolder.dataHolder]
      ?.filter((val) => val?.status[0] === "Completed")
      .map((val, i) => val.id[0])
      .forEach((val) => {
        delete baseHolder.dataHolder[val];
        currentItemsValue++;
      });
    currentItems -= currentItemsValue;
    items.textContent = currentItems;
    HtmlCleaner();
    todoInput([...baseHolder.dataHolder]);
    defaultColors(
      "hsl(220, 98%, 61%)",
      "hsl(234, 11%, 52%)",
      "hsl(234, 11%, 52%)"
    );
  }
});
