export class Task {
    constructor(data) {
        this.text = data.text;
        this.completed = data.completed;
        this.id = data.id;
    }

    toggleCompleted(){
        this.completed = !this.completed;
    }
}