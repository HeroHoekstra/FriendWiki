function addIds() {
    $(".template").each(function() {
        const path = `${$(this).data("editable")}.id`;
        const classList = $(this).attr("class").split(/\s+/);
        const parent = classList.filter(function (cls) {
            return cls !== "template";
        })[0];

        const html = $("#id-template").html();
        const idElement = $(html);

        $(this).append(idElement);

        idElement.attr("data-editable", path);
        idElement.attr("data-parent", parent);
    });
}

function indicateRemoved() {
    $("[data-deleted]").each(function () {
        const header = $(".header", $(this));
        header.addClass("deleted");
        
        const html = $("#removed-template").html();
        header.append($(html));
        
        const restoreButton = $(".remove-button", $(this));
        restoreButton.text("Restore item");
        restoreButton.attr("onclick", "restoreItem($(this).closest('[data-editable]'))");
    });
}

function restoreItem(element) {
    const keys = getFullPath(element);
    const lastKey = keys.pop();
    const target = keys.reduce((prev, key) => {
        return prev[key] ??= {};
    }, data);
    
    target[lastKey].deleted = false;
    $(".deleted", element).removeClass("deleted");
    $(".header>span", element).remove();
    
    const template = `${element.attr("data-deleted")}-template`;
    const removeButton = $(`#${template} .remove-button`);
    const button = $('.remove-button', element);

    button.text(`${removeButton.text()}`);
    button.attr('onclick', removeButton.attr('onclick'));
}

function fillFields(json) {
    addIds();

    // Main article class
    data.id = json.Id;
    setData($(".title"), json.Title, true);
    setData($(".lead"), json.Lead, true);

    // Summary class
    const summaryJson = json.Summary;
    data.summary.id = summaryJson.Id;
    setData($(".s-title"), json.Summary.Title, true);

    if (summaryJson.Image != null) {
        // `setData` is not used here, since it is an image
        const imageJson = summaryJson.Image;
        data.summary.image = {
            id: imageJson.Id,
            source: imageJson.Source,
            alternative: imageJson.Alternative
        };

        const image = $(".summary-image");
        enterImage(image, imageJson.Source);
        swapImageDisplay(image);
        $(".summary-image .i-alt").html(imageJson.Alternative);
    }

    let lastRow = $(".summary-row.prime-add");
    $.each(summaryJson.Rows, function (_, row) {
        const element = addItem(lastRow, "summary-row");
        const id = parseInt(row.Id, 10);
        
        if (row.Deleted) {
            element.attr("data-deleted", "summary-row");
        }

        setData($(element).children(".id"), id, true);
        setData($(".s-row-title", element), row.Title, true);
        setData($(".s-row-content", element), row.Content, true);

        lastRow = element;
    });

    // Paragraph class
    let lastParagraph = $(".paragraph.prime-add")
    $.each(json.Paragraphs, function (p, paragraph) {
        const element = addParagraph(lastParagraph);
        const paragraphId = parseInt(paragraph.Id, 10);
        
        if (paragraph.Deleted) {
            element.attr("data-deleted", "paragraph");
        }

        setData($(element).children(".id"), paragraphId, true);
        setData($(".p-title", element), paragraph.Title, true);
        setData($(".p-body", element), paragraph.Body, true);

        // Images
        $(".image", element).remove();
        $.each(paragraph.Images, function (i, image) {
            if (image.Deleted) {
                return;
            }
            
            const imageElement = addImage(element);
            const imageId = parseInt(image.Id, 10);
            setData($(imageElement).children(".id"), imageId, true);

            swapImageDisplay(imageElement);
            imageElement.attr("data-preview", false);

            const img = $("img", imageElement);
            img.attr("src", image.Source);
            img.attr("alt", image.Alternative);

            const alt = $(".i-alt", imageElement);
            setData(alt, image.Alternative, true);
        });

        addImage(element);
        lastParagraph = element;
    });
    
    indicateRemoved();
}

function stringJson(string) {
    string = string.replace(/"/g, '\\"');
    string = string.replace(/&quot;/g, '"');
    string = string.replace(/\n/g, '');
    string = string.replace(/\r/g, '');

    return JSON.parse(string);
}