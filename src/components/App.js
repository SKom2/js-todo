import {Todo} from "./Todo";
import {checkListClassNames, commonClassNames, tabClasses, taskClassNames} from "../utils/classNames";
import {CheckListUI, TaskUI} from "./UI";

export class App {
    constructor(checkListContainerElement, addCheckListBtn, page) {
        this._checkListContainerElement = checkListContainerElement;
        this._addCheckListBtn = addCheckListBtn;
        this._page = page;
        this._todo = new Todo();
        this._render()
    }

    init() {
        this._setupEventListeners();
        this._restoreActiveTab();
    }

    _setupEventListeners() {
        this._setupTabListeners();
        this._addCheckListBtn.addEventListener('click', () => this._handleAddCheckList());
        this._checkListContainerElement.addEventListener('click', (event) => this._handleCheckListContainerClick(event));
    }

    _setupTabListeners() {
        const tabs = ['allTasks', 'completedTasks'];
        tabs.forEach(tabId => {
            document.getElementById(tabId).addEventListener('click', () => this._handleTabClick(tabId));
        });
    }

    _handleTabClick(tab) {
        const filterType = tab === 'allTasks' ? 'all' : 'completed';
        this._filterTasks(filterType);
        this._setActiveTab(document.getElementById(tab));
    }

    _handleCheckListContainerClick(event) {
        event.preventDefault();
        const { checkListId, taskId } = this._extractIds(event.target);
        this._handleSubmitTask(event.target, checkListId);
        this._handleSubmitName(event.target, checkListId);
        if (this._isRemoveCheckListButton(event.target)) {
            this._handleRemoveCheckList(checkListId);
        } else if (this._isRemoveTaskButton(event.target)) {
            this._handleRemoveTask(taskId, checkListId);
        } else if (this._isToggleTaskButton(event.target)) {
            this._handleToggleTask(taskId, checkListId);
        }
    }

    _isAddTaskButton(target) {
        return target.classList.contains(checkListClassNames.CHECKLIST_ADD_TASK_BTN);
    }

    _isSetNameButton(target) {
        return target.classList.contains(checkListClassNames.CHECKLIST_ADD_NAME_BTN);
    }

    _isEditNameButton(target){
        return target.classList.contains(checkListClassNames.CHECKLIST_ADD_NAME_BTN) || target.classList.contains(checkListClassNames.CHECKLIST_ADD_BTN_ICON)
    }

    _isRemoveCheckListButton(target) {
        return target.classList.contains(checkListClassNames.REMOVE_BTN);
    }

    _isRemoveTaskButton(target) {
        return target.classList.contains(taskClassNames.REMOVE_BIN) || target.classList.contains(taskClassNames.REMOVE_BIN_ICON);
    }

    _isToggleTaskButton(target) {
        return target.classList.contains(taskClassNames.CHECKBOX) || target.classList.contains(taskClassNames.TASK_LABEL);
    }

    _handleSubmitTask(target, checkListId) {
        this._validateInputImmediately(target);
        const inputContent = this._getInputContent(target);
        const checkListName = this._todo.getCheckListById(checkListId).name;
        if (!inputContent || inputContent.length < 5 || checkListName === '') return;
        if (this._isAddTaskButton(target)){
            this._todo.handleAddTask(inputContent, checkListId);
            this._clearInput(target);
            this._render(checkListId);
        }
    }

    _handleSubmitName(target, checkListId) {
        this._validateInputImmediately(target);
        const inputContent = this._getInputContent(target);
        if (!inputContent || inputContent.length < 5) return;
        if (this._isSetNameButton(target)){
            this._todo.setCheckListName(inputContent, checkListId);
            this._clearInput(target);
            this._render(checkListId);
        }
    }

    _validateInput(inputElement) {
        const buttonElement = inputElement.nextElementSibling;
        const isValid = inputElement.value.trim().length >= 5;
        buttonElement.disabled = !isValid;
        inputElement.classList.toggle('valid', isValid);
        buttonElement.classList.toggle('valid', isValid);
    }

    _setupInputValidationListener(inputElement) {
        inputElement.addEventListener('input', (event) => this._validateInput(event.target));
    }

    _handleEditButton(spanElement, target){
        if (this._isEditNameButton(target)){
            const { checkListId } = this._extractIds(target);

            this._todo.editCheckListName(spanElement.textContent, checkListId);
            this._render(checkListId);
        }
    }

    _validateInputImmediately(target) {
        const form = target.closest(`.${commonClassNames.FORM}`);
        if (!form) return;
        const inputElement = form.querySelector(`.${commonClassNames.FORM_INPUT}`);
        if (inputElement) this._setupInputValidationListener(inputElement);
        const spanElement = form.querySelector(`.${commonClassNames.SET_NAME}`);
        if (spanElement) this._handleEditButton(spanElement, target)
    }

    _handleRemoveCheckList(checkListId) {
        this._todo.removeCheckList(checkListId);
        this._render();
    }

    _handleRemoveTask(taskId, checkListId) {
        this._todo.handleRemoveTask(taskId, checkListId);
        this._render(checkListId);
    }

    _handleAddCheckList() {
        this._todo.addCheckList({
            id: Date.now(),
            name: '',
            tasks: [],
            isSetName: false,
        });
        this._render();
    }

    _handleToggleTask(taskId, checkListId) {
        this._todo.handleToggleTask(taskId, checkListId);
        this._render(checkListId, taskId);
    }

    _getInputContent(target) {
        const form = target.closest(`.${commonClassNames.FORM}`);
        const inputElement = form?.querySelector(`.${commonClassNames.FORM_INPUT}`);
        return inputElement?.value.trim();
    }

    _clearInput(target) {
        const form = target.closest(`.${commonClassNames.FORM}`);
        const inputElement = form?.querySelector(`.${commonClassNames.FORM_INPUT}`);
        if (inputElement) inputElement.value = '';
    }

    _extractIds(target) {
        const checkListElement = target.closest(`.${checkListClassNames.CHECKLIST}`);
        const taskElement = target.closest(`.${taskClassNames.TASK}`);
        return {
            checkListId: checkListElement ? parseInt(checkListElement.dataset.checklistId, 10) : null,
            taskId: taskElement ? parseInt(taskElement.dataset.taskId, 10) : null,
        };
    }

    _toggleAddCheckListButton(activeTabId) {
        if (activeTabId === 'completedTasks') {
            this._addCheckListBtn.style.display = 'none';
        } else {
            this._addCheckListBtn.style.display = 'block';
        }
    }

    _setActiveTab(activeTabElement) {
        document.querySelectorAll(`.${tabClasses.NAV_TAB}`).forEach(tab => {
            tab.classList.remove(tabClasses.ACTIVE_TAB);
        });
        activeTabElement.classList.add(tabClasses.ACTIVE_TAB);
        localStorage.setItem('activeTab', activeTabElement.id);

        this._toggleAddCheckListButton(activeTabElement.id);
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

    _restoreActiveTab() {
        const savedTab = localStorage.getItem('activeTab');
        if (!savedTab) return;
        const tabElement = document.getElementById(savedTab);
        if (!tabElement) return;
        this._handleTabClick(savedTab);
    }

    _render(updatedCheckListId = null, updatedTaskId = null) {
        if (updatedCheckListId && updatedTaskId) {
            const checkList = this._todo.getCheckListById(updatedCheckListId);
            const task = checkList ? checkList.getTaskById(updatedTaskId) : null;
            if (!task) return;
            const taskElement = this._checkListContainerElement.querySelector(`[data-task-id="${updatedTaskId}"]`);
            if (!taskElement) return;
            const updatedTaskElement = TaskUI.getTask(task);
            taskElement.parentNode.replaceChild(updatedTaskElement, taskElement);
        } else if (updatedCheckListId) {
            const updatedCheckListElement = this._checkListContainerElement.querySelector(`[data-checklist-id="${updatedCheckListId}"]`);
            if (!updatedCheckListElement) return;
            const isCompletedPage = this._page === 'completed';
            const checkListData = this._todo.getCheckListById(updatedCheckListId);
            const updatedCheckList = CheckListUI.getCheckList(checkListData, isCompletedPage);
            this._checkListContainerElement.replaceChild(updatedCheckList, updatedCheckListElement);
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