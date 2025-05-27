let data = {
    title: "Title",
    lead: "Lead",
    paragraphs: {},
    summary: {
        title: "Summary title",
        rows: {}
    }
};

$(document).ready(function () {
    // Set title and lead listener
    $(".title").on("focusout", function() { // "focusout" is used, because "change" only works on input fields and not regular elements
        data.title = $(this).text(); 
    });
    $(".lead").on("focusout", function() {
        data.lead = $(this).text();
    });
    
    // Also for the summary
    $(".s-title").on("focusout", function() {
        data.summary.title = $(this).text(); 
    });
});

function setPositions() {
    $(".paragraph").each(function(i, e) {
        $(e).attr("data-position", i);
    });

    $(".summary-row").each(function(i, e) {
        $(e).attr("data-position", i);
    });
    
    $(".image").each(function(i, e) {
        $(e).attr("data-position", i); 
    });
}


// Summary
function addSummaryRow(caller) {
    const html = $("#summary-row-template").html();
    const row = $(html);
    
    caller.after(row);
    
    setPositions();
    editableSummaryRow(row);
}

function editableSummaryRow(node) {
    const position = $(node).attr("data-position");
    
    if (!data.summary.rows[position]) {
        data.summary.rows[position] = {
            title: "Summary title",
            content: "Summary row content"
        };
    }
    
    $(".s-row-title", node).on("focusout", function() {
        data.summary.rows[position].title = $(this).text(); 
    });
    $(".s-row-title", node).on("focusout", function() {
        data.summary.rows[position].content = $(this).text();
    });
}

function removeSummaryRow(node) {
    const title = $(".s-row-title", node).text();
    
    if (confirm(`Are you sure you want to delete '${title}'?`)) {
        delete data.summary.rows[node];
        node.remove();
    }
}


// Paragraphs
function editableParagraph(node) {
    const position = $(node).data("position");
    
    if (!data.paragraphs[position]) {
        data.paragraphs[position] = { 
            title: "Paragraph Title", 
            body: "Paragraph body", 
            image: {} 
        };
    }
    
    $(".p-title", node).on("focusout", function() {
        data.paragraphs[position].title = $(this).text();
    });
    $(".p-body", node).on("focusout", function() {
        data.paragraphs[position].body = $(this).text();
    });
}

function addParagraph(caller) {
    const html = $("#paragraph-template").html();
    const paragraph = $(html);
    
    caller.after(paragraph);
    
    setPositions();
    editableParagraph(paragraph);
    addImageSelection(paragraph);
}

function removeParagraph(paragraph) {
    const title = $(".p-title", paragraph).text();
    
    if (confirm(`Are you sure you want to delete '${title}'?`)) {
        const position = $(paragraph).data("position");
        
        delete data.paragraphs[position];
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
    
    // Get positions
    const paragraphPosition = node.parent().parent().data("position");
    const imagePosition = node.data("position");
    
    // Make sure 'alt's are matched
    $(".i-alt", altWrapper).on('focusout', function() {
        img.attr("alt", $(this).text());
        data.paragraphs[paragraphPosition].image[imagePosition].alt = $.trim($(this).text());
    });
    
    // Add new "add image" button
    const parent = node.parent().parent();
    if (node.data("preview") === true) {
        node.data("preview", false);
        addImageSelection(parent);
    }
    
    // Finally add to 'data'
    data.paragraphs[paragraphPosition].image[imagePosition] = {
        src: link,
        alt: "Your image description"
    };
}

function addImageSelection(paragraph) {
    const html = $("#image-template").html();
    const image = $(html);
    
    $(".images", paragraph).append(image);
    $(".i-add", image).on("click", () => setImage(image));

    setPositions();
}

function removeImage(image) {
    if (confirm("Are you sure you want to delete this image?")) {
        const paragraphPosition = image.parent().parent().data("position");
        const imagePosition = image.data("position");
        
        delete data.paragraphs[paragraphPosition].image[imagePosition];
        image.remove();
    }
}