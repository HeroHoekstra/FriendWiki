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
        $("title").text(`${$(this).text()} - FriendWiki`);
        data.title = $(this).text(); 
    });
    $(".lead").on("focusout", function() {
        data.lead = $(this).text();
    });
    
    // Also for the summary
    $(".s-title").on("focusout", function() {
        data.summary.title = $(this).text(); 
    });
    
    // And set summary image
    $(".summary-image > .i-add").on("click", function() { 
        setImage($(this).parent(), true)
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
