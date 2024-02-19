import {checkListClassNames, commonClassNames, taskClassNames} from "../utils/classNames";
import {createElement} from "../utils/utils";
import RemoveBin from '../assets/img/Bin.svg'
import EditBtn from '../assets/img/EditIcon.svg'

export class TaskUI {
    static getCheckboxInput(completed){
        const inputClasses = [
            taskClassNames.CHECKBOX
        ]

        if (completed) {
            inputClasses.push(commonClassNames.CHECKED);
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
            taskClassNames.TASK_LABEL
        ]

        if (completed){
            taskLabelClasses.push(commonClassNames.CHECKED);
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
            taskClassNames.TASK,
            commonClassNames.TASK
        ]

       const taskElement = createElement(
           'li',
           taskClasses.join(' '),
           '',
           {
               "data-task-id": task.id
           }
       )
       taskElement.append(taskLabel, removeBinBtn);
        return taskElement;
   }
}

export class CheckListUI {
    static getCheckListName(name, set, isCompletedPage){
        let element;
        if (!isCompletedPage){
            if (set) {
                element = createElement('span', `${checkListClassNames.CHECKLIST_NAME} ${commonClassNames.SET_NAME}`, name);
            } else {
                element = createElement('input', `${checkListClassNames.CHECKLIST_NAME} ${commonClassNames.FORM_INPUT}`, '', {
                    placeholder: 'Дела по дому',
                    value: name,
                });
            }
        } else {
            element = createElement('span', `${checkListClassNames.CHECKLIST_NAME} ${commonClassNames.SET_NAME}`, name);
        }

        return element;
    }


    static getCheckListEditBtnIcon(){
        const checkListAddBtnIconClassNames = [
            checkListClassNames.CHECKLIST_ADD_BTN_ICON
        ]

        return createElement(
            'img',
            checkListAddBtnIconClassNames.join(' '),
            '',
            {
                src: EditBtn,
                alt: "Edit Button Icon"
            }
        )
    }

    static getCheckListEditBtn(set) {
        if (set) {
            const editBtnIcon = this.getCheckListEditBtnIcon();
            const checkListAddBtnClassNames = [
                commonClassNames.FORM_BTN,
                checkListClassNames.CHECKLIST_ADD_NAME_BTN
            ];

            const checkListAddBtn = createElement(
                'button',
                checkListAddBtnClassNames.join(' '),
                '',
                {
                    type: 'button'
                }
            );
            checkListAddBtn.appendChild(editBtnIcon);

            return checkListAddBtn;
        } else {
            const checkListAddNameBtnClassNames = [
                commonClassNames.FORM_BTN,
                checkListClassNames.CHECKLIST_ADD_NAME_BTN
            ];

            return createElement(
                'button',
                checkListAddNameBtnClassNames.join(' '),
                '+ добавить имя чеклиста',
                {
                    type: 'submit'
                }
            );
        }
    }


    static getAddCheckListNameForm(name, set, isCompletedPage){
        const checkListName = this.getCheckListName(name, set, isCompletedPage);
        const editBtn = this.getCheckListEditBtn(set);
        const checkListNameFormClasses = [
            checkListClassNames.CHECKLIST_FORM,
            commonClassNames.FORM,
            checkListClassNames.NAME_FORM
        ]

        if (set){
            checkListNameFormClasses.push(commonClassNames.SET_NAME);
        }

        const checkListAddNameForm = createElement(
            'form',
            checkListNameFormClasses.join(' ')
        )

        checkListAddNameForm.append(checkListName)

        if (!isCompletedPage){
            checkListAddNameForm.append(editBtn)
        }

        return checkListAddNameForm;
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

    static getCheckListHeader(name, set, isCompletedPage){
        const checkListForm = this.getAddCheckListNameForm(name, set, isCompletedPage);
        const checkListRemoveBtn = this.getCheckListRemoveButton();

        const checkListHeaderClassNames = [
            checkListClassNames.CHECKLIST_HEADER
        ]

        const checkListHeader = createElement(
            'div',
            checkListHeaderClassNames.join(' ')
        )

        checkListHeader.append(checkListForm);

        if (!isCompletedPage){
            checkListHeader.append(checkListRemoveBtn)
        }

        return checkListHeader;
    }

    static getTasksList(tasks, isCompletedPage){
        const taskListNames = [
            checkListClassNames.CHECKLIST_TASKS
        ]

        const tasksList = createElement(
            'ul',
            taskListNames.join(' '),
        )

        if (!tasks) return;

        tasks.filter(taskElement => isCompletedPage ? taskElement.completed : true)
            .forEach(taskElement => {
                const taskUI = TaskUI.getTask(taskElement);

                // Если страница отображает выполненные задачи, добавить атрибут disabled
                if (isCompletedPage) {
                    // Предполагается, что taskUI является DOM элементом
                    taskUI.setAttribute('disabled', 'true');
                    // Возможно, потребуется добавить класс или изменить стиль для визуального отображения disabled состояния
                    taskUI.classList.add('disabled'); // Пример добавления класса
                }

                tasksList.appendChild(taskUI);
            });

        return tasksList;
    }

    static getAddTaskInput(){
        const addTaskInputClassNames = [
            commonClassNames.FORM_INPUT
        ]

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
            commonClassNames.FORM_BTN,
            checkListClassNames.CHECKLIST_ADD_TASK_BTN
        ]

        return createElement(
            'button',
            addTaskTextClassNames.join(' '),
            '+ добавить пункт',
            {
                type: 'submit',
                disabled: true
            }
        )
    }

    static getAddTaskForm() {
        const addTaskInput = this.getAddTaskInput();
        const addTaskText = this.getAddTaskText();

        const addTaskFormClassNames = [
            checkListClassNames.ADD_TASK_FORM,
            commonClassNames.FORM,
            checkListClassNames.TASKS_FORM
        ]

        const addTaskForm = createElement(
            'form',
            addTaskFormClassNames.join(' ')
        )

        addTaskForm.append(addTaskInput, addTaskText);

        return addTaskForm;
    }

    static getCheckList(checkList, isCompletedPage = false) {
        console.log(checkList)
        const checkListHeader = this.getCheckListHeader(checkList.name, checkList.isSetName, isCompletedPage);
        const checkListTasks = this.getTasksList(checkList.tasks, isCompletedPage);
        const checkListClasses = [
            checkListClassNames.CHECKLIST,
            commonClassNames.CHECKLIST
        ]

        const checkListElement = createElement(
            'li',
            checkListClasses.join(' '),
            '',
            {
                'data-checklist-id': checkList.id
            }
        )

        checkListElement.append(checkListHeader, checkListTasks);

        if (!isCompletedPage) {
            const addTaskForm = this.getAddTaskForm();
            checkListElement.append(addTaskForm);
        }

        return checkListElement;
    }


    static fillTodo(checkListContainerElement, checkListsArr, isCompletedPage = false) {
        checkListsArr.forEach((checkList) => {
            checkListContainerElement.appendChild(this.getCheckList(checkList, isCompletedPage));
        })
    }
}