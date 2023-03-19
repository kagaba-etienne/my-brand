const helpbtn = document.querySelector('.help');
const signupLink = document.querySelector('.signuplink');

function popup() {
    signupLink.classList.toggle("visible");
}

helpbtn.addEventListener('click', popup);

const loginForm = document.querySelector('.form.login form');

if (loginForm) {
    const emailError = document.querySelector('.form.login form .email.error');
    const passError = document.querySelector('.form.login form .password.error');
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        emailError.textContent = '';
        passError.textContent = '';
        const credentials = {
            email: loginForm.email.value,
            password: loginForm.password.value
        };
    
        const res = await fetch('https://kagaba-etienne.cyclic.app/login', {
            method: 'POST',
            body: JSON.stringify(credentials),
            headers: { 'content-type' : 'application/json'}
        });

        const data = await res.json();
        console.log(data);
        if (data.errors) {
            emailError.textContent = data.errors.email;
            passError.textContent = data.errors.password;
        }
        if (data.user){
            location.assign('/admin');
        }
    });
} else { 
    const signupForm = document.querySelector('.form.signup form');
    const emailError = document.querySelector('.form.signup form .email.error');
    const nameError = document.querySelector('.form.signup form .name.error');
    const passError = document.querySelector('.form.signup form .password.error');
    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        emailError.textContent = '';
        nameError.textContent = '';
        passError.textContent = '';
        const user = {
            name: signupForm.name.value,
            email: signupForm.email.value,
            password: signupForm.password.value
        };

        const res = await fetch('https://kagaba-etienne.cyclic.app/signup', {
            method: 'POST',
            body: JSON.stringify(user),
            headers: { 'content-type' : 'application/json'}
        });
        const data = await res.json();
        if (data.errors) {
            emailError.textContent = data.errors.email;
            nameError.textContent = data.errors.name;
            passError.textContent = data.errors.password;
        }
        if (data.user){
            location.assign('/admin');
        }
    });
}
