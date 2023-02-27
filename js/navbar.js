const menubtns = document.querySelectorAll(".links > ul:last-child > li > div");
const navbar = document.querySelector(".links > ul:first-child");
const AutoCloseNav = document.querySelectorAll(".links > ul:last-child");

function hidemenu() {
    menubtns[0].classList.add("active");
    menubtns[1].classList.remove("active");
    navbar.classList.remove("open");
}

function openmenu() {
    navbar.classList.add("open");
    menubtns[0].classList.remove("active");
    menubtns[1].classList.add("active");
}

menubtns[0].addEventListener('click', openmenu);

menubtns[1].addEventListener('click', hidemenu);

//when there is an outside click but navbar open

const outsideNav = document.querySelector('.wrapper');

if(menubtns[0].classList.contains('active')) {
    outsideNav.addEventListener('click', hidemenu);
}