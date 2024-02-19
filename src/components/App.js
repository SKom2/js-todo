import {Todo} from "./Todo";
import {checkListClassNames, commonClassNames, tabClasses, taskClassNames} from "../utils/classNames";
import {CheckListUI, TaskUI} from "./UI";

export class App {
    constructor(checkListContainerElement, addCheckListBtn, page) {
        this._checkListContainerElement = checkListContainerElement;
        this._addCheckListBtn = addCheckListBtn;
        this._page = page;
        this._todo = new Todo();
    }

    init(){

        this._addCheckListBtn.addEventListener('click', this._handleAddCheckListBtnClick.bind(this))
        this._checkListContainerElement.addEventListener('click', this._handleCheckListEventListeners.bind(this))

        const allTasksTab = document.querySelector('#allTasks');
        const completedTasksTab = document.querySelector('#completedTasks');

        allTasksTab.addEventListener('click', () => {
            this._filterTasks('all')
            this._setActiveTab(allTasksTab);
        });
        completedTasksTab.addEventListener('click', () => {
            this._filterTasks('completed')
            this._setActiveTab(completedTasksTab);
        });

        const savedTab = localStorage.getItem('activeTab');
        if (savedTab) {
            const tabElement = document.querySelector(`#${savedTab}`);
            if (tabElement) {
                this._filterTasks(savedTab === 'allTasks' ? 'all' : 'completed');
                this._setActiveTab(tabElement);
            }
        }
    }

    _handleCheckListEventListeners(event){
        event.preventDefault();
        this._handleSubmit(event)
        this._handleRemoveCheckList(event)
        this._handleRemoveTask(event)
        this._handleToggleTask(event)
    }

    _setActiveTab(activeTabElement) {
        const tabs = document.querySelectorAll(`.${tabClasses.NAV_TAB}`);
        tabs.forEach(tab => {
            tab.classList.remove(tabClasses.ACTIVE_TAB)
        });
        activeTabElement.classList.add(tabClasses.ACTIVE_TAB);

        localStorage.setItem('activeTab', activeTabElement.id);
    }

    _filterTasks(filterType) {
        this._page = filterType;
        const filteredCheckLists = this._todo.getCheckLists().map(checkList => {
            if (filterType === 'completed') {
                const completedTasks = checkList.tasks.filter(task => task.completed);
                return { ...checkList, tasks: completedTasks };
                } else {
                    return checkList;
                }
        });
        this._renderFilteredCheckLists(filteredCheckLists);
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
        if (target.classList.contains(taskClassNames.REMOVE_BIN) || target.classList.contains(taskClassNames.REMOVE_BIN_ICON)) {
            const {taskId, checkListId} = this._getChecklistAndTaskIds(target);
            this._todo.handleRemoveTask(taskId, checkListId);

            if (this._page === 'completed') {
                this._filterTasks('completed');
            } else {
                this._render(checkListId);
            }
        }
    }

    _handleToggleTask(event){
        const target = event.target;
        if (this._page === 'all'){
            if (target.classList.contains(taskClassNames.CHECKBOX) || target.classList.contains(taskClassNames.TASK_LABEL)){
                const { taskId, checkListId } = this._getChecklistAndTaskIds(target);
                this._todo.handleToggleTask(taskId, checkListId);
                this._render(checkListId, taskId);
            }
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
                const isCompletedPage = this._page === 'completed';
                const checkListData = this._todo.getCheckListById(updatedCheckListId);
                const updatedCheckList = CheckListUI.getCheckList(checkListData, isCompletedPage);
                this._checkListContainerElement.replaceChild(updatedCheckList, updatedCheckListElement);
            }
        } else {
            this._checkListContainerElement.innerHTML = '';
            const checkListsArr = this._todo.getCheckLists();
            CheckListUI.fillTodo(this._checkListContainerElement, checkListsArr);
        }
    }

    _renderFilteredCheckLists(filteredCheckLists) {
        this._checkListContainerElement.innerHTML = '';
        const isCompletedPage = this._page === 'completed';
        if (isCompletedPage){
            filteredCheckLists = filteredCheckLists.filter(checkList => checkList.tasks.length !== 0)
        }
        CheckListUI.fillTodo(this._checkListContainerElement, filteredCheckLists, isCompletedPage);

    }
}