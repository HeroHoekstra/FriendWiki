function themedIcons(lightUrl, darkUrl) {
    let theme;
    if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
        theme = "light";
    } else {
        theme = "dark";
    }
    
    $(".themed-icon").each(function () {
         if (theme === "dark") {
             $(this).attr("src", darkUrl);
         } else if (theme === "light") {
             $(this).attr("src", lightUrl);
         } else {
             console.warn("Could not find theme");
         }
    });
}