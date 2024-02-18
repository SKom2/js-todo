import {CheckList} from "./CheckList"
export class Todo {
    constructor() {
        const storedCheckLists = JSON.parse(localStorage.getItem('checkLists')) || [];
        this._checkLists = storedCheckLists.map((checkList) => {
            return new CheckList(checkList)
        })
    }

    _saveCheckLists(){
        localStorage.setItem('checkLists', JSON.stringify(this._checkLists));
    }

    addCheckList(checkListData) {
        this._checkLists.unshift(new CheckList(checkListData))
        this._saveCheckLists();
    }

    removeCheckList(checkListId){
        this._checkLists = this._checkLists.filter(checkList => checkList.id !== checkListId);
        this._saveCheckLists();
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
