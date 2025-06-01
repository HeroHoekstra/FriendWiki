let data = {
    title: "Title",
    lead: "Lead",
    paragraphs: [],
    summary: {
        title: "Summary title",
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

function withWhitespace(html) {
    return html.replace(/<br\*s\/?>/g, '\n');
}

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
        
        const result = await response.json();
        window.location.href = `/article/${result.id}`;
    } catch (error) {
        console.error(`An error occurred: ${error}`);
    }
    
}


// Editor functions
function fillFields(json) {
    console.log(json);
    data.id = json.Id;
    
    // Title and lead
    const title = json.Title;
    $(".title").text(title);
    data.title = title;
    
    const lead = json.Lead;
    $(".lead").text(lead);
    data.lead = lead;
    
    
    // Summary
    data.summary.id = json.Summary.Id;
    
    const summaryTitle = json.Summary.Title;
    $(".s-title").text(summaryTitle);
    data.summary.title = summaryTitle;
    
    // Summary Image
    if (json.Summary.Image != null) {
        // Set the view
        const summaryImage = json.Summary.Image;
        
        const summaryImageEl = $(".summary-image");
        const imageEl = $("img.i-add", summaryImageEl);
        
        imageEl.attr("src", summaryImage.Source);
        imageEl.attr("alt", summaryImage.Alternative)

        $(".i-alt", summaryImageEl).text(summaryImage.Alternative);
        
        // Show the view
        $("span.i-add", summaryImageEl).hide();
        imageEl.show();
        $(".image-alt", summaryImageEl).show();
        

        // Set the data
        data.summary.image = {
            id: summaryImage.Id,
            source: summaryImage.Source,
            alternative: summaryImage.Alternative
        }
    }

    // Summary Rows
    let lastRow = $(".summary-row.prime-add");
    $(json.Summary.Rows).each(function(i, e) {
        const element = addSummaryRow(lastRow);
        const $e = $(e);
        
        // Title
        const titleText = e.Title;
        $(".s-row-title", element).text(titleText);
        
        // Content
        const contentText = e.Content;
        $(".s-row-content", element).text(contentText);
        
        // Add to data
        data.summary.rows[i] = {
            id: e.Id,
            title: titleText,
            content: contentText
        }
        
        lastRow = $e; 
    });
    
    
    // Paragraphs
    let lastParagraph = $(".paragraph.prime-add");
    $(json.Paragraphs).each(function(i, e) {
        const element = addParagraph(lastParagraph);
        const $e = $(element);
        
        // Title
        const titleText = e.Title;
        $(".p-title", $e).text(titleText);
        data.paragraphs[i].title = titleText;
        
        // Body
        const bodyText = e.Body;
        $(".p-body", $e).text(bodyText);
        data.paragraphs[i].body = bodyText;
        
        lastParagraph = $e;
    });
}