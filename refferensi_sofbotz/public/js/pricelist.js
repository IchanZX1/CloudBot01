const btnMenu = document.getElementById("menu");
const menuExit = document.getElementById("menu-exit");
const btnClose = document.getElementById("close");
const navMenu = document.getElementById("nav-menu");

btnMenu.addEventListener("click", () => {
  navMenu.style.transform = "translateX(0)";
});

btnClose.addEventListener("click", () => {
  navMenu.style.transform = "translateX(-100vw)";
});

menuExit.addEventListener("click", () => {
  navMenu.style.transform = "translateX(-100vw)";
});

/* When the user clicks on the button,
toggle between hiding and showing the dropdown content */
function toggleDropdown() {
  document.getElementById("myDropdown").classList.toggle("show");
}

// Close the dropdown if the user clicks outside of it
window.onclick = function (event) {
  if (!event.target.matches(".dropbtn")) {
    var dropdowns = document.getElementsByClassName("dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains("show")) {
        openDropdown.classList.remove("show");
      }
    }
  }
};
