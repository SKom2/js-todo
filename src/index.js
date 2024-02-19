import './index.html';
import './index.scss';
import {App} from "./components/App";

const checkListContainerElement = document.querySelector('.checkLists');
const addCheckListBtn = document.querySelector('.nav__addCheckListBtn');

window.addEventListener('load', () => {
    const app = new App(checkListContainerElement, addCheckListBtn);
    app.init();
})
