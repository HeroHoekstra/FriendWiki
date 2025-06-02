function addItem(after, template) {
    const html = $(`#${template}`).html();
    const element = $(html).clone(true);
    
    after.after(element);
    element.removeClass("template");
    
    updatePosition(template.split("-")[0], true); // Since all templates are named `{name}-template`, this should be fine
    $("[data-editable]", element).each(function () {
        $(this).on("focusout", function() {
            const value = $(this).data("editable");
            setData($(this), value);
        });
    });
}

function getFullPath(element) {
    const positions = getPositions(element);
    const keys = element.data("editable").split('.');

    // Update `{pos}` keys
    let keysUsed = 0;
    for (let i = 0; i < keys.length; i++) {
        if (keys[i] !== "{pos}") {
            continue;
        }
        keys[i] = positions[keysUsed++];
    }
    
    return keys;
}

function setData(element, value) {
    const path = getFullPath(element);
    
    const lastKey = path.pop();
    const target = path.reduce((prev, key) => {
        return prev[key] ??= {};
    }, data);
    
    target[lastKey] = $(element).html().trim();
}

function moveData(element, value) {
    const keys = getFullPath(element);
    
    // Insert into `data`
    const lastKey = keys.pop();
    const target = keys.reduce((prev, key) => {
        return prev[key] ??= {};
    }, data);
    
    target[lastKey] = value;
}

function updatePosition(type, object = false) {
    const element = $(`.${type}`);
    element.each(function (i) {
        if ($(this).hasClass("prime-add") || $(this).hasClass("template")) {
            return;
        } 
        
        $(this).data("position", i-1); // Do `-1` because the initial add should not be counted
        
        if (!object) {
            moveData($(this), $(this).html());
        } else {
            moveData($(this), {});
        }
    });
}

function getPositions(element) {
    const position = parseInt(element.data("position"), 10);
    const parentClass = element.data("parent");

    if (parentClass) {
        const parentElement = element.closest(`.${parentClass}`);
        return [...getPositions(parentElement), position];
    }

    return [position];
}