function setImage(node, isSummary = false) {
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
    const paragraphPosition = node.closest('.paragraph').data("position");
    const imagePosition = node.data("position");

    // Make sure 'alt's are matched
    $(".i-alt", altWrapper).on('focusout', function() {
        img.attr("alt", $(this).text());
        const trimmed = $.trim($(this).text());

        if (!isSummary) {
            data.paragraphs[paragraphPosition].images[imagePosition].alt = trimmed;
        } else {
            data.summary.image.alt = trimmed;
        }
    });

    // Add new "add image" button
    const parent = node.parent().parent();
    if (node.data("preview") === true && !isSummary) {
        node.data("preview", false);
        addImageSelection(parent);
    }

    // Finally add to 'data'
    if (!isSummary) {
        hasImagePosition(paragraphPosition, imagePosition);
        data.paragraphs[paragraphPosition].images[imagePosition] = {
            source: link,
            alternative: "Your image description"
        };
    } else {
        data.summary.image = {
            source: link,
            alternative: "Your image description"
        }
    }
}   

function addImageSelection(paragraph) {
    const html = $("#image-template").html();
    const image = $(html).clone(true);

    $(".images", paragraph).append(image);
    $(".i-add", image).on("click", () => setImage(image));

    setPositions();
}

function removeImage(image) {
    if (confirm("Are you sure you want to delete this image?")) {
        const paragraphPosition = image.closest('.paragraph').data("position");
        const imagePosition = image.data("position");

        delete data.paragraphs[paragraphPosition].images[imagePosition];
        image.remove();
    }
}

function hasImagePosition(paragraphPosition, imagePosition) {
    if (!data.paragraphs[paragraphPosition].images[imagePosition]) {
        data.paragraphs[paragraphPosition].images[imagePosition] = {
            source: "",
            alternative: "Your image description"
        };
    }
}