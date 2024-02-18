import {Task} from "./Task";

export class CheckList {
    constructor(checklistData) {
        this.id = checklistData.id;
        this.name = checklistData.name;
        this.valid = checklistData.valid;
        if (checklistData.tasks) {
            this.tasks = checklistData.tasks.map((task) => {
                return new Task(task);
            });
        } else {
            this.tasks = [];
        }
    }

    _saveTasks(){
        localStorage.setItem('tasks', JSON.stringify(this.tasks))
    }

    addTask(taskData){
        this.tasks.push(new Task(taskData));
        this._saveTasks();
    }

    removeTask(taskId){
        this.tasks = this.tasks.filter(task => task.id !== taskId);
        this._saveTasks();
    }

    toggleTaskCompleted(taskId){
        const task = this.tasks.find(task => task.id === taskId);
        if (!task) return;
        task.toggleCompleted();
        this._saveTasks();
    }
}