//create blog form
const form = document.querySelector('.createBlog.form > form');

//create blog button
const createbtn = document.querySelector('.createBlog.form > form .submit .submitform');

createbtn.addEventListener('click', async (e) => {
    e.preventDefault();
    const titleError = document.querySelector('.createBlog.form > form .title.error');
    const descrError = document.querySelector('.createBlog.form > form .body.error');
    const photoError = document.querySelector('.createBlog.form > form .cover.error');

    titleError.textContent = '';
    descrError.textContent = '';
    photoError.textContent = '';

    const blog = {
        title: form.title.value,
        body: form.body.value,
        author: "Etienne Kagaba",
        coverPhoto: form.coverPhoto.value,
    }
    const res = await fetch('https://kagaba-etienne.cyclic.app/admin/blogs/', {
        method: 'POST',
        body: JSON.stringify(blog),
        headers: { 'Content-Type': 'application/json' }
    });
    const data = await res.json();
    if (data.errors) {
        titleError.textContent = data.errors.title;
        descrError.textContent = data.errors.body;
        photoError.textContent = data.errors.coverPhoto;
    }
    if (data.id){
        location.assign('/admin/blogs');
    }
})