let data = {
    title: "Title",
    lead: "Lead",
    paragraphs: {}
};

$(document).ready(function () {
    // Set title and lead listener
    $(".title").on("focusout", function() { // "focusout" is used, because "change" only works on input fields and not regular elements
        console.log("aaa");
        data.title = $(this).text(); 
    });
    $(".lead").on("focusout", function() {
        data.lead = $(this).text();
    });
});

function editableParagraph(paragraph) {
    const position = $(paragraph).data("position");

    if (!data.paragraphs[position]) {
        data.paragraphs[position] = { title: "", body: "" };
    }
    
    $(".p-title", paragraph).on("focusout", function() {
        data.paragraphs[position].title = $(this).text();
    });
    $(".p-body", paragraph).on("focusout", function() {
        data.paragraphs[position].body = $(this).text();
    });
}

function setParagraphPositions() {
    $(".paragraph").each(function(i, e) {
        $(e).attr("data-position", i); 
    });
}

function addParagraph(caller) { // The "caller" is the button that was clicked, not the parent
    const parent = $(caller).parent();
    
    const html = $("#paragraph-template").html();
    const paragraph = $(html);
    
    parent.after(paragraph);
    
    setParagraphPositions();
    editableParagraph(paragraph);
}
