import {Todo} from "./Todo";
import {CheckList} from "./CheckList";
import {checkListClassNames, taskClassNames} from "../utils/classNames";
import {CheckListUI, TaskUI} from "./UI";

export class App {
    constructor(todoElement, addCheckListBtn) {
        this._todoElement = todoElement;
        this._addCheckListBtn = addCheckListBtn;
    }

    init(){
        this.todo = new Todo();
        this._addCheckListBtn.addEventListener('click', this.handleAddCheckListBtnClick.bind(this))
        this._todoElement.addEventListener('click', this.handleRemoveCheckListBtnClick.bind(this))

        this._todoElement.addEventListener('click', event => {
            const target = event.target;
            const checkListElement = target.closest('.checkList');
            const checkListId = checkListElement ?  Number(checkListElement.dataset.id) : null;
            const taskElement = target.closest('.task');
            const taskId = taskElement ?  Number(taskElement.dataset.id) : null;
            if (target.classList.contains(taskClassNames.REMOVE_BIN) || target.classList.contains(taskClassNames.REMOVE_BIN_ICON)){
                this.todo.handleRemoveTask(taskId, checkListId);
                this.render();
            }
            if (target.classList.contains(taskClassNames.CHECKBOX) || target.classList.contains(taskClassNames.TASK__LABEL)){
                this.todo.handleToggleTask(taskId, checkListId);
                this.render();
            }
        });

        this._todoElement.addEventListener('click', this.handleSubmit.bind(this))

        this.render()
    }

    handleSubmit(event) {
        event.preventDefault();
        const target = event.target;

        const form = event.target.closest('.form');
        if (!form) {
            return;
        }

        const inputElement = form.querySelector('.addTaskLabel__input');
        if (!inputElement) {
            return;
        }
        inputElement.addEventListener('input', (event) => {
            const buttonElement = inputElement.nextElementSibling;
            const value = event.target.value;
            if (value.length >= 5) {
                event.target.classList.add('valid')
                buttonElement.classList.add('valid')
            } else {
                event.target.classList.remove('valid')
                buttonElement.classList.remove('valid')
            }
        })

        const taskContent = inputElement.value.trim();
        if (taskContent.length < 5) {
            return;
        }
        const checkListElement = form.closest('.checkList');
        const checkListId = checkListElement ? Number(checkListElement.dataset.id) : null;
        if (target.classList.contains(taskClassNames.ADD_TASK_BTN)) {
            this.todo.handleAddTask(taskContent, checkListId);
            inputElement.value = '';
            this.render();
        }
    }

    handleRemoveCheckListBtnClick(event){
        event.preventDefault();
        const target = event.target;
        const checkListElement = target.closest('.checkList');
        const checkListId = checkListElement ? Number(checkListElement.dataset.id) : null;
        if (target.classList.contains(checkListClassNames.REMOVE_BTN)){
            this.todo.removeCheckList(checkListId);
            this.render();
        }
    }

    handleAddCheckListBtnClick(event){
        event.preventDefault();
        const target = event.target;
        if (target.classList.contains(checkListClassNames.ADD_CHECKLIST_BTN)){
            this.todo.addCheckList({
                id: Math.random(),
                name: 'Check List 1',
                tasks: [],
                valid: false,
            })
            this.render();
        }
    }

    render(){
        this._todoElement.innerHTML = '';
        const checkListsArr = this.todo.getCheckLists();
        CheckListUI.fillTodo(this._todoElement, checkListsArr);
    }
}