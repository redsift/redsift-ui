function useTheme(title) {
    let themes = document.getElementsByTagName('link');
    for (let idx = 0; idx < themes.length; idx++) {
        let theme = themes[idx];

        if ((theme.rel.indexOf('stylesheet') != -1) && theme.title) {
            theme.disabled = true;
            if (theme.title == title) {
                theme.disabled = false;
            }
        }
    }
}

let StyleSwitcher = {
    use(title) {
        let themes = document.getElementsByTagName('link');
        for (let idx = 0; idx < themes.length; idx++) {
            let theme = themes[idx];

            if ((theme.rel.indexOf('stylesheet') != -1) && theme.title) {
                theme.disabled = true;
                if (theme.title == title) {
                    theme.disabled = false;
                }
            }
        }
    }
}

export { StyleSwitcher };
