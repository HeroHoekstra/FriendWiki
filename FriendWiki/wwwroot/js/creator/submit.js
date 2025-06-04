async function submitArticle() {
    try {
        const useEdit = window.location.href.includes("editor");

        cleanData(data);
        if (!data.paragraphs)
            data.paragraphs = [];
        if (!data.summary.rows)
            data.summary.rows = [];
        
        data.summary.rows = Object.values(data.summary.rows);
        $.each(data.paragraphs, function (_, value) {
            if (value.images)
                value.images = Object.values(value.images);
        });

        const url = useEdit ? "/article/editor" : "/article/creator";
        const response = await fetch(url, {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json"
            }
        });

        if (!response.ok)
            throw new Error(await response.json());

        const result = await response.json();
        window.location.href = `/article/${result.id}`;
    } catch (error) {
        console.error(`An error occurred: ${error}`);
    }
}

function isEmptyImage(obj) {
    return obj &&
        typeof obj === 'object' &&
        obj.source === "" &&
        obj.alternative === "Your image description";
}

function cleanData(data) {
    if (data === undefined || data === null) {
        return;
    }
    
    if (Array.isArray(data)) {
        for (let i = data.length - 1; i >= 0; i--) {
            const item = data[i];
            if (item === undefined || item === null || item === "") {
                data.splice(i, 1);
            } else if (typeof item === 'object') {
                if (isEmptyImage(item)) {
                    data.splice(i, 1);
                } else {
                    cleanData(item);
                }
            } else if (typeof item === 'string') {
                data[i] = item.replace(/<br\s*\/?>/gi, '\n');
            }
        }
    } else if (typeof data === 'object' && data !== null) {
        for (const key in data) {
            const value = data[key];
            if (value === undefined || value === null || value === "") {
                delete data[key];
            } else if (typeof value === 'object') {
                if (isEmptyImage(value)) {
                    delete data[key];
                } else {
                    cleanData(value);
                    if (typeof data[key] === 'object' && Object.keys(data[key]).length === 0) {
                        delete data[key];
                    }
                }
            } else if (typeof value === 'string') {
                data[key] = value.replace(/<br\s*\/?>/gi, '\n');
            }
        }
    }
}
