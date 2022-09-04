const config = {
    name: "Chad Wojack",
    detectKeyPress: true,
    useTheme: "darkColors",
    themes: {
        // A "default" theme is necessary to use another theme with timeOfDay.
        default: {
            "bgColor": "#FFF",
            "groupColor": "#FFDFCD",
            "textColor": "#000",
            "textHoverColor": "#C14600"
        },
        darkColors: {
            "timeOfDay": true,
            // Times (24hr) that the theme will be turned on and off.
            "themeBegin": 15,
            "themeEnd": 8,

            "bgColor": "#121212",
            "groupColor": "#1D1D1D",
            "textColor": "#FFF",
            "textHoverColor": "#FFDFCD"
        }
    }
}

const bookmarks = {
// Group names must be different. Link must also be full URLs.

    "Study": {
        a: {
            name: "Change me!",
            url: "#"
        },
        b: {
            name: "Change me!",
            url: "#"
        },
        c: {
            name: "Change me!",
            url: "#"
        }
    },
    "Work": {
        d: {
            name: "Change me!",
            url: "#"
        },
    },
    "Leisure": {
        e: {
            name: "Change me!",
            url: "#"
        },
        f: {
            name: "Change me!",
            url: "#"
        },
        g: {
            name: "Change me!",
            url: "#"
        },
        h: {
            name: "Change me!",
            url: "#"
        },
    },
}

const todMessage = () => {
    const date = new Date();
    const hour = date.getHours();
    let message;

    // TODO: make this function less dry.
    if ((hour => 0) && (hour < 5)) {
        message = `You're up pretty late, ${config.name}.`;
    }
    else if ((hour >=5) && (hour < 8)) {
        message = `Getting an early start ${config.name}?`;
    }
    else if ((hour => 8) && (hour < 11)) {
        message = `Good morning, ${config.name}.`;
    }
    else if ((hour => 11) && (hour < 17)) {
        message = `Time to get stuff done, ${config.name}.`;
    }
    else if ((hour => 17) && (hour < 20)) {
        message = `Good evening, ${config.name}.`;
    }
    else if ((hour => 20) && (hour < 24)) {
        message = `Time to wrap things up, ${config.name}.`;
    }

    return message;
}

const setTheme = (theme) => {
    if (!config.themes.hasOwnProperty(theme)) {
        window.alert(`Error: theme "${theme}" does not exist.`);
    }

    if (!config.themes[theme].timeOfDay) {
        injectColors(theme);
    }

    const date = new Date();
    const hour = date.getHours();
    const begin = config.themes[theme].themeBegin;
    const end = config.themes[theme].themeEnd;

    if ((begin || end) > 24) {
        return window.alert("Error: theme begin/end values are not 0-24.");
    }

    if (begin < end) {
        // if between specified times, use selected theme.
        if ((hour >= begin) && (hour <= end)) injectColors(theme);
    } else {
        // if between begin-24 or 0-end, use selected theme.
        if ((hour >= begin) || (hour <= end)) injectColors(theme);
    }
}

const injectColors = (theme) => {
    const root = document.documentElement;
    root.style.setProperty("--bg-color", config.themes[theme].bgColor);
    root.style.setProperty("--group-color", config.themes[theme].groupColor);
    root.style.setProperty("--text-color", config.themes[theme].textColor);
    root.style.setProperty("--text-hover-color", config.themes[theme].textHoverColor);
}

const detectKeyPress = (bookmarks, config) => {
    addEventListener("keypress", (e) => {
        for (const [key, val] of Object.entries(bookmarks)) {
            for (const [bkKey, bkVal] of Object.entries(val)) {
                if (!bkVal.name || !bkVal.url) continue;
                if (e.key === bkKey) {
                    window.location.href = bkVal.url;
                }
            }
        }
    });
}

const populateBookmarks = () => {
    class Bookmarks extends HTMLElement {
        constructor() {
            super();
            this.renderBookmarks();
        }

        renderBookmarks() {
            const groupTemplate = document.querySelector("#bookmark-group-template")
            const bookmarkTemplate = document.querySelector("#bookmark-template");

            for (const [key, val] of Object.entries(bookmarks)) {
                const groupclone = groupTemplate.content.cloneNode(true);
                groupclone.querySelector(".group-header").innerText = key;

                for (const [bkKey, bkVal] of Object.entries(val) ) {
                    if(!bkVal.name || !bkVal.url) continue;

                    const clone = bookmarkTemplate.content.cloneNode(true);
                    const bookmark = clone.querySelector(".bookmark");

                    bookmark.href = bkVal.url;
                    clone.querySelector(".shortcut").innerText = bkKey;
                    clone.querySelector(".name").innerText = bkVal.name;
                    groupclone.querySelector(".group").appendChild(clone);
                    
                }

                // Who said we needed a shadow root? lmao
                const row = document.querySelector(".row");
                row.appendChild(groupclone);
            }

        }
    }
    customElements.define('bookmarks-component', Bookmarks);
}

document.addEventListener("DOMContentLoaded", function(event) { 
    document.querySelector("#header").innerHTML = todMessage();
    populateBookmarks();
    if (config.useTheme) setTheme(config.useTheme);
    if (config.detectKeyPress) detectKeyPress(bookmarks, config);
});    

