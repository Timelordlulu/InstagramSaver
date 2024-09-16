chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'INSTAGRAM_SAVE') {
        fetch('http://localhost:3000/instagram-save', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(message.postInfo)
        })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            sendResponse({ success: true });
        })
        .catch((error) => {
            console.error('Error:', error);
            sendResponse({ success: false, error: error.message });
        });

        return true; // Indicates that the response is sent asynchronously
    }
});