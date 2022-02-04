let allTasks = [];
let inputValue = '';
let input = null;

buttonClick = async () => {
  if(!inputValue) {
    alert('Необходимо внести значение');
    render();
  } else {
    allTasks.push({
      text: inputValue,
      isCheck: false
    });
    const respon = await fetch('http://localhost:8000/createTask', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        text: inputValue,
        isCheck: false
      })
    });
    let result = await respon.json();
    allTasks = result.data;
  }
  inputValue = '';
  input.value = '';
  render();
}

getFreshTask = async () => {
  const respon = await fetch('http://localhost:8000/allTasks', {
    method: 'GET'
  });
  let result = await respon.json();
  allTasks = result.data;
  render();
}

window.onload = async () => {
  input = document.getElementById('add-tasks');
  input.addEventListener('change', updateValue);
  getFreshTask();
}

updateValue = (event) => {
  inputValue = event.target.value;
}

render = () => {
  const content = document.getElementById('content-page');
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
    checkbox.onchange = () => onChangeCheckbox(item.id, item.isCheck);

    container.appendChild(checkbox);
    const text = document.createElement('p');
    text.innerText = item.text;
    text.id = `text-${index}`;
    text.className = item.isCheck ? 'text-task done-text' : 'text-task' ;
    container.appendChild(text);

    if (!item.isCheck) {
      const editImg = document.createElement('div');
      const imageEdit = document.createElement('img');
      imageEdit.src = 'svg/edit.svg';
      editImg.appendChild(imageEdit);
      container.appendChild(editImg);

      editImg.onclick = () => {
        const textTask = text.innerText;
        text.innerText = '';
        container.removeChild(checkbox);
        container.removeChild(editImg);
        container.removeChild(deleteImg);

        onClickEdit(container, item.id, textTask);
      }
    }
    
    const deleteImg = document.createElement('div');
    const imageDelete = document.createElement('img');
    imageDelete.src = 'svg/close.svg';
    deleteImg.appendChild(imageDelete);
    container.appendChild(deleteImg);
    deleteImg.onclick = () => onClickDelete(item.id);

    content.appendChild(container);

  });
}

onChangeCheckbox = async (index, check) => {
  const respon = await fetch('http://localhost:8000/updateTask', {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      'Access-Control-Allow-Origin': '*'
    },
      body: JSON.stringify({
      id: index,
      isCheck: !check
    })
  });
  let result = await respon.json();
  allTasks = result.data;
  getFreshTask();
}

onClickDelete = async (index) => {
  const respon = await fetch(`http://localhost:8000/deleteTask?id=${index}`, {
    method: 'DELETE'
    });
  let result = await respon.json();
  allTasks = result.data;
  getFreshTask();
}

onClickEdit = (container, index, textTask) => {
  const inputBox = document.createElement('input');
  inputBox.type = 'text';
  inputBox.value = textTask;
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
      onEdit(inputBox.value, index);
    }
  }
}

onEdit = async (editText, index) => {
  const respon = await fetch('http://localhost:8000/updateTask', {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      'Access-Control-Allow-Origin': '*'
    },
      body: JSON.stringify({
      id: index,
      text: editText
    })
  });
  let result = await respon.json();
  allTasks = result.data;
  getFreshTask();
}

// deleteAllClick = async () => {
//   await allTasks.map(item => {
    
//   });
//   getFreshTask();
// }