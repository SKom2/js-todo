import {checkListClassNames, taskClassNames} from "../utils/classNames";
import {createElement} from "../utils/utils";
import RemoveBin from '../assets/img/Bin.svg'
import {Task} from "./Task";

export class TaskUI {
    static getCheckboxInput(completed){
        const inputClasses = [
            taskClassNames.CHECKBOX
        ]

        if (completed) {
            inputClasses.push(taskClassNames.CHECKED);
        }

        return createElement(
            'input',
            inputClasses.join(' '),
            '',
            {
                type: "checkbox",
            }
        )
    }
    static getTaskLabel(completed, text){
        const checkBoxInput = this.getCheckboxInput(completed);
        const taskLabelClasses = [
            taskClassNames.TASK__LABEL
        ]

        if (completed){
            taskLabelClasses.push(taskClassNames.CHECKED);
        }

        const taskLabel = createElement(
            'label',
            taskLabelClasses.join(' '),
        )

        taskLabel.appendChild(checkBoxInput);

        const textNode = document.createTextNode(text);
        taskLabel.appendChild(textNode);
        return taskLabel;
    }

    static getRemoveBinImg(){
        const removeBinIconClasses = [
            taskClassNames.REMOVE_BIN_ICON
        ]

        return createElement(
            'img',
            removeBinIconClasses.join(' '),
            '',
            {
                src: RemoveBin,
                alt: 'Bin Icon'
            }
        )
    }

    static getRemoveBinBtn(){
        const removeBinImg = this.getRemoveBinImg()
        const removeBinClasses = [
            taskClassNames.REMOVE_BIN
        ]

        const removeBinBtn = createElement(
            'button',
            removeBinClasses.join(' '),
            '',
            {
                "type": 'button'
            }
        )

        removeBinBtn.append(removeBinImg);
        return removeBinBtn;
    }

   static getTask(task) {
        const taskLabel = this.getTaskLabel(task.completed, task.text);
        const removeBinBtn = this.getRemoveBinBtn();
        const taskClasses = [
            taskClassNames.TASK
        ]

       const taskElement = createElement(
           'li',
           taskClasses.join(' '),
           '',
           {
               "data-id": task.id
           }
       )
       taskElement.append(taskLabel, removeBinBtn);
        return taskElement;
   }
}

export class CheckListUI {
    static getCheckListName(name){
        const checkListNameClassNames = [
            checkListClassNames.CHECKLIST_NAME
        ]

        return createElement(
            'input',
            checkListNameClassNames.join(' '),
            name,
        )
    }

    static getCheckListRemoveButton(){
        const checkListRemoveBtnClassNames = [
            checkListClassNames.REMOVE_BTN
        ]

        return createElement(
            'button',
            checkListRemoveBtnClassNames.join(' '),
            'Удалить чек-лист',
            {
                type: 'button'
            }
        )
    }

    static getCheckListHeader(name){
        const checkListName = this.getCheckListName(name);
        const checkListRemoveBtn = this.getCheckListRemoveButton();

        const checkListHeaderClassNames = [
            checkListClassNames.CHECKLIST_HEADER
        ]

        const checkListHeader = createElement(
            'div',
            checkListHeaderClassNames.join(' ')
        )

        checkListHeader.append(checkListName, checkListRemoveBtn);

        return checkListHeader;
    }

    static getTasksList(tasks){
        const taskListNames = [
            checkListClassNames.CHECKLIST_TASKS
        ]

        const tasksList = createElement(
            'ul',
            taskListNames.join(' '),
        )

        if (tasks){
            tasks.forEach(task => {
                const taskUI = TaskUI.getTask(task)
                tasksList.appendChild(taskUI);
            })
        }


        return tasksList;
    }

    static getAddTaskInput(valid){
        const addTaskInputClassNames = [
            checkListClassNames.ADD_TASK_INPUT
        ]

    if (valid) {
            addTaskInputClassNames.push(checkListClassNames.VALID_INPUT)
        }

        return createElement(
            'input',
            addTaskInputClassNames.join(' '),
            '',
            {
                placeholder: 'Убраться на кухне',
                type: 'text'
            }
        )
    }

    static getAddTaskText(){
        const addTaskTextClassNames = [
            checkListClassNames.ADD_TASK_TEXT
        ]

        return createElement(
            'button',
            addTaskTextClassNames.join(' '),
            '+ добавить пункт',
            {
                type: 'submit'
            }
        )
    }

    // static getAddTaskLabel(valid){
    //     const addTaskInput = this.getAddTaskInput(valid);
    //     const addTaskText = this.getAddTaskText();
    //     const addTaskBtnClassNames = [
    //         checkListClassNames.ADD_TASK_BTN,
    //     ]
    //
    //     const addTaskLabel = createElement(
    //         'label',
    //         addTaskBtnClassNames.join(' ')
    //     )
    //     addTaskLabel.append(addTaskInput, addTaskText)
    //
    //     return addTaskLabel;
    // }

    static getAddTaskForm(valid) {
        const addTaskInput = this.getAddTaskInput(valid);
        const addTaskText = this.getAddTaskText();

        const addTaskFormClassNames = [
            checkListClassNames.ADD_TASK_FORM
        ]

        const addTaskForm = createElement(
            'form',
            addTaskFormClassNames.join(' ')
        )

        addTaskForm.append(addTaskInput, addTaskText);

        return addTaskForm;
    }

    static getCheckList(checkList){
        const checkListHeader = this.getCheckListHeader(checkList.name);
        const checkListTasks = this.getTasksList(checkList.tasks);
        const addTaskForm = this.getAddTaskForm(checkList.valid);

        const checkListClasses = [
            checkListClassNames.CHECKLIST
        ]

        const checkListElement = createElement(
            'li',
            checkListClasses.join(' '),
            '',
            {
                'data-id': checkList.id
            }
        )

        checkListElement.append(checkListHeader, checkListTasks, addTaskForm);

        return checkListElement;
    }

    static fillTodo(todoElement, checkListsArr){
        checkListsArr.forEach((checkList) => {
            todoElement.appendChild(this.getCheckList(checkList));
        })
    }
}