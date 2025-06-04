function addImage(paragraph) {
    const html = $("#image-template").html();
    const element = $(html).clone(true);
    
    $(".images", paragraph).append(element);
    element.removeClass("template");
    
    updatePosition("image", true, paragraph);
    imageListeners(element);
    
    $(".image", paragraph).each(function () {
        const img = $("img", $(this));
        setData(img, img.attr("src"));
        
        const alt = $(".i-alt", $(this))
        setData(alt, alt.html());
    });
    
    return element;
}

function imageListeners(image) {
    const img = $("img", image);
    
    $(".i-add", image).on("click", function() {
        if (!enterImage(image)) return;
        
        swapImageDisplay(image);
        image.attr("data-preview", "false");
        setData($(this), img.attr("src"));
    });
    
    $(".i-alt", image).on("focusout", function() {
        const text = $(this).html();
        setData($(this), text);
        img.attr("alt", text);
    });
}

function enterImage(image, link = prompt("Enter image URL")) {
    if (link == null) return false;
    
    const $image = $("img", image);
    $image.attr("src", link);
    
    if (image.attr("data-preview") === "true") {
        addImage(image.closest(".paragraph"));
    }
    
    return true;
}

function swapImageDisplay(image) {
    if (image.attr("data-preview") === "true") {
        $(".i-add-preview", image).hide();
        $("img", image).show();
        $(".image-alt", image).show();
    } else {
        $(".i-add-preview", image).show();
        $("img", image).hide();
        $(".image-alt", image).hide();
    }
}

function fixImageData() {
    $(".paragraph:not(.template):not(.prime-add)").each(function (p) {
        $(".image", $(this)).each(function (i) {
            const imageId = data.paragraphs[p].images[i].id;
            data.paragraphs[p].images[i] = {
                source: $("img", $(this)).attr("src"),
                alternative: $("img", $(this)).attr("alt"),
            };
            
            if (imageId) {
                data.paragraphs[p].images[i].id = imageId;
            }
        });
    });
}