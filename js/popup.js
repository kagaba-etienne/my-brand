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

function dateConverter(numbers) {
    numbers = numbers.split("-")
    mapToMonths = {
        "01": 'JANUARY',
        "02": 'FEBRUARY',
        "03": 'MARCH',
        "04": 'APRIL',
        "05": 'MAY',
        "06": 'JUNE',
        "07": 'JULY',
        "08": 'AUGUST',
        "09": 'SEPTEMBER',
        "10": 'OCTOBER',
        "11": 'NOVEMBER',
        "12": 'DECEMBER',
    }

    return `${mapToMonths[numbers[1]]} ${numbers[2]}, ${numbers[0]}`
}

const subscribe = document.querySelector('.popup .subscribe-form .subscribebtn');

const validateSend = async () => {
    if (actualForm.email.value == actualForm.emailConf.value && actualForm.agreement.checked == true) {
        let subscriber = {
            name: actualForm.name.value,
            email: actualForm.email.value,
            date: dateConverter(new Date().toJSON().slice(0, 10))
        }

        await fetch('http://localhost:3000/subscribers', {
            method: 'POST',
            body: JSON.stringify(subscriber),
            headers: {'content-type' : 'application/json'}
        })
        popupClose.dispatchEvent(clickEvent);
    }
}

subscribe.addEventListener('click', validateSend);