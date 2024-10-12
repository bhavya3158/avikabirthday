// Select relevant DOM elements 
let items = document.querySelectorAll('.list .item'); // List items
let thumbnails = document.querySelectorAll('.thumbnail .item'); // Thumbnail items
let next = document.getElementById('next'); // Next button
let prev = document.getElementById('prev'); // Previous button
let stop = document.getElementById('stop'); // Stop/Play button for auto-slider
let itemActive = 0; // Track active item
let isPlaying = true; // Auto-play state
let refreshInterval;

// Auto-run slider, starts initially (every 5 seconds)
refreshInterval = setInterval(() => {
    next.click(); // Trigger next click every 5 seconds
}, 5000);

// Function to stop all audios except the current one
function stopAllAudios() {
    items.forEach((item, index) => {
        let audio = item.querySelector('audio'); // Select audio in each item
        if (audio) {
            if (index === itemActive) {
                try {
                    audio.play(); // Play the audio for the current active item
                } catch (e) {
                    console.log("Autoplay blocked or failed:", e);
                }
            } else {
                audio.pause(); // Pause other audios
                audio.currentTime = 0; // Reset other audios to start
            }
        }
    });
}

// Function to update slider display (list, thumbnail, and audio)
function showSlider() {
    stopAllAudios(); // Ensure only one audio plays at a time

    // Remove 'active' class from all items and thumbnails
    items.forEach(item => item.classList.remove('active'));
    thumbnails.forEach(thumbnail => thumbnail.classList.remove('active'));

    // Set 'active' class to the current item and thumbnail
    items[itemActive].classList.add('active');
    thumbnails[itemActive].classList.add('active');

    // Adjust thumbnail position if necessary
    setPositionThumbnail();
}

// Function to scroll the active thumbnail into view
function setPositionThumbnail() {
    let thumbnailActive = document.querySelector('.thumbnail .item.active');
    let rect = thumbnailActive.getBoundingClientRect();
    if (rect.left < 0 || rect.right > window.innerWidth) {
        thumbnailActive.scrollIntoView({ behavior: 'smooth', inline: 'nearest' });
    }
}

// Next button event - Move to the next slide
next.onclick = function() {
    itemActive = (itemActive + 1) % items.length; // Cycle to the next item
    showSlider(); // Update the slider
};

// Previous button event - Move to the previous slide
prev.onclick = function() {
    itemActive = (itemActive - 1 + items.length) % items.length; // Cycle to the previous item
    showSlider(); // Update the slider
};

// Stop button event - Toggle auto-play
stop.onclick = function() {
    if (!isPlaying) {
        refreshInterval = setInterval(() => { next.click(); }, 8000); // Restart auto-slider
        isPlaying = true;
        stop.innerHTML = '<i class="ti ti-player-pause"></i>'; // Change to pause icon
    } else {
        clearInterval(refreshInterval); // Stop auto-slider
        isPlaying = false;
        stop.innerHTML = '<i class="ti ti-player-play"></i>'; // Change to play icon
    }
};

// Thumbnail click event - Manually select an item
thumbnails.forEach((thumbnail, index) => {
    thumbnail.addEventListener('click', () => {
        itemActive = index; // Set clicked thumbnail as active
        showSlider(); // Update the slider
    });
});

// List item click event - Manually select an item
items.forEach((listItem, index) => {
    listItem.addEventListener('click', () => {
        itemActive = index; // Set clicked list item as active
        showSlider(); // Update the slider
    });
});

// Initialize slider on page load
showSlider();
