//create project form
const form = document.querySelector('.createBlog.form > form');

//create project button
const createbtn = document.querySelector('.createBlog.form > form .submit .submitform');

createbtn.addEventListener('click', async (e) => {
    e.preventDefault();
    const titleError = document.querySelector('.createBlog.form > form .title.error');
    const descrError = document.querySelector('.createBlog.form > form .description.error');
    const photoError = document.querySelector('.createBlog.form > form .cover.error');

    titleError.textContent = '';
    descrError.textContent = '';
    photoError.textContent = '';
    
    const project = {
        title: form.title.value,
        body: form.body.value,
        coverPhoto: form.coverPhoto.value
    }
    const res = await fetch('https://kagaba-etienne.cyclic.app/admin/projects/', {
        method: 'POST',
        body: JSON.stringify(project),
        headers: { 'Content-Type': 'application/json' }
    });
    const data = await res.json();
    if (data.errors) {
        titleError.textContent = data.errors.title;
        descrError.textContent = data.errors.body;
        photoError.textContent = data.errors.coverPhoto;
    }
    if (data.id){
        location.assign('/admin/projects');
    }
})