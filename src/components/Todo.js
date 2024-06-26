import {CheckList} from "./CheckList"
export class Todo {
    constructor() {
        const storedCheckLists = JSON.parse(localStorage.getItem('checklists')) || [];
        if (storedCheckLists.length === 0) {
            storedCheckLists.push(this._createEmptyCheckList());
        }
        this._checkLists = storedCheckLists.map((checkList) => {
            return new CheckList(checkList)
        })
        this._saveCheckLists()
    }

    _createEmptyCheckList() {
        return {
            id: Date.now(),
            name: '',
            tasks: [],
            isSetName: false,
        };
    }

    _saveCheckLists(){
        localStorage.setItem('checklists', JSON.stringify(this._checkLists));
    }


    setCheckListName(name, checkListId){
        this.checkList = this._checkLists.find(checkList => checkList.id === checkListId);
        this.checkList.name = name;
        this.checkList.isSetName = true;
        this._saveCheckLists();
    }

    editCheckListName(name, checkListId){
        this.checkList = this._checkLists.find(checkList => checkList.id === checkListId);
        this.checkList.name = name;
        this.checkList.isSetName = false;
        this._saveCheckLists();
    }

    addCheckList(checkListData) {
        this._checkLists.unshift(new CheckList(checkListData))
        this._saveCheckLists();
    }

    removeCheckList(checkListId){
        this._checkLists = this._checkLists.filter(checkList => checkList.id !== checkListId);
        this._saveCheckLists();
    }

    getCheckListById(checkListId){
        this.checkList = this._checkLists.find(checkList => checkList.id === checkListId);
        return this.checkList;
    }

    getCheckLists(){
        return this._checkLists;
    }

    handleAddTask(text, checkListId) {
        this.checkList = this._checkLists.find(checkList => checkList.id === checkListId);
        this.checkList.addTask({
            id: Date.now(),
            text: text,
            completed: false,
        });
        this._saveCheckLists();
    }


    handleRemoveTask(taskId, checkListId){
        this.checkList = this._checkLists.find(checkList => checkList.id === checkListId);
        this.checkList.removeTask(taskId)
        this._saveCheckLists();
    }

    handleToggleTask(taskId, checkListId) {
        this.checkList = this._checkLists.find(checkList => checkList.id === checkListId);
        this.checkList.toggleTaskCompleted(taskId)
        this._saveCheckLists();
    }
}
