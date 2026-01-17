document.addEventListener("click", function(event) {
    const toggleBtn = event.target.closest("#menuToggle");

    if (toggleBtn) {
        const navMenu = document.querySelector(".menu");
        const scrollingText = document.getElementById("scrollingText");
        if (navMenu) {
            navMenu.classList.toggle("active");
        }
        
        if (scrollingText) {
            scrollingText.classList.toggle("hide-scroll");
        }
    }
});