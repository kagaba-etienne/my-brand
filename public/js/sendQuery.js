const contactForm = document.querySelector('.container.contact form');

async function sendQuery() {
    const emailError = document.querySelector('.container.contact form .email.error');
    const nameError = document.querySelector('.container.contact form .name.error');
    const messageError = document.querySelector('.container.contact form .message.error');

    emailError.textContent = '';
    nameError.textContent = '';
    messageError.textContent = '';

    let query = {
        name: contactForm.name.value,
        email: contactForm.email.value,
        phone: contactForm.phone.value,
        message: contactForm.message.value,
        photo: contactForm.name.value.trim()[0]
    }

    const res = await fetch(`http://localhost:3000/contact`, {
        method: "POST",
        body: JSON.stringify(query),
        headers: { 'Content-Type': 'application/json' }
    });
    const data = await res.json();
    console.log(data);
    if (data.errors) {
        emailError.textContent = data.errors.email;
        nameError.textContent = data.errors.name;
        messageError.textContent = data.errors.message;
    } else {
        location.assign('/');
    }
}

const querysbmtbtn = document.querySelector('form.contact button');

querysbmtbtn.addEventListener('click', sendQuery);

