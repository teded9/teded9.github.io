// Reviews Carousel Implementation
class ReviewsCarousel {
  constructor() {
    this.container = document.getElementById("reviewsCarouselInner");
    this.cards = [];
    this.currentPosition = 0;
    this.cardWidth = 320; // 300px + 20px margin
    this.speed = 1; // pixels per frame
    this.isRunning = false;
    this.animationFrame = null;

    this.init();
  }

  init() {
    if (!this.container) {
      console.error("Reviews carousel container not found");
      return;
    }

    // Get original cards and clone them for infinite effect
    const originalCards = Array.from(
      this.container.querySelectorAll(".review-card")
    );
    this.cards = [...originalCards];

    // Clone cards multiple times to ensure smooth infinite scroll
    const cloneCount = Math.ceil(window.innerWidth / this.cardWidth) + 5;
    for (let i = 0; i < cloneCount; i++) {
      originalCards.forEach((card) => {
        const clone = card.cloneNode(true);
        this.container.appendChild(clone);
        this.cards.push(clone);
      });
    }

    // Set initial position (start from right side of screen)
    this.currentPosition = window.innerWidth;
    this.updatePosition();

    // Start animation
    this.start();

    // Handle window resize
    window.addEventListener("resize", () => this.handleResize());

    // Pause on hover
    this.container.addEventListener("mouseenter", () => this.pause());
    this.container.addEventListener("mouseleave", () => this.start());
  }

  updatePosition() {
    this.container.style.transform = `translateX(${this.currentPosition}px)`;
  }

  animate() {
    if (!this.isRunning) return;

    this.currentPosition -= this.speed;

    // Calculate total width of original cards
    const originalCardsCount = this.cards.length / Math.ceil(
      (window.innerWidth / this.cardWidth) + 6
    );
    const resetPoint = -(originalCardsCount * this.cardWidth);

    // Reset position when all original cards have passed
    if (this.currentPosition <= resetPoint) {
      this.currentPosition = window.innerWidth;
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
    // Adjust card width for mobile
    if (window.innerWidth <= 768) {
      this.cardWidth = 265; // 250px + 15px margin
    } else {
      this.cardWidth = 320; // 300px + 20px margin
    }

    // Reset position if needed
    if (this.currentPosition < -window.innerWidth) {
      this.currentPosition = window.innerWidth;
    }
  }
}

// Initialize carousel when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new ReviewsCarousel();
});

// Optional: Add smooth scrolling for navigation links
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

// Performance optimization: Intersection Observer for carousel
const observerOptions = {
  root: null,
  rootMargin: "0px",
  threshold: 0.1,
};

const carouselObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.target.id === "reviews") {
      const carousel = window.reviewsCarousel;
      if (carousel) {
        if (entry.isIntersecting) {
          carousel.start();
        } else {
          carousel.pause();
        }
      }
    }
  });
}, observerOptions);

// Observe reviews section
document.addEventListener("DOMContentLoaded", () => {
  const reviewsSection = document.getElementById("reviews");
  if (reviewsSection) {
    carouselObserver.observe(reviewsSection);
  }
});
