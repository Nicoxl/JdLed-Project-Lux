/*Script di funzionamento menu a tendina header*/
const menuToggle = document.getElementById("menuToggle");
    const navMenu = document.querySelector(".menu");
    const scrollingText = document.getElementById("scrollingText");

menuToggle.addEventListener("click", () => {
    navMenu.classList.toggle("active");
    scrollingText.classList.toggle("hide-scroll");
});