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
    const position = parent.data("position");
    parent.remove();
    
    const keys = getFullPath(parent);
    const lastKey = keys.pop();
    const target = keys.reduce((prev, key) => {
        return prev[key] ??= {};
    }, data);
    
    if (window.location.href.includes("editor")) {
        target[position].deleted = true;
        return;
    }
    
    if (typeof target === "object") {
        delete target[lastKey];
    } else {
        target.splice(lastKey, 1);
    }
}

function updatePosition(type, object = false, parent = undefined) {
    const element = $(`.${type}`, parent);
    element.each(function (i) {
        if ($(this).hasClass("prime-add") || $(this).hasClass("template")) {
            return;
        }
        
        let newPosition = parent ? i : i-1;
        $(this).attr("data-position", newPosition);
        
        if (object || $(this).data("array")) {
            $("[data-editable]", $(this)).each(function () {
                if ($(this).data("object")) return;
                
                setData($(this), $(this).html());
            });
        }
    });
}

function getPositions(element) {
    let result = [];
    
    const parent = element.data("parent");
    if (parent) {
        const parentElement = element.closest(`.${parent}`);
        result.push(...getPositions(parentElement));
    }

    const position = element.data("position");
    if (position != null)
        result.push(position);
    
    return result;
}

function getFullPath(element) {
    const positions = getPositions(element).reverse();
    
    const keys = element.data("editable").split('.');

    // Update `{pos}` keys
    let keysUsed = positions.length-1;
    for (let i = 0; i < keys.length; i++) {
        if (keys[i] !== "{pos}") {
            continue;
        }
        keys[i] = positions[keysUsed--];
    }

    return keys;
}

function setData(element, value, replaceHTML = false) {
    const keys = getFullPath(element);

    // Insert into `data`
    const lastKey = keys.pop();
    const target = keys.reduce((prev, key) => {
        return prev[key] ??= {};
    }, data);

    target[lastKey] = value;
    if (replaceHTML) {
        $(element).html(value);
    }
    
    return [keys, target[lastKey]];
}

function addParagraph(element) {
    const paragraph = addItem(element, "paragraph");
    addImage(paragraph);
    fixImageData();
    
    return paragraph;
}