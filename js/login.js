const helpbtn = document.querySelector('.help');
const signupLink = document.querySelector('.signuplink');

function popup() {
    signupLink.classList.toggle("visible");
}

helpbtn.addEventListener('click', popup);