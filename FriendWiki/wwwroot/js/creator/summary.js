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
            data.summary.rows[position].content = withWhitespace($this.html());
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
        
        // Use `i-1` because 0 is prime-add
        hasSummaryPosition(i-1);
        data.summary.rows[i-1].title = $(".s-row-title", e).text();
        data.summary.rows[i-1].content = withWhitespace($(".s-row-content", e).html());
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