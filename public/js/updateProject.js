//update project
function updateMethod(){
    const editBtn = document.querySelectorAll('.projectActions .edit');
    const deleteBtn = document.querySelector('.editing.form .submit > .delete');
    const updateBtn = document.querySelector('.editing.form .submit > .update');
    const editForm = document.querySelector('.editing.form > form');

    editBtn.forEach(btn => {
        btn.addEventListener('click', async () => {
            tabs[1].classList.remove('active');
            tabs[2].classList.add('active');
            let res = await fetch(`https://kagaba-etienne.cyclic.app/admin/projects/${btn.dataset.id}`);
            res = await res.json();

            editForm.title.value = res.title;
            editForm.coverPhoto.value = res.coverPhoto;
            editForm.body.value = res.body;
            updateBtn.dataset.id = btn.dataset.id;
            deleteBtn.dataset.id = btn.dataset.id;
        })
    })
    editForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const titleError = document.querySelector('.editing.form > form .title.error');
        const descrError = document.querySelector('.editing.form > form .description.error');
        const photoError = document.querySelector('.editing.form > form .cover.error');

        titleError.textContent = '';
        descrError.textContent = '';
        photoError.textContent = '';

        let doc = {
            title: editForm.title.value,
            body: editForm.body.value,
            coverPhoto: editForm.coverPhoto.value
        }

        const res = await fetch(`https://kagaba-etienne.cyclic.app/admin/projects/${updateBtn.dataset.id}`, {
            method: 'PATCH',
            body: JSON.stringify(doc),
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
    deleteBtn.addEventListener('click', async() => {
        await fetch(`https://kagaba-etienne.cyclic.app/admin/blogs/${deleteBtn.dataset.id}`, {
            method: 'DELETE'
        });
        location.assign('/admin/projects');
    })
}

//delete blog
function deleteMethod() {
    const deleteBtn = document.querySelectorAll('.blogActions .delete');

    deleteBtn.forEach(btn =>{
        btn.addEventListener('click', async (e) => {
            e.preventDefault();
            await fetch(`https://kagaba-etienne.cyclic.app/admin/projects/${btn.dataset.id}`, {
                method: 'DELETE'
            });
            location.assign('/admin/projects');
        })
    })
}

//publish blog
function publishMethod() {
    const publishBtn = document.querySelectorAll('.projectActions .publish');

    publishBtn.forEach(btn => {
        if (btn.classList.contains('false')) {
            btn.addEventListener('click', async (e) => {
                e.preventDefault();
                const res = {
                    publish: true
                }
                await fetch(`https://kagaba-etienne.cyclic.app/admin/projects/${btn.dataset.id}`, {
                    method: 'PATCH',
                    body: JSON.stringify(res),
                    headers: { 'Content-Type': 'application/json' }
                });
                location.assign('/admin/projects');
            })
        }
        else {
            btn.addEventListener('click', async (e) => {
                e.preventDefault();
                const res = {
                    publish: false
                }
                await fetch(`https://kagaba-etienne.cyclic.app/admin/projects/${btn.dataset.id}`, {
                    method: 'PATCH',
                    body: JSON.stringify(res),
                    headers: { 'Content-Type': 'application/json' }
                });
                location.assign('/admin/projects');
            })
        }
    })
}

window.addEventListener('DOMContentLoaded', () => {
    updateMethod();
    publishMethod();
    deleteMethod();
});