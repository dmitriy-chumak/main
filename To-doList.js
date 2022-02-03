let allTasks = JSON.parse(localStorage.getItem('tasks')) || [];
let inputValue = "";
let input = null;

buttonClick = () => {
  if(!inputValue) {
    alert('Необходимо внести значение');
    render();
  } else {
    allTasks.push({
      text: inputValue,
      isCheck: false
    });
    localStorage.setItem('tasks', JSON.stringify(allTasks));
  }

  inputValue = '';
  input.value = '';
  render();
}

window.onload = () => {
  input = document.getElementById("add-tasks");
  input.addEventListener("change", updateValue);
  render();
  localStorage.setItem('tasks', JSON.stringify(allTasks));
}

updateValue = (event) => {
  inputValue = event.target.value;
}

render = () => {
  const content = document.getElementById("content-page");
  while(content.firstChild) {
    content.removeChild(content.firstChild);
  }
  allTasks
  .sort((a,b)=>{
    if (a.isCheck === b.isCheck) return 0;
    return (a.isCheck > b.isCheck ? 1 : -1);
    })
  .map((item, index) => {
    const container = document.createElement('div');
    container.id = `task-${index}`;
    container.className = 'task-container';
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = item.isCheck;
    checkbox.onchange = () => onChangeCheckbox(index);

    container.appendChild(checkbox);
    const text = document.createElement('p');
    text.innerText = item.text;
    text.className = item.isCheck ? 'text-task done-text' : 'text-task' ;
    container.appendChild(text);

    if (!item.isCheck) {
      const editImg = document.createElement('div');
      const imageEdit = document.createElement('img');
      imageEdit.src = 'svg/edit.svg';
      editImg.appendChild(imageEdit);
      container.appendChild(editImg);

      editImg.onclick = () => {
        container.removeChild(text);
        container.removeChild(checkbox);
        container.removeChild(editImg);
        container.removeChild(deleteImg);

        onClickEdit(container, index);
      }
    }
    

    const deleteImg = document.createElement('div');
    const imageDelete = document.createElement('img');
    imageDelete.src = 'svg/close.svg';
    deleteImg.appendChild(imageDelete);
    container.appendChild(deleteImg);

    deleteImg.onclick = () => onClickDelete(index);

    content.appendChild(container);

  });
}

onChangeCheckbox = (index) => {
  allTasks[index].isCheck = !allTasks[index].isCheck;
  localStorage.setItem('tasks', JSON.stringify(allTasks));
  render();
}

onClickDelete = (index) => {
  allTasks.splice(index, 1);
  localStorage.setItem('tasks', JSON.stringify(allTasks));
  render();
}

onClickEdit = (container, index) => {

  const inputBox = document.createElement('input');
  inputBox.type = 'text';
  inputBox.value = allTasks[index].text;
  container.appendChild(inputBox);

  const doneImg = document.createElement('div');
  const imageDone = document.createElement('img');
  imageDone.src = 'svg/done.svg';
  doneImg.appendChild(imageDone);
  container.appendChild(doneImg);

  const canselImg = document.createElement('div');
  const imageDelete = document.createElement('img');
  imageDelete.src = 'svg/close.svg';
  canselImg.appendChild(imageDelete);
  container.appendChild(canselImg);

  canselImg.onclick = () => render();

  doneImg.onclick = () => {
    if (inputBox.value === '') {
      alert('Значение не может быть пустым');
    } else {
      allTasks[index].text = inputBox.value;
      localStorage.setItem('tasks', JSON.stringify(allTasks));
      render();
    }
  }
}

deleteAllClick = () => {
  allTasks = [];
  localStorage.setItem('tasks', JSON.stringify(allTasks));
  render();
}