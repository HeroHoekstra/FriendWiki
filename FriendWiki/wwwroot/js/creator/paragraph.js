function editableParagraph(node) {
    $(".paragraph-item", node).on("focusout", function () {
        const $this = $(this);
        const position = $this.closest(".paragraph").data("position");

        hasParagraphPosition(position);

        if ($this.hasClass("p-title")) {
            data.paragraphs[position].title = $this.text();
        } else if ($this.hasClass("p-body")) {
            data.paragraphs[position].body = $this.text();
        }
    });
}

function addParagraph(caller) {
    const html = $("#paragraph-template").html();
    const paragraph = $(html);

    caller.after(paragraph);

    paragraph.removeClass("template");

    setPositions();
    editableParagraph(paragraph);
    addImageSelection(paragraph);
    updateParagraphData();
}

function removeParagraph(paragraph) {
    const title = $(".p-title", paragraph).text();

    if (confirm(`Are you sure you want to delete '${title}'?`)) {
        const position = $(paragraph).data("position");

        delete data.paragraphs[position];
        paragraph.remove();
    }
}

function updateParagraphData() {
    $(".paragraph").each(function(i, e) {
        if ($(e).hasClass("prime-add") || $(e).hasClass("template")) {
            return;
        }

        hasParagraphPosition(i);
        data.paragraphs[i].title = $(".p-title", e).text();
        data.paragraphs[i].body = $(".p-body", e).text();
    });
}

function hasParagraphPosition(position) {
    if (!data.paragraphs[position]) {
        data.paragraphs[position] = {
            title: "Paragraph Title",
            body: "Paragraph body",
            image: {}
        };
    }
}