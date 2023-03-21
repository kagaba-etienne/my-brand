const tabs = document.querySelectorAll('.tabs > div');
const addBlogBtn = document.querySelector('.actions > .add');
const cancelBtn = document.querySelector(".editing.form form .submit > .cancel");
const cancelCreate = document.querySelector(".createBlog.form form .submit > .cancel");
const Create_form = document.querySelector('.createBlog.form > form');

//set create blog form active
function createform() {
    tabs.forEach(item => {
        item.classList.remove('active');
    })
    tabs[0].classList.add('active');
}

// return to blog list tab
function returnToBlogs() {
    tabs.forEach(item => {
        item.classList.remove('active');
    })
    tabs[1].classList.add('active');
}

// seracrhing blogs
const searchForm = document.querySelector('.heading > .search');

searchForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const term = searchForm.term.value;


    location.assign(`https://kagaba-etienne.cyclic.app/admin/projects${ term ? `?term=${term}`: ''}`);
})

cancelBtn.addEventListener('click', returnToBlogs);
addBlogBtn.addEventListener('click', createform);
cancelCreate.addEventListener('click', () => {
    tabs.forEach(item => {
        item.classList.remove('active');
    })
    tabs[1].classList.add('active');
    Create_form.reset();
});