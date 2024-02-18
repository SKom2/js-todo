export function createElement(
    tag,
    className,
    text = '',
    attributes = {}
) {
    const element = document.createElement(tag)
    if (className){
        element.className = className;
    }
    if (text){
        element.textContent = text;
    }
    for(const key of Object.keys(attributes)){
        element.setAttribute(key, attributes[key]);
    }
    return element
}