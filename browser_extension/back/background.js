console.log("Service worker started");

chrome.declarativeNetRequest.onRuleMatchedDebug.addListener((e) => {
    const msg = `Ping to ${e.request.url} blocked on tab ${e.request.tabId}.`;
    console.log(msg);
});

let intrusionDetectionEnabled = false;

let listenerRequest = async function(details) {
    console.log('Request URL:', details.url);
    console.log('Request Method:', details.method);
    console.log('Request Headers:', details.requestHeaders);

    let timeS = new Date();
    let timeJ = timeS.toJSON();

    const sendE = await sendEvent(timeJ, details.url, details.method, details.requestHeaders)
    if(sendE == 1){
        console.log("Done!")
    }
    return { cancel: false }; // Set to true to block the request
};

let completeRequest = function(details) {
    console.log('Request completed:', details.url);
};

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'enableIntrusionDetection') {
        if (!intrusionDetectionEnabled) {
            someFunctionForIntrusionDetection();
            intrusionDetectionEnabled = true;
        }
    } else if (request.action === 'disableIntrusionDetection') {
        if (intrusionDetectionEnabled) {
            // Disable the listener or perform any cleanup
            chrome.webRequest.onBeforeRequest.removeListener(listenerRequest);
            chrome.webRequest.onCompleted.removeListener(completeRequest);
            console.log('Intrusion Detection Listener Removed')
            intrusionDetectionEnabled = false;
        }
    }
});

function someFunctionForIntrusionDetection() {
    chrome.webRequest.onBeforeRequest.addListener(
        listenerRequest,
        { urls: ["<all_urls>"] }
    );
        
    chrome.webRequest.onCompleted.addListener(
        completeRequest,
        { urls: ["<all_urls>"] }
    );
    console.log('Intrusion Detection Listener Added');
}

async function sendEvent(timeJ, url, method, reqHead){
    try {
        fetch('http://localhost:5000/send_events', {
            method: "POST",
            
            body: JSON.stringify({
                Timestamp: timeJ,
                URL: url,
                Method: method,
                Header: reqHead
            }),
    
            headers:{
                "Content-Type": "application/json"
            }
        })
        return 1
    } catch(error){
        console.log(`Error logging events: ${error}`)
    }
}