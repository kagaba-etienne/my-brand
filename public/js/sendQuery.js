const contactForm = document.querySelector('.container.contact form');

async function sendQuery() {
    let query = {
        name: contactForm.name.value,
        email: contactForm.email.value,
        phone: contactForm.phone.value,
        message: contactForm.message.value,
        photo: "",
        status: "pending"
    }

    contactForm.reset();

    await fetch(`http://localhost:3004/contact`, {
        method: "POST",
        body: JSON.stringify(query),
        headers: { 'Content-Type': 'application/json' }
    });
    window.location.replace('/');
}

const querysbmtbtn = document.querySelector('form.contact button');

querysbmtbtn.addEventListener('click', sendQuery);

