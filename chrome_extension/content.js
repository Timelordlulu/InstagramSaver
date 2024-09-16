console.log('Instagram Saver: Content script loaded');

function insertSaveButton(article) {
    if (article.querySelector('.save-button')) return;

    const button = document.createElement('button');
    button.textContent = 'Save';
    button.className = 'save-button';
    button.style.cssText = `
        position: absolute;
        top: 5px;  // Changed from 5px to 10px to move it lower
        right: 40px;
        z-index: 1000;
        padding: 5px 10px;
        background-color: #0095f6;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 12px;
    `;
    article.style.position = 'relative';
    article.appendChild(button);

    button.addEventListener('click', (event) => {
        event.stopPropagation();
        handleSaveButtonClick(article);
    });
}

async function handleSaveButtonClick(article) {
    console.log('Save button clicked');
    try {
        const postInfo = await findPostInfo(article);
        if (!postInfo) {
            console.error('Could not find post information');
            return;
        }

        console.log('Post info captured:', postInfo);
        console.log('Number of media URLs found:', postInfo.mediaUrls.length);
        console.log('Media URLs:', postInfo.mediaUrls);
        chrome.runtime.sendMessage({ type: 'INSTAGRAM_SAVE', postInfo }, response => {
            console.log('Response from background script:', response);
        });
    } catch (error) {
        console.error('Error capturing post info:', error);
    }
}

async function findPostInfo(article) {
    const postLink = article.querySelector('a[href^="/p/"]')?.href;
    if (!postLink) return null;

    let mediaUrls = new Set();
    let isVideo = false;
    
    const videoElement = article.querySelector('video');
    if (videoElement) {
        isVideo = true;
    } else {
        const nextButton = article.querySelector('button[aria-label="Next"]');
        if (nextButton) {
            let loopCount = 0;
            const maxLoops = 20;

            do {
                const currentImages = article.querySelectorAll('img.x5yr21d.xu96u03.x10l6tqk.x13vifvy.x87ps6o.xh8yej3');
                currentImages.forEach(img => {
                    if (img.src) mediaUrls.add(img.src);
                });

                if (mediaUrls.size === loopCount + 1) break;

                nextButton.click();
                await new Promise(resolve => setTimeout(resolve, 300));
                
                loopCount++;
            } while (loopCount < maxLoops && !nextButton.disabled);
        } else {
            const singleImage = article.querySelector('img.x5yr21d.xu96u03.x10l6tqk.x13vifvy.x87ps6o.xh8yej3');
            if (singleImage?.src) mediaUrls.add(singleImage.src);
        }
    }

    let author = '';
    let content = '';
    const spans = article.querySelectorAll('span');
    spans.forEach((span, index) => {
        const text = span.textContent.trim();
        if (index === 3) {
            author = text;
        } else if (text === `${author}`) {
            // The next span should contain the content
            content = spans[index + 1] ? spans[index + 1].textContent.trim() : '';
        }
    });

    const timeElement = article.querySelector('time');
    const timestamp = timeElement ? timeElement.dateTime : new Date().toISOString();

    return { 
        postLink, 
        mediaUrls: Array.from(mediaUrls), 
        isVideo, 
        author, 
        content, 
        timestamp 
    };
}

function observeDOM() {
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        const articles = node.querySelectorAll('article');
                        articles.forEach(insertSaveButton);
                    }
                });
            } else if (mutation.type === 'attributes') {
                if (mutation.target.tagName === 'ARTICLE') {
                    insertSaveButton(mutation.target);
                }
            }
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['class']
    });
}

document.querySelectorAll('article').forEach(insertSaveButton);
observeDOM();

setInterval(() => document.querySelectorAll('article').forEach(insertSaveButton), 2000);

console.log('Instagram Saver: Content script fully loaded');