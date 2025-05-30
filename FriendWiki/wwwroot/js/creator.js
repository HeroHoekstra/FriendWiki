let data = {
    title: "Title",
    lead: "Lead",
    paragraphs: [],
    summary: {
        title: "Summary title",
        image: {
            source: "",
            alternative: ""
        },
        rows: [],
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
        if (!$(e).hasClass("prime-add"))
            $(e).attr("data-position", i - 1);
    });

    $(".summary-row").each(function(i, e) {
        if (!$(e).hasClass("prime-add"))
            $(e).attr("data-position", i - 1);
    });
    
    $(".images").each(function(i, e) {
        $(".image", $(e)).each(function(i, e) {
            $(e).attr("data-position", i);
        });
    });
}

async function submitArticle() {
    try {
        const json = JSON.stringify(data);
        
        const response = await fetch("/article/creator", {
            method: "POST",
            body: json,
            headers: {
                "Content-Type": "application/json"
            }
        });
        
        if (!response.ok) {
            throw Error(response.statusText);
        }
        
        window.location.href = "/";
    } catch (error) {
        console.error(`An error occurred: ${error}`);
    }
    
}