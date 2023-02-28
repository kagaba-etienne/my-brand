const blogContainer = document.querySelector('.blogcards');

const renderBlogs = async () => {
    let res = await fetch('https://kagaba-etienne.cyclic.app/Blogs?publish=true');
    res = await res.json();

    let blogs = '';
    res.forEach(blog => {
        blogs += `<div class="blogcard card0 card${blog.id}">
<div class="cover" data-src="${blog.coverPhoto}">
</div>
<div class="head">
    <h2 class="title">
    ${blog.title}
    </h2>
    <p class="date">UPDATED ON ${blog.date} • BY ${blog.author}</p>
</div>
<div class="description">
    <p>
    ${blog.shortDescr}
    </p>
    <button class="continueReading" id="${blog.id}">Continue Reading</button>
</div>
<div class="ingraph">
    <img src="./assets/small graphic.svg" alt="stripes graphic">
</div>
</div>`;
    });

    blogContainer.innerHTML = blogs;
}

window.addEventListener('DOMContentLoaded', async () => {
    await renderBlogs();

    const contRdBtns = document.querySelectorAll('button.continueReading');

    contRdBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            window.location.replace(`./blogposts.html?id=${btn.id}`);
        })
    })
});