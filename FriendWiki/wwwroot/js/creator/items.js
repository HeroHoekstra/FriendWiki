function addItem(after, template) {
    const html = $(`#${template}-template`).html();
    const element = $(html).clone(true);
    
    after.after(element);
    element.removeClass("template");
    
    updatePosition(template, true);
    $("[data-editable]", element).each(function () {
        $(this).on("focusout", function() {
            setData($(this), $(this).html());
        });
    });
    
    return element;
}

function removeItem(parent) {
    const keys = getFullPath(parent);

    const lastKey = keys.pop();
    const target = keys.reduce((prev, key) => {
        return prev[key] ??= {};
    }, data);
    
    if (typeof target === "object") {
        delete target[lastKey];
    } else {
        target.splice(lastKey, 1);
    }
    
    parent.remove();
}

function updatePosition(type, object = false, parent = undefined) {
    const element = $(`.${type}`, parent);
    element.each(function (i) {
        if ($(this).hasClass("prime-add") || $(this).hasClass("template")) {
            return;
        } 
        
        let newPosition = parent ? i : i-1;
        $(this).data("position", newPosition);
        
        if (object || $(this).data("array")) {
            $("[data-editable]", $(this)).each(function () {
                if ($(this).data("object")) return;
                
                setData($(this), $(this).html());
            });
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
    const keys = getFullPath(element);

    // Insert into `data`
    const lastKey = keys.pop();
    const target = keys.reduce((prev, key) => {
        return prev[key] ??= {};
    }, data);

    target[lastKey] = value;
}

function addParagraph(element) {
    const paragraph = addItem(element, "paragraph");
    addImage(paragraph);
}