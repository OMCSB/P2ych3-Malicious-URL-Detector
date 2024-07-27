document.addEventListener('DOMContentLoaded', function() {
    const idsCheckbox = document.getElementById("ids-switch");
    console.log(idsCheckbox.checked)

    // Load state from chrome.storage
    chrome.storage.sync.get(['idsCheckboxState', 'ipsCheckboxState'], function(result) {
        if (result.idsCheckboxState !== undefined) {
            idsCheckbox.checked = result.idsCheckboxState;
        }
    });

    // Save state when the checkbox changes
    idsCheckbox.addEventListener('change', function() {
        if (this.checked) {
            console.log('Intrusion Detection Enabled');
            // Send a message to the background script to enable the listener
            chrome.runtime.sendMessage({ action: 'enableIntrusionDetection' });
            chrome.storage.sync.set({idsCheckboxState: idsCheckbox.checked});
        } else {
            console.log('Intrusion Detection Disabled');
            // Send a message to disable the listener if necessary
            chrome.runtime.sendMessage({ action: 'disableIntrusionDetection' });
            chrome.storage.sync.set({idsCheckboxState: idsCheckbox.checked});
        }
    });
});

// idsCheckbox.addEventListener('change', function() {
//     if (this.checked) {
//         console.log('Intrusion Detection enabled');
//         // Send a message to the background script to enable the listener
//         chrome.runtime.sendMessage({ action: 'enableIntrusionDetection' });
//     } else {
//         console.log('Intrusion Detection disabled');
//         // Send a message to disable the listener if necessary
//         chrome.runtime.sendMessage({ action: 'disableIntrusionDetection' });
//     }
// });
