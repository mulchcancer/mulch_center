// 1. UPDATE THE YEAR
document.getElementById('current-year').textContent = new Date().getFullYear()
// DELAY CARROUSEL START

// Wait until the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {

  // --- OWL CAROUSEL INIT ---
  const owlElements = document.querySelectorAll('.owl-carousel');
  if (owlElements.length) {
    // If jQuery is loaded, you can use jQuery initialization
    $(owlElements).each(function() {
      $(this).owlCarousel({
        loop: true,          // infinite loop
        margin: 10,          // margin between items
        nav: true,           // next/prev arrows
        dots: true,          // pagination dots
        items: 1,            // default items visible
        autoplay: true,
        autoplayTimeout: 5000,
        autoplayHoverPause: true
      });
    });
  }

  // --- GLIGHTBOX INIT ---
  if (typeof GLightbox !== 'undefined') {
    const lightbox = GLightbox({
      selector: '.glightbox',
      loop: true
    });
  }

});
