let data = {
    title: "Title",
    lead: "Lead",
    paragraphs: {}
};

$(document).ready(function () {
    // Set title and lead listener
    $(".title").on("focusout", function() { // "focusout" is used, because "change" only works on input fields and not regular elements
        data.title = $(this).text(); 
    });
    $(".lead").on("focusout", function() {
        data.lead = $(this).text();
    });
});


// Paragraphs
function editableParagraph(node) {
    //const position = $(paragraph).data("position");

    if (!data.paragraphs[node]) {
        data.paragraphs[node] = { 
            title: "Paragraph Title", 
            body: "Paragraph body", 
            image: {} 
        };
    }
    
    $(".p-title", node).on("focusout", function() {
        data.paragraphs[node].title = $(this).text();
    });
    $(".p-body", node).on("focusout", function() {
        data.paragraphs[node].body = $(this).text();
    });
}

function setParagraphPositions() {
    $(".paragraph").each(function(i, e) {
        $(e).attr("data-position", i); 
    });
}

function addParagraph(caller) {
    const html = $("#paragraph-template").html();
    const paragraph = $(html);
    
    caller.after(paragraph);
    
    setParagraphPositions();
    editableParagraph(paragraph);
    addImageSelection(paragraph);
}

function removeParagraph(paragraph) {
    const title = $(".p-title", paragraph).text();
    
    if (confirm(`Are you sure you want to delete '${title}'?`)) {
        delete data.paragraphs[paragraph];
        paragraph.remove();
    }
}


// Images
function setImage(node) {
    const link = prompt("Insert image URL");
    if (link === null) {
        return;
    }
    
    $(".i-add-preview", node).hide();
    
    // Show the image
    const img = $("img", node);
    img.attr("src", link);
    img.show();
    
    const altWrapper = $(".image-alt", node)
    altWrapper.show();
    
    // Make sure 'alt's are matched
    $(".i-alt", altWrapper).on('focusout', function() {
        img.attr("alt", $(this).text());
        data.paragraphs[parent].image[node].alt = $.trim($(this).text());
    });
    
    // Add new "add image" button
    const parent = node.parent().parent();
    if (node.data("preview") === true) {
        node.data("preview", false);
        addImageSelection(parent);
    }
    
    // Finally add to 'data'
    data.paragraphs[parent].image[node] = {
        src: link,
        alt: "Your image description"
    };
}

function addImageSelection(paragraph) {
    const html = $("#image-template").html();
    const image = $(html);
    
    $(".images", paragraph).append(image);
    $(".i-add", image).on("click", () => setImage(image));
}

function removeImage(image) {
    if (confirm("Are you sure you want to delete this image?")) {
        delete data.paragraphs[image.parent().parent()].image[image];
        image.remove();
    }
}