const config = {
    name: `[your name here]`,
    themes: {
        default: {
            "bgColor": "#FFF",
            "groupColor": "#FFDFCD",
            "textColor": "#000",
            "textHoverColor": "#C14600"
        },
        darkColors: {
            "timeOfDay": true,
            // Times (24hr) that dark mode will be turned on and off.
            "themeBegin": 19,
            "themeEnd": 7,

            "bgColor": "#121212",
            "groupColor": "#1D1D1D",
            "textColor": "#FFF",
            "textHoverColor": "#FFDFCD"
        }
    }
}

const bookmarks = {
// Group names must be different.

// x: {
//     name: "",
//     url: ""
// },
    "Study": {
        o: {
            name: "Outlook",
            url: "https://outlook.office.com/mail/"
        },
        n: {
            name: "Notion",
            url: "https://www.notion.so/"
        },
        b: {
            name: "MyBib",
            url: "https://www.mybib.com/#/"
        }
    },
    "Work": {
        p: {
            name: "Protonmail",
            url: "https://mail.proton.me/u/0/inbox"
        },
    },
    "Leisure": {
        w: {
            name: "WaniKani",
            url: "https://www.wanikani.com/dashboard"
        },
        t: {
            name: "Touhou Wiki",
            url: "https://en.touhouwiki.net/wiki/Touhou_Wiki"
        },
        h: {
            name: "Hacker News",
            url: "https://news.ycombinator.com/"
        },
        s: {
            name: "Spotify",
            url: "https://open.spotify.com/"
        },
    }
}

const todMessage = () => {
    const date = new Date();
    const hour = date.getHours();
    let message;

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

const todTheme = (theme) => {
    if (config.themes[theme].timeOfDay === false) {
        return;
    }

    const date = new Date();
    const hour = date.getHours();

    if ((hour >= config.themes[theme].themeBegin) ||  hour < config.themes[theme].themeEnd) {
        injectColors(theme);
    } else {
        injectColors("default");
    }
}

const injectColors = (theme) => {
    if(theme == null) {
        // TODO: validate input
        console.error(`Theme "${theme}" doesn't exist`);
    }

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
    todTheme("darkColors") 
    populateBookmarks();
    detectKeyPress(bookmarks, config);
});    

