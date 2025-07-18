// let btn = document.querySelector("button");
// let ul = document.querySelector("ul");
// let inp = document.querySelector("input");

// btn.addEventListener("click", function() {
//     let item = document.createElement("li");
//     item.innerText = inp.value;

//     let delBtn = document.createElement("button");
//     delBtn.innerText = "delete";
//     delBtn.classList.add("delete");

//     item.appendChild(delBtn);
//     ul.appendChild(item);
//     inp.value = "";
// })

// ul.addEventListener("click", function(event){
//     if(event.target.nodeName == "BUTTON"){
//         let listItem = event.target.parentElement;
//         listItem.remove();
//         console.log("deleted");
//     } 
// });

// //let delBtns = document.querySelector(".delete");
// //for (delBtn of delBtns) {
// //    delBtn.addEventListener ("click", function() {
// //        let par = this.parentElement;
// //        console.log(par);
// //        par.remove();
// //    });
// //}


    const addBtn = document.getElementById("add-btn");
    const taskInput = document.getElementById("task-input");
    const taskList = document.getElementById("task-list");

    addBtn.addEventListener("click", addTask);
    taskInput.addEventListener("keypress", function(e) {
      if (e.key === "Enter") addTask();
    });

    function addTask() {
      const taskText = taskInput.value.trim();
      if (taskText === "") return;

      const li = document.createElement("li");

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.addEventListener("change", () => {
        li.classList.toggle("completed");
      });

      const span = document.createElement("span");
      span.textContent = taskText;

      const del = document.createElement("button");
      del.textContent = "✖"; // ✖
      del.addEventListener("click", () => {
        li.remove();
      });

      li.append(checkbox, span, del);
      taskList.appendChild(li);
      taskInput.value = "";
    }
  function toggleMode() {
  document.body.classList.toggle("dark-mode");
  const btn = document.querySelector('.toggle-mode');
  if (document.body.classList.contains('dark-mode')) {
    btn.textContent = '☀️';
  } else {
    btn.textContent = '🌙';
  }
}
