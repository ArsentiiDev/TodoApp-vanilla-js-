//variables
const months = [
    'january',
    'february',
    'march',
    'april',
    'may',
    'june',
    'july',
    'august',
    'september',
    'october',
    'november',
    'december',
];
let activeCount = 0;
let archiveCount =0;
const categories = {};
//selectors
const todoName = document.querySelector('.add_todo_name');
const todoContent = document.querySelector('.add_todo_content');
const todoButton = document.querySelector('.add_todo_btn');
const todoList = document.querySelector('.todo_list');
const todoCategory = document.querySelector('.category_list');
const todoDates = document.querySelector('.add_todo_dates');
const SumList = document.querySelector('.summary_list');
const sumLi = document.querySelector('.summary_list_li');
let categoryCount = 0;

//event listeners
document.addEventListener('DOMContentLoaded',getTodos);
todoButton.addEventListener('click', addItem);
todoList.addEventListener('click', deleteEditArchive);
//functions
function addItem(event) {
    //prevent from submitting
    let index = -1;
    activeCount++;
    event.preventDefault()
    const todoDiv = document.createElement('div');
    todoDiv.classList.add('list_item_div')
    //create todoList
    const newTodo = document.createElement('li');
    const date = new Date()
    let creationDate = getDate(date);
    let dates = (todoDates.value).split(',')
    /*newTodo.innerHTML='<form>'+'<div class="todoNameIcon">'+setIcon(todoCategory.value)+checkNull(todoName.value)+'</div>'+'<span class="todo_list_date">'+months[date.getMonth()]+' '+date.getDay()+','+date.getFullYear()+'</span>'+'<span class="todo_item_category">'+todoCategory.value+'</span>'+'<span class="todo_item_content">'+checkNull(todoContent.value)+'</span>'+'<span class="todo_list_dates>'+dates+'</span></form>';*/
    newTodo.innerHTML=`<form><span>${setIcon(todoCategory.value)} ${checkNull(todoName.value)}</span><span>${creationDate}</span><span>${todoCategory.value}</span><span>${checkNull(todoContent.value)}</span><span>${dates}</span></form>`;
    //newTodo.innerHTML=<form>'+'<span>'+setIcon(todoCategory.value)+checkNull(todoName.value)+'</span>'+'<span>'+creationDate+'</span>'+'<span>'+todoCategory.value+'</span>'+'<span>'+checkNull(todoContent.value)+'</span>'+'<span>'+dates+'</span>'+'</form>';
    newTodo.classList.add('list_item_li')
    todoDiv.appendChild(newTodo);
    //add toDo to local storage
    saveLocal(todoName.value,creationDate,todoCategory.value,todoContent.value,dates);
    //create summary list
    if(todoCategory.value in categories){
        categories[todoCategory.value]=++categoryCount;
        let category = SumList.getElementsByClassName(`${todoCategory.value}`)[0];
        console.log(category);
        let count = category.getElementsByClassName('count')[0];
        count.innerText = categoryCount;
    }
    else {
        categoryCount = 0;
        categories[todoCategory.value]=++categoryCount;
        addSumLi(todoCategory.value);
        
    }
    console.log(categories);
    //addSumList(categoryCount,index);
    //addSumList();
    //edit button
    const editButton = document.createElement('button');
    editButton.innerHTML = '<i class="fas fa-pencil-alt"></i>'
    editButton.classList.add('edit-btn')
    newTodo.appendChild(editButton)
    //archive button
    const archiveButton = document.createElement('button');
    archiveButton.innerHTML = '<i class="fas fa-archive"></i>'
    archiveButton.classList.add('archive-btn')
    newTodo.appendChild(archiveButton)
    //delete button
    const deleteButton = document.createElement('button');
    deleteButton.innerHTML = '<i class="fas fa-trash"></i>'
    deleteButton.classList.add('delete-btn')
    newTodo.appendChild(deleteButton)
    //append to list
    todoList.appendChild(todoDiv)
    const todos = todoList.childNodes;
    //clear input values
    todoName.value =""
    todoContent.value =""
    todoDates.value =""
}
function addSumLi(category){
    const sumTodoDiv = document.createElement('div');
    sumTodoDiv.classList.add('summary_list_div')
    const sumNewTodo = document.createElement('li');
    console.log(categories[todoCategory.value]);
    sumNewTodo.innerHTML=`<form class="${category}"><span>${setIcon(category)} ${category}</span><span class="count">${1}</span><span>${archiveCount}</span></form>`;
    sumNewTodo.classList.add('summary_list_li')
    sumTodoDiv.appendChild(sumNewTodo);
    SumList.appendChild(sumTodoDiv);

}

function getSelectedValue() {
    let selectedValue = document.querySelector(".category_list").value
    console.log(selectedValue)
}
function setIcon(value) {
    if(value == 'qoute') return '<i class="fas fa-quote-right" id="qouteIcon"></i>'
    if(value == 'task') return '<i class="fas fa-thumbtack" id="taskIcon"></i>'
    if(value == 'idea') return '<i class="fas fa-lightbulb" id="ideaIcon"></i>'
    if(value == 'random thought') return '<i class="fas fa-head-side-virus" id="randomIcon"></i>'
    if(value == 'none') return '<i class="fas fa-exclamation-triangle"></i>'
}
function checkNull(value) {
    if(!value) return 'None';
    else return value;
}
function getDate(date){
    return months[date.getMonth()]+' '+date.getDay()+','+date.getFullYear();
}
function deleteEditArchive(e) {
    const item = e.target;
    //delete
    const todo = item.parentElement;
    if(item.classList[0]==='delete-btn'){
        removeLocalTodos(todo);
        todo.remove();
    } else if(item.classList[0]==='edit-btn'){
        const form = todo.firstElementChild;
        const spans = form.childNodes;
        spans.forEach(function(currentValue,currentIndex,listObj){
            if(currentIndex==1) ++currentIndex;
            if(currentIndex==2){
                const select = document.createElement('select');
                let firstOption = new Option('Select:','none');
                let secondOption = new Option('Random Thought','random thought');
                let thirdOption = new Option("Idea","idea");
                let forthOption = new Option('Task','task');
                let fifthOption = new Option('Qoute','qoute');
                let options = [firstOption,secondOption,thirdOption,forthOption,fifthOption];
                for(let i=0; i<5; i++){
                select.options[select.options.length]=options[i];
                }
                select.classList.add('edit_select');
                form.insertBefore(select,spans[currentIndex]);
                form.removeChild(spans[++currentIndex]);
            }
            const input = document.createElement('input');
            input.type = "text";
            input.value=spans[currentIndex].textContent;
            input.classList.add('edit_input')
            form.insertBefore(input,spans[currentIndex]);
            form.removeChild(spans[++currentIndex])
        })
        const newSpans = form.childNodes;
        newSpans[2].onchange=function(){
            let selected = this.options[this.selectedIndex];
            return selected.value;
        }
        const submitBtn = item.firstChild;
        submitBtn.classList.toggle('fa-pencil-alt');
        submitBtn.classList.toggle('fa-check');
        item.classList.toggle('edit-btn');
        item.classList.toggle('submit-btn');
    } else if (item.classList[0]==='submit-btn'){
        const form = todo.firstElementChild;
        const spans = form.childNodes;
        spans.forEach(function(currentValue,currentIndex,listObj){
            const span = document.createElement('span');
            if(currentIndex==0){
            span.innerHTML=setIcon(spans[2].value)+spans[currentIndex].value;
            form.insertBefore(span,spans[currentIndex]);
            form.removeChild(spans[++currentIndex]);
            } else if(currentIndex==1) {++currentIndex;
            }else if(currentIndex==2){
                span.textContent = spans[currentIndex].value;
                form.insertBefore(span,spans[currentIndex]);
                form.removeChild(spans[++currentIndex]);   
                ++currentIndex;
            }else {
            span.textContent = currentValue.value;
            form.insertBefore(span,spans[currentIndex]);
            form.removeChild(spans[++currentIndex]);   
            }
        })
        const submitBtn = item.firstChild;
        submitBtn.classList.toggle('fa-check');
        submitBtn.classList.toggle('fa-pencil-alt');
        item.classList.toggle('submit-btn');
        item.classList.toggle('edit-btn');
    } else if (item.classList[0]==='archive-btn'){
        todo.style.display = "none";
    }
}

function saveLocal(name,date,category,content,dates){
    //check
    let todos;
    if(localStorage.getItem('todos') === null){
        todos = [];
    } else{
        todos = JSON.parse(localStorage.getItem('todos'));
    }
    let obj = [name,date,category,content,dates]
    todos.push(obj);
    localStorage.setItem('todos',JSON.stringify(todos));
}
function getTodos() {
    let todos;
    if(localStorage.getItem('todos') === null){
        todos = [];
    } else{
        todos = JSON.parse(localStorage.getItem('todos'));
    }
    let index = -1;
    todos.forEach(function(todo){
        //div
        activeCount++;
        const todoDiv = document.createElement('div');
        todoDiv.classList.add('list_item_div')
        //create todoList
        const newTodo = document.createElement('li');
        let dates = (todoDates.value).split(',')
        /*newTodo.innerHTML='<form>'+'<div class="todoNameIcon">'+setIcon(todoCategory.value)+checkNull(todoName.value)+'</div>'+'<span class="todo_list_date">'+months[date.getMonth()]+' '+date.getDay()+','+date.getFullYear()+'</span>'+'<span class="todo_item_category">'+todoCategory.value+'</span>'+'<span class="todo_item_content">'+checkNull(todoContent.value)+'</span>'+'<span class="todo_list_dates>'+dates+'</span></form>';*/
        newTodo.innerHTML='<form>'+'<span>'+setIcon(todo[2])+checkNull(todo[0])+'</span>'+'<span>'+todo[1]+'</span>'+'<span>'+todo[2]+'</span>'+'<span>'+todo[3]+'</span>'+'<span>'+todo[4]+'</span>'+'</form>';
        newTodo.classList.add('list_item_li')
        todoDiv.appendChild(newTodo);
        
        //create summary list
        if(todo[2] in categories){
            categories[todo[2]]=++categoryCount;
            let category = SumList.getElementsByClassName(`${todo[2]}`)[0];
            console.log(category);
            let count = category.getElementsByClassName('count')[0];
            count.innerText = categoryCount;
        }
        else {
            categoryCount = 0;
            categories[todo[2]]=++categoryCount;
            addSumLi(todo[2]);
            let category = SumList.getElementsByClassName(`${todo[2]}`)[0];
            console.log(category);
            
        }
        console.log(categories);
        //let count = document.querySelector('.count');
        //count.innerText = 'lol';
        //edit button
        const editButton = document.createElement('button');
        editButton.innerHTML = '<i class="fas fa-pencil-alt"></i>'
        editButton.classList.add('edit-btn')
        newTodo.appendChild(editButton)
        //archive button
        const archiveButton = document.createElement('button');
        archiveButton.innerHTML = '<i class="fas fa-archive"></i>'
        archiveButton.classList.add('archive-btn')
        newTodo.appendChild(archiveButton)
        //delete button
        const deleteButton = document.createElement('button');
        deleteButton.innerHTML = '<i class="fas fa-trash"></i>'
        deleteButton.classList.add('delete-btn')
        newTodo.appendChild(deleteButton)
        //append to list
        todoList.appendChild(todoDiv)
        const todos = todoList.childNodes; 
    })
}
function removeLocalTodos(todo) {
    let todos;
    if(localStorage.getItem('todos') === null){
        todos = [];
    } else{
        todos = JSON.parse(localStorage.getItem('todos'));
    }
    const todoIndex = todo.innerText[0];
    console.log(todo.innerText);
    console.log(todoIndex);
    for(let i=0; i<todos.length;i++){
        if(todos[i][0]==todoIndex){
            todos.splice(i,1);
            break;
        }
    }
    console.log(todos);
    localStorage.setItem('todos', JSON.stringify(todos));
}