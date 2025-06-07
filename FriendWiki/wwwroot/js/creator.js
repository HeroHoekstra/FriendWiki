let data = {
    title: "Title",
    lead: "Lead",
    paragraphs: [],
    summary: {
        title: "Summary title",
    }
};

$(document).ready(function () {
    $("[data-editable]:not([data-array])").each(function () {
        if ($(this).data("initial-ignore")) {
            return;
        }
        
        $(this).on("focusout", function () {
            const keys = getFullPath($(this));

            const lastKey = keys.pop();
            const target = keys.reduce((prev, key) => {
                return prev[key] ??= {};
            }, data);
            
            target[lastKey] = $(this).html();
        });
    });
    
    imageListeners($(".summary-image.image"));
});

// Editor functions
function fillFields(json) {
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
         
         data.summary.rows[row.Position].id = row.Id;
         setData($(".s-row-title", element), row.Title, true);
         setData($(".s-row-content", element), row.Content, true);
         
         lastRow = element;
    });
    
    // Paragraph class
    let lastParagraph = $(".paragraph.prime-add")
    $.each(json.Paragraphs, function (p, paragraph) {
        const element = addParagraph(lastParagraph);

        data.paragraphs[paragraph.Position].id = paragraph.Id;
        setData($(".p-title", element, true), paragraph.Title, true);
        setData($(".p-body", element, true), paragraph.Body, true);
        
        // Images
        $(".image", element).remove();
        $.each(paragraph.Images, function (i, image) {
            const imageElement = addImage(element);
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
}

function stringJson(string) {
    string = string.replace(/"/g, '\\"');
    string = string.replace(/&quot;/g, '"');
    string = string.replace(/\n/g, '');
    string = string.replace(/\r/g, '');

    return JSON.parse(string);
}
