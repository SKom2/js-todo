import {Todo} from "./Todo";
import {checkListClassNames, commonClassNames, taskClassNames} from "../utils/classNames";
import {CheckListUI, TaskUI} from "./UI";

export class App {
    constructor(checkListContainerElement, addCheckListBtn) {
        this._checkListContainerElement = checkListContainerElement;
        this._addCheckListBtn = addCheckListBtn;
    }

    init(){
        this._todo = new Todo();

        this._addCheckListBtn.addEventListener('click', this._handleAddCheckListBtnClick.bind(this))
        this._checkListContainerElement.addEventListener('click', this._handleCheckListEventListeners.bind(this))

        this._render()
    }

    _handleCheckListEventListeners(event){
        event.preventDefault();
        this._handleSubmit(event)
        this._handleRemoveCheckList(event)
        this._handleRemoveTask(event)
        this._handleToggleTask(event)
    }

    _getChecklistAndTaskIds(target) {
        const checkListElement = target.closest(`.${checkListClassNames.CHECKLIST}`);
        const taskElement = target.closest(`.${taskClassNames.TASK}`);
        return {
            checkListId: checkListElement ? Number(checkListElement.dataset.checklistId) : null,
            taskId: taskElement ? Number(taskElement.dataset.taskId) : null,
        };
    }

    _handleRemoveTask(event){
        const target = event.target;

        if (target.classList.contains(taskClassNames.REMOVE_BIN) || target.classList.contains(taskClassNames.REMOVE_BIN_ICON)){
            const { taskId, checkListId } = this._getChecklistAndTaskIds(target);
            this._todo.handleRemoveTask(taskId, checkListId);
            this._render(checkListId);
        }
    }

    _handleToggleTask(event){
        const target = event.target;
        if (target.classList.contains(taskClassNames.CHECKBOX) || target.classList.contains(taskClassNames.TASK_LABEL)){
            const { taskId, checkListId } = this._getChecklistAndTaskIds(target);
            this._todo.handleToggleTask(taskId, checkListId);
            this._render(checkListId, taskId);
        }
    }

    _handleSubmit(event) {
        const target = event.target;

        const form = event.target.closest(`.${commonClassNames.FORM}`);
        if (!form) {
            return;
        }

        const inputElement = form.querySelector(`.${commonClassNames.FORM_INPUT}`);
        const spanElement = form.querySelector(`.${commonClassNames.SET_NAME}`);

        if (inputElement) {
            inputElement.addEventListener('input', (event) => {
                const buttonElement = inputElement.nextElementSibling;
                const value = event.target.value;
                if (value.length >= 5) {
                    buttonElement.removeAttribute('disabled')
                    event.target.classList.add('valid')
                    buttonElement.classList.add('valid')
                } else {
                    buttonElement.setAttribute('disabled', 'true')
                    event.target.classList.remove('valid')
                    buttonElement.classList.remove('valid')
                }
            })

            const inputContent = inputElement.value.trim();
            if (inputContent.length < 5) {
                return;
            }

            if (target.classList.contains(checkListClassNames.CHECKLIST_ADD_TASK_BTN)) {
                const { checkListId } = this._getChecklistAndTaskIds(target);
                this._todo.handleAddTask(inputContent, checkListId);
                inputElement.value = '';
                this._render(checkListId);
            }
            if (target.classList.contains(checkListClassNames.CHECKLIST_ADD_NAME_BTN)) {
                const { checkListId } = this._getChecklistAndTaskIds(target);
                this._todo.setCheckListName(inputContent, checkListId);
                inputElement.value = '';
                this._render(checkListId);
            }
        }

        if (spanElement){
            if (target.classList.contains(checkListClassNames.CHECKLIST_ADD_NAME_BTN) || target.classList.contains(checkListClassNames.CHECKLIST_ADD_BTN_ICON) ) {
                const { checkListId } = this._getChecklistAndTaskIds(target);

                this._todo.editCheckListName(spanElement.textContent, checkListId);
                this._render(checkListId);
            }
        }
    }

    _handleRemoveCheckList(event){
        const target = event.target;

        if (target.classList.contains(checkListClassNames.REMOVE_BTN)){
            const { checkListId } = this._getChecklistAndTaskIds(target);
            this._todo.removeCheckList(checkListId);
            this._render();
        }
    }

    _handleAddCheckListBtnClick(event){
        const target = event.target;
        if (target.classList.contains(checkListClassNames.ADD_CHECKLIST_BTN)){
            this._todo.addCheckList({
                id: Date.now(),
                name: '',
                tasks: [],
                isSetName: false,
            })
            this._render();
        }
    }

    _render(updatedCheckListId = null, updatedTaskId = null) {
        if (updatedCheckListId && updatedTaskId) {
            const checkList = this._todo.getCheckListById(updatedCheckListId);
            const task = checkList ? checkList.getTaskById(updatedTaskId) : null;
            if (task) {
                const taskElement = this._checkListContainerElement.querySelector(`[data-task-id="${updatedTaskId}"]`);
                if (taskElement) {
                    const updatedTaskElement = TaskUI.getTask(task);
                    taskElement.parentNode.replaceChild(updatedTaskElement, taskElement);
                }
            }
        } else if (updatedCheckListId) {
            const updatedCheckListElement = this._checkListContainerElement.querySelector(`[data-checklist-id="${updatedCheckListId}"]`);
            if (updatedCheckListElement) {
                const checkListData = this._todo.getCheckListById(updatedCheckListId);
                const updatedCheckList = CheckListUI.getCheckList(checkListData);
                this._checkListContainerElement.replaceChild(updatedCheckList, updatedCheckListElement);
            }
        } else {
            this._checkListContainerElement.innerHTML = '';
            const checkListsArr = this._todo.getCheckLists();
            CheckListUI.fillTodo(this._checkListContainerElement, checkListsArr);
        }
    }
}