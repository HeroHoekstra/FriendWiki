// Check for user's preferred theme
const applyThemeImages = () => {
    const themed = $('[data-checkTheme]');
    themed.each((i, e) => {
        const $el = $(e);
        let src = $el.attr('src');
        if (!src)
            src = $el.attr('href');

        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            src = src.replace(/light/g, 'dark');
        } else {
            src = src.replace(/dark/g, 'light');
        }

        $el.attr('src', src);
    });
};
applyThemeImages();

// React to changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', applyThemeImages);
