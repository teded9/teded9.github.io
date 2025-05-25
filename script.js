// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault(); // Prevent default anchor click behavior
        const target = document.querySelector(this.getAttribute('href')); // Get the target element
        if (target) {
            // Scroll to the target element smoothly
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Header scroll effect: changes background and blur when scrolling down
let lastScrollY = 0;
window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    const currentScrollY = window.scrollY;
    
    if (currentScrollY > 100) { // If scrolled more than 100px
        header.style.background = 'rgba(0, 0, 0, 0.95)'; // Make background slightly more opaque
        header.style.backdropFilter = 'blur(30px)'; // Increase blur
    } else {
        header.style.background = 'rgba(0, 0, 0, 0.9)'; // Original background opacity
        header.style.backdropFilter = 'blur(20px)'; // Original blur
    }
    
    lastScrollY = currentScrollY;
});

// Intersection observer for animations: applies 'slideInUp' animation when elements enter viewport
const observerOptions = {
    threshold: 0.1, // Trigger when 10% of the element is visible
    rootMargin: '0px 0px -50px 0px' // Adjust the viewport margin for observation
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) { // If the element is currently intersecting the viewport
            entry.target.style.animation = 'slideInUp 0.8s ease-out forwards'; // Apply animation
            observer.unobserve(entry.target); // Stop observing once animated
        }
    });
}, observerOptions);

// Observe product cards and about content for animation
document.querySelectorAll('.product-card, .about-content').forEach(el => {
    observer.observe(el);
});

/* Reviews Carousel JavaScript */
let currentScrollPosition = 0; // Current scroll position of the carousel
const scrollSpeed = 0.5; // Pixels per frame for scrolling (adjust for speed)
let animationFrameId; // To store the requestAnimationFrame ID for stopping/starting

/**
 * Clones the review cards to create a seamless looping effect.
 * This function should be called once on load.
 */
function setupReviewsCarouselClones() {
    const reviewsCarouselInner = document.getElementById('reviewsCarouselInner');
    if (!reviewsCarouselInner) return;

    // Get all original review cards
    const originalReviews = Array.from(reviewsCarouselInner.children);
    
    // Clone and append them twice to ensure enough content for a continuous loop
    originalReviews.forEach(card => {
        reviewsCarouselInner.appendChild(card.cloneNode(true));
    });
    originalReviews.forEach(card => {
        reviewsCarouselInner.appendChild(card.cloneNode(true));
    });
}

/**
 * Animates the reviews carousel to create a continuous scrolling effect.
 * Uses requestAnimationFrame for smooth animation.
 */
function animateReviewsCarousel() {
    const reviewsCarouselInner = document.getElementById('reviewsCarouselInner');
    if (!reviewsCarouselInner) return;

    // Get the width of a single review card including its margin-right
    // Assuming all review cards have the same width and margin
    const firstReviewCard = reviewsCarouselInner.querySelector('.review-card');
    if (!firstReviewCard) return;

    const cardWidth = firstReviewCard.offsetWidth + 
                     parseFloat(getComputedStyle(firstReviewCard).marginRight);
    
    // Calculate the total width of the original set of reviews
    // We cloned the original set twice, so divide total children by 3
    const originalContentWidth = reviewsCarouselInner.children.length / 3 * cardWidth;

    currentScrollPosition += scrollSpeed;

    // If the current scroll position exceeds the original content width,
    // reset it to create a seamless loop
    if (currentScrollPosition >= originalContentWidth) {
        currentScrollPosition = 0; // Reset to the beginning of the original content
    }

    reviewsCarouselInner.style.transform = `translateX(-${currentScrollPosition}px)`;

    // Continue the animation loop
    animationFrameId = requestAnimationFrame(animateReviewsCarousel);
}

/**
 * Initializes the reviews carousel: sets up clones and starts animation.
 */
function initializeReviewsCarousel() {
    setupReviewsCarouselClones(); // Setup clones first
    animateReviewsCarousel(); // Start the animation
}

// Start the reviews carousel animation when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    initializeReviewsCarousel();
});

// Optional: Pause animation on hover for better readability
const reviewsCarouselContainer = document.querySelector('.reviews-carousel-container');
if (reviewsCarouselContainer) {
    reviewsCarouselContainer.addEventListener('mouseenter', () => {
        cancelAnimationFrame(animationFrameId); // Stop animation on hover
    });

    reviewsCarouselContainer.addEventListener('mouseleave', () => {
        animateReviewsCarousel(); // Resume animation on mouse leave
    });
}
