import Cookies from "js-cookie";

let isLocal = window.location.host.startsWith("localhost");
export const destinations = {
    ACCOUNT: isLocal ? "//localhost:8100/accounts/" : "//api.115mc.com/accounts/",
    MINECRAFT: isLocal ? "//localhost:8100/minecraft/" : "//api.115mc.com/minecraft/",
    ZMZAON_ITEMS: isLocal ? "//localhost:8211/items/" : "//www.empiraft/items/",
    ZMZAON_REVIEWS: isLocal ? "//localhost:8211/reviews/" : "//www.empiraft/reviews/"
};

export function getQQAuthLink(state="115mc", device="pc") {
    return `https://graph.qq.com/oauth2.0/authorize?response_type=code&client_id=101964308&redirect_uri=https://api.115mc.com/qq-callback&state=${state}&display=${device}`;
}

export async function postData(url='', data={}) {
    console.log("[INFO] Attempting to send post request: ", data);
    // Default options are marked with *
    const response = await fetch(url, {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
            'Content-Type': 'application/json'
        },
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: JSON.stringify(data) // body data type must match "Content-Type" header
    });
    return response.json(); // parses JSON response into native JavaScript objects
}

export async function getData(url='') {
    console.log("[INFO] Attempting to send get request: ", url);
    // Default options are marked with *
    const response = await fetch(url, {
        method: 'GET', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
            'Content-Type': 'application/json'
        },
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    });
    return response.json(); // parses JSON response into native JavaScript objects
}

export async function queryAccount(uid, token, onSuccessCb=acc=>console.log(acc), onFailCb=data=>console.log(data)) {
    postData(destinations.ACCOUNT, {action: "query", uid, token})
        .then(data=>{
            console.log(data);
            if (data.code !== 0 || !data.account?.ip_address) {
                Cookies.remove("uid", {path: '/'});
                Cookies.remove("token", {path: '/'});
                onFailCb(data);
                return undefined;
            }
            onSuccessCb(data.account);
            return data.account;
        });
}