//Getting short descriptions
const getShort = function (body) {
    if (body.length > 203) {
        return `${body.slice(0, 202)} ...`;
    }
    else {
        return body;
    }
}

//create blog form
const form = document.querySelector('.createBlog.form > form');

//create blog button
const createbtn = document.querySelector('.createBlog.form > form .submit .submitform');

createbtn.addEventListener('click', async (e) => {
    e.preventDefault();
    const blog = {
        title: form.title.value,
        body: form.body.value.split('\n[COVER]\n'),
        shortDescr: getShort(form.body.value),
        author: "Etienne Kagaba",
        coverPhoto: form.coverPhoto.value,
        commentsCount: 0,
        publish: false
    }
    await fetch('http://localhost:3004/admin/blogs/', {
        method: 'POST',
        body: JSON.stringify(blog),
        headers: { 'Content-Type': 'application/json' }
    });
    window.location.replace('/admin/blogs');
})