import './index.html';
import './index.scss';
import {App} from "./components/App";

const checkListContainerElement = document.querySelector('.checkLists');
const addCheckListBtn = document.querySelector('.nav__addCheckListBtn');
const page = document.querySelector('#allTasks');

window.addEventListener('load', () => {
    const app = new App(checkListContainerElement, addCheckListBtn, page);
    app.init();
})
