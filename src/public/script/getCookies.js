const deleteCookie = (name) => {
    document.cookie = name + '=; Max-Age=0; path=/;';
};

const getCookies = (name) => {
    const nameEQ = name + '=';
    let ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i].trim();
        if (c.indexOf(nameEQ) === 0) {
            return decodeURIComponent(c.substring(nameEQ.length, c.length));
        }
    }
    return null;
};
