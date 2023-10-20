const hamb = document.querySelector(".hamburger");
const menu = document.querySelector(".menu");
let open;

function openMenu() {
    if (open) {
       menu.style.display = "none";
       open = false;
    } else if (!open) {
       menu.style.display = "block";
       open = true;
    }
  }
