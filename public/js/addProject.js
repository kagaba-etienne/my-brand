//Getting short descriptions
const getShort = function (body) {
    if (body.length > 203) {
        return `${body.slice(0, 202)} ...`;
    }
    else {
        return body;
    }
}

//create project form
const form = document.querySelector('.createBlog.form > form');

//create project button
const createbtn = document.querySelector('.createBlog.form > form .submit .submitform');

createbtn.addEventListener('click', async (e) => {
    e.preventDefault();
    const shortDescription = getShort(form.body.value);
    const project = {
        title: form.title.value,
        body: form.body.value,
        shortDescr: shortDescription,
        rest: form.body.value.replace(shortDescription, ''),
        coverPhoto: form.coverPhoto.value,
        publish: false
    }
    await fetch('https://kagaba-etienne.cyclic.app/admin/projects/', {
        method: 'POST',
        body: JSON.stringify(project),
        headers: { 'Content-Type': 'application/json' }
    });
    window.location.replace('/admin/projects');
})