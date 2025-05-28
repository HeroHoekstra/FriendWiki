function addSummaryRow(caller) {
    const html = $("#summary-row-template").html();
    const row = $(html).clone(true);

    caller.after(row);
    
    row.removeClass("template");

    setPositions();
    editableSummaryRow(row);
    updateSummaryData();
}

function editableSummaryRow(node) {
    $(".summary-row-item", node).on("focusout", function () {
        const $this = $(this);
        const position = $this.closest(".summary-row").attr("data-position");
        
        hasSummaryPosition(position);

        if ($this.hasClass("s-row-title")) {
            data.summary.rows[position].title = $this.text();
        } else if ($this.hasClass("s-row-content")) {
            data.summary.rows[position].content = $this.text();
        }
    });
}

function removeSummaryImage() {
    if (confirm("Are you sure you want to delete this image?")) {
        delete data.summary.image;
        
        $(".summary .i-add-preview").show();
        $(".summary img.i-add").hide();
        $(".summary .image-alt").hide();
    }
}
function removeSummaryRow(node) {
    const title = $(".s-row-title", node).text();

    if (confirm(`Are you sure you want to delete '${title}'?`)) {
        const position = $(node).data("position");
        delete data.summary.rows[position];
        node.remove();
    }
}

function updateSummaryData() {
    $(".summary-row").each(function(i, e) {
        if ($(e).hasClass("prime-add") || $(e).hasClass("template")) {
            return;
        } 
        
        hasSummaryPosition(i);
        data.summary.rows[i].title = $(".s-row-title", e).text();
        data.summary.rows[i].content = $(".s-row-content", e).text();
    });
}

function hasSummaryPosition(position) {
    if (!data.summary.rows[position]) {
        data.summary.rows[position] = {
            title: "Summary position",
            content: "Summary row content"
        }
    }
}