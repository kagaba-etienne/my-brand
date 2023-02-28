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

// retrieving blogs

const container = document.querySelector('.blogcards');
const searchForm = document.querySelector('.heading > .search');

//determing publish button text 

function publishText(publish) {
    if (publish) {
        return "Unpublish";
    }
    else {
        return "publish";
    }
}

// rendering posts
const renderPosts = async (term) => {
    let uri = 'https://kagaba-etienne.cyclic.app/Blogs';
    if (term) {
        uri += `?q=${term}`;
    }
    const res = await fetch(uri);
    const posts = await res.json();

    let template = '';
    posts.forEach(post => {
        template += `<div class="blogcard card0 publish-${post.publish}" id="${post.id}">
        <div class="cover" data-src="${post.coverPhoto}">
        </div>
        <div class="head">
            <h2 class="title">
                ${post.title}
            </h2>
            <p class="date">UPDATED ON ${post.date} • BY ${post.author}</p>
        </div>
        <div class="description">
            <p>
                ${post.shortDescr}. . .
            </p>
            <div class="blogActions">
                <button class="edit" type="button" id="${post.id}">Edit</button>
                <button class="publish ${post.publish}" type="button" id="${post.id}">${publishText(post.publish)}</button>
                <button class="delete" type="button" id="${post.id}">Delete</button>
            </div>
        
        </div>
        <div class="ingraph">
            <img class="stripes ${!(post.publish)}" src="./assets/Graphic (1).svg" alt="">
            <img class="verified ${post.publish}" src="./assets/verified-svgrepo-com.svg" alt="">
        </div>
        </div>`
    })
    container.innerHTML = template;
}
searchForm.addEventListener('submit', e => {
    e.preventDefault();
    renderPosts(searchForm.term.value.trim())
})

function deleteMethod() {
    const deleteBtn = document.querySelectorAll('.blogActions .delete');

    deleteBtn.forEach(btn =>{
        btn.addEventListener('click', async (e) => {
            e.preventDefault();
            await fetch(`https://kagaba-etienne.cyclic.app/Blogs/${btn.id}`, {
                method: 'DELETE'
            });
            window.location.replace('../admin edit blog.html');
        })
    })
}

function publishMethod() {
    const publishBtn = document.querySelectorAll('.blogActions .publish');

    publishBtn.forEach(btn => {
        if (btn.classList.contains('false')) {
            btn.addEventListener('click', async (e) => {
                e.preventDefault();
                const res = {
                    publish: true
                }
                await fetch(`https://kagaba-etienne.cyclic.app/Blogs/${btn.id}`, {
                    method: 'PATCH',
                    body: JSON.stringify(res),
                    headers: { 'Content-Type': 'application/json' }
                });
                window.location.replace('../admin edit blog.html');
            })
        }
        else {
            btn.addEventListener('click', async (e) => {
                e.preventDefault();
                const res = {
                    publish: false
                }
                await fetch(`https://kagaba-etienne.cyclic.app/Blogs/${btn.id}`, {
                    method: 'PATCH',
                    body: JSON.stringify(res),
                    headers: { 'Content-Type': 'application/json' }
                });
    
                window.location.replace('../admin edit blog.html');
            })
        }
    })
}

function updateMethod(){
    const editBtn = document.querySelectorAll('.blogActions .edit');
    const deleteBtn = document.querySelector('.editing.form .submit > .delete');
    const updateBtn = document.querySelector('.editing.form .submit > .update');
    const editForm = document.querySelector('.editing.form > form');

    editBtn.forEach(btn => {
        btn.addEventListener('click', async () => {
            tabs[1].classList.remove('active');
            tabs[2].classList.add('active');
            let res = await fetch(`https://kagaba-etienne.cyclic.app/Blogs/${btn.id}`);
            res = await res.json();
            editForm.title.value = res.title;
            editForm.coverPhoto.value = res.coverPhoto;
            editForm.body.value = res.body;
            updateBtn.id = btn.id;
            deleteBtn.id = btn.id;
        })
    })
    editForm.addEventListener('submit', async () => {
        let doc = {
            title: editForm.title.value,
            body: editForm.body.value,
            shortDescr: getShort(editForm.body.value),
            author: "Etienne Kagaba",
            // date: new Date().toJSON().slice(0, 10),
            coverPhoto: editForm.coverPhoto.value,
            comments: 0
        }

        await fetch(`https://kagaba-etienne.cyclic.app/Blogs/${updateBtn.id}`, {
            method: 'PATCH',
            body: JSON.stringify(doc),
            headers: { 'Content-Type': 'application/json' }
        });
        window.location.replace('../admin edit blog.html');
    })
    deleteBtn.addEventListener('click', async() => {
        await fetch(`https://kagaba-etienne.cyclic.app/Blogs/${deleteBtn.id}`, {
            method: 'DELETE'
        });
        window.location.replace('../admin edit blog.html');
    })
}

cancelBtn.addEventListener('click', returnToBlogs);
addBlogBtn.addEventListener('click', createform);
cancelCreate.addEventListener('click', () => {
    tabs.forEach(item => {
        item.classList.remove('active');
    })
    tabs[1].classList.add('active');
    Create_form.reset();
});

window.addEventListener('DOMContentLoaded', async () => {
    await renderPosts();
    deleteMethod();
    publishMethod();
    updateMethod();
});