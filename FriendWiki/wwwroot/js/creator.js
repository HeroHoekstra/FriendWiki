let data = {
    title: "Title",
    lead: "Lead",
    paragraphs: [],
    summary: {
        title: "Summary title",
    }
};

$(document).ready(function () {
    $("[data-editable]:not([data-array])").each(function () {
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
