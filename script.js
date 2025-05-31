// Reviews Carousel Implementation with Immediate Start
class ReviewsCarousel {
  constructor() {
    this.container = document.getElementById("reviewsCarouselInner");
    this.originalCards = [];
    this.allCards = [];
    this.currentPosition = 0;
    this.cardWidth = 320; // 300px + 20px margin
    this.speed = 1.2; // pixels per frame
    this.isRunning = false;
    this.animationFrame = null;
    this.containerWidth = 0;

    this.init();
  }

  init() {
    if (!this.container) {
      console.error("Reviews carousel container not found");
      return;
    }

    // Get viewport width
    this.containerWidth = window.innerWidth;
    
    // Adjust card width for mobile
    if (this.containerWidth <= 768) {
      this.cardWidth = 265; // 250px + 15px margin
    }

    // Get original cards
    this.originalCards = Array.from(
      this.container.querySelectorAll(".review-card")
    );

    this.setupCarousel();
    this.positionInitialCards();
    this.start();

    // Event listeners
    window.addEventListener("resize", () => this.handleResize());
    this.container.addEventListener("mouseenter", () => this.pause());
    this.container.addEventListener("mouseleave", () => this.start());
  }

  setupCarousel() {
    // Clear existing content
    this.container.innerHTML = "";
    this.allCards = [];

    // Calculate how many cards we need to fill screen + buffer
    const cardsNeeded = Math.ceil(this.containerWidth / this.cardWidth) + 6;
    const totalSets = Math.ceil(cardsNeeded / this.originalCards.length);

    // Clone cards to fill the viewport and provide buffer
    for (let i = 0; i < totalSets; i++) {
      this.originalCards.forEach((card) => {
        const clone = card.cloneNode(true);
        this.container.appendChild(clone);
        this.allCards.push(clone);
      });
    }
  }

  positionInitialCards() {
    // Position cards so they immediately fill the viewport
    // Start position ensures cards are visible from the beginning
    this.currentPosition = 0;
    this.updatePosition();
  }

  updatePosition() {
    this.container.style.transform = `translateX(${this.currentPosition}px)`;
  }

  animate() {
    if (!this.isRunning) return;

    this.currentPosition -= this.speed;

    // Calculate when to reset position for seamless loop
    const oneSetWidth = this.originalCards.length * this.cardWidth;
    
    // Reset when we've scrolled exactly one complete set
    if (this.currentPosition <= -oneSetWidth) {
      this.currentPosition += oneSetWidth;
    }

    this.updatePosition();
    this.animationFrame = requestAnimationFrame(() => this.animate());
  }

  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.animate();
  }

  pause() {
    this.isRunning = false;
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }
  }

  handleResize() {
    const newWidth = window.innerWidth;
    
    // Update card width for mobile
    if (newWidth <= 768) {
      this.cardWidth = 265;
    } else {
      this.cardWidth = 320;
    }

    // Only rebuild if significant width change
    if (Math.abs(newWidth - this.containerWidth) > 100) {
      this.containerWidth = newWidth;
      this.pause();
      this.setupCarousel();
      this.positionInitialCards();
      this.start();
    }
  }

  destroy() {
    this.pause();
    window.removeEventListener("resize", this.handleResize);
    this.container.removeEventListener("mouseenter", this.pause);
    this.container.removeEventListener("mouseleave", this.start);
  }
}

// Global variable to hold carousel instance
let reviewsCarousel = null;

// Initialize carousel when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  reviewsCarousel = new ReviewsCarousel();
});

// Smooth scrolling for navigation links
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });
});

// Performance optimization: Intersection Observer
const observerOptions = {
  root: null,
  rootMargin: "50px",
  threshold: 0.1,
};

const carouselObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.target.id === "reviews" && reviewsCarousel) {
      if (entry.isIntersecting) {
        reviewsCarousel.start();
      } else {
        reviewsCarousel.pause();
      }
    }
  });
}, observerOptions);

// Start observing when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  const reviewsSection = document.getElementById("reviews");
  if (reviewsSection) {
    carouselObserver.observe(reviewsSection);
  }
});

// Clean up on page unload
window.addEventListener("beforeunload", () => {
  if (reviewsCarousel) {
    reviewsCarousel.destroy();
  }
});
