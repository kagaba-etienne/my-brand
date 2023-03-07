let clickEvent = new Event('click');
//poping subscribe form
const nav = document.querySelector('nav')
const subscribeFrm = document.querySelector('.popup');
const subscribeBtn = document.querySelector('.links > ul:first-child > li:last-child');
const popupClose = document.querySelector('div.popup > div > div.close > img');
const actualForm = document.querySelector('.popup .subscribe-form');

function popup() {
    subscribeFrm.classList.add('open');
    nav.style.display = 'none';
}

function popupCls() {
    nav.style.display = 'flex';
    subscribeFrm.classList.remove('open');
    actualForm.reset();
    menubtns[0].classList.add("active");
    menubtns[1].classList.remove("active");
    navbar.classList.remove("open");
}

subscribeBtn.addEventListener('click', popup);
popupClose.addEventListener('click', popupCls);

//submitting subscribers
const subscribe = document.querySelector('.popup .subscribe-form .subscribebtn');

const validateSend = async () => {
    if (actualForm.email.value == actualForm.emailConf.value && actualForm.agreement.checked == true) {
        let subscriber = {
            name: actualForm.name.value,
            email: actualForm.email.value,
        }

        await fetch('https://kagaba-etienne.cyclic.app/subscribers', {
            method: 'POST',
            body: JSON.stringify(subscriber),
            headers: {'content-type' : 'application/json'}
        })
        window.location.reload();
    }
}

subscribe.addEventListener('click', validateSend);