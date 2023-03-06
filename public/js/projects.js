const readmore = document.querySelectorAll('.dots');
const hiddenContent = document.querySelector('.more');

function unhide() {
    var hiddenContent = this.previousElementSibling
    if (this.innerHTML==". . . Read more") {
        this.innerHTML = ". . . Read less";
        hiddenContent.style.display = "inline";
    } 
    else {
        this.innerHTML = ". . . Read more";
        hiddenContent.style.display = "none";
    }
}

for(var i = 0; i<readmore.length; i++) {
    readmore[i].addEventListener('click', unhide);
}