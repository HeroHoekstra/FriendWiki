let data = {
    title: "Title",
    lead: "Lead",
    paragraphs: [],
    summary: {
        title: "Summary title",
    }
};
let isEdit = false;

$(document).ready(function () {
    $("[data-editable]").each(function () {
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

async function submitArticle() {
    try {
        const useEdit = window.location.href.includes("editor");

        cleanData();
        
        const url = useEdit ? "/article/editor" : "/article/creator";
        const response = await fetch(url, {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json"
            }
        });
        
        if (!response.ok)
            throw new Error(await response.json());
        
        const result = await response.json();
        //window.location.href = `/article/${result.id}`;
    } catch (error) {
        console.error(`An error occurred: ${error}`);
    }
}

function cleanData() {
    // Remove images with empty source and default alternative text
    function cleanImages(obj) {
        if (Array.isArray(obj)) {
            obj.forEach(cleanImages);
            return;
        }

        if (typeof obj === "object" && obj !== null) {
            for (const key in obj) {
                if (key === "images" && typeof obj[key] === "object") {
                    const images = obj[key];
                    for (const imgKey in images) {
                        const image = images[imgKey];
                        if (
                            image?.source === "" &&
                            image.alternative === "Your image description"
                        ) {
                            delete images[imgKey];
                        }
                    }
                    if (Object.keys(images).length === 0) {
                        delete obj[key];
                    }
                } else {
                    cleanImages(obj[key]);
                }
            }
        }
    }

    // Apply whitespace fix and preserve replacements
    function normalizeStrings(obj) {
        if (Array.isArray(obj)) {
            return obj.map(normalizeStrings);
        }

        if (typeof obj === "object" && obj !== null) {
            const newObj = {};
            for (const key in obj) {
                newObj[key] = normalizeStrings(obj[key]);
            }
            return newObj;
        }

        if (typeof obj === "string") {
            return obj.replace(/<br\s*\/?>/gi, '\n');
        }

        return obj;
    }

    cleanImages(data);

    $.each(data.paragraphs, function (_, p) {
        p.images = Object.values(p.images).filter(v => v !== undefined && v !== null);
    });
    
    return normalizeStrings(data);
}


// Editor functions
function fillFields(json) {
    isEdit = true;
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
        $(".i-alt", summaryImageEl).on("focusout", function() {
            imageEl.attr("alt", $(this).text());
            data.summary.image.alternative = $(this).text();
        })
        
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
        
        // Image 
        $(e.Images).each(function(j, f) {
            const source = f.Source;
            const img = setImage(element, false, source);
            addImageSelection(element);
            data.paragraphs[i].images[j].source = source; 
            
            // Set image alt text
            const alt = f.Alternative;
            img.attr("alt", alt);
            $($(".i-alt", element)[j]).text(alt);
            data.paragraphs[i].images[j].alternative = alt;
        });
        
        lastParagraph = $e;
    });
}