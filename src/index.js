import './index.html';
import './index.scss';
import {App} from "./components/App";

const todoElement = document.querySelector('.checkLists');
const addCheckListBtn = document.querySelector('.nav__addCheckList');

window.addEventListener('load', () => {
    const app = new App(todoElement, addCheckListBtn);
    app.init();
})
