const contactForm = document.querySelector('.container.contact form');


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

async function sendQuery() {
    let query = {
        name: contactForm.name.value,
        email: contactForm.email.value,
        phone: contactForm.phone.value,
        message: contactForm.message.value,
        photo: "",
        date: dateConverter(new Date().toJSON().slice(0, 10)),
        status: "pending"
    }

    await fetch(`http://localhost:3000/Queries`, {
        method: "POST",
        body: JSON.stringify(query),
        headers: { 'Content-Type': 'application/json' }
    })
}

contactForm.addEventListener('submit', sendQuery);

