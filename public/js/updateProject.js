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
            let res = await fetch(`http://localhost:3004/admin/projects/${btn.dataset.id}`);
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
        const shortDescription = getShort(editForm.body.value);
        let doc = {
            title: editForm.title.value,
            body: editForm.body.value,
            shortDescr: shortDescription,
            rest: editForm.body.value.replace(shortDescription, ''),
            coverPhoto: editForm.coverPhoto.value,
        }

        await fetch(`http://localhost:3004/admin/projects/${updateBtn.dataset.id}`, {
            method: 'PATCH',
            body: JSON.stringify(doc),
            headers: { 'Content-Type': 'application/json' }
        });
        window.location.replace('/admin/projects');
    })
    deleteBtn.addEventListener('click', async() => {
        await fetch(`http://localhost:3004/admin/blogs/${deleteBtn.dataset.id}`, {
            method: 'DELETE'
        });
        window.location.replace('/admin/blogs');
    })
}

//delete blog
function deleteMethod() {
    const deleteBtn = document.querySelectorAll('.blogActions .delete');

    deleteBtn.forEach(btn =>{
        btn.addEventListener('click', async (e) => {
            e.preventDefault();
            await fetch(`http://localhost:3004/admin/projects/${btn.dataset.id}`, {
                method: 'DELETE'
            });
            window.location.replace('/admin/projects');
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
                await fetch(`http://localhost:3004/admin/projects/${btn.dataset.id}`, {
                    method: 'PATCH',
                    body: JSON.stringify(res),
                    headers: { 'Content-Type': 'application/json' }
                });
                window.location.replace('/admin/projects');
            })
        }
        else {
            btn.addEventListener('click', async (e) => {
                e.preventDefault();
                const res = {
                    publish: false
                }
                await fetch(`http://localhost:3004/admin/projects/${btn.dataset.id}`, {
                    method: 'PATCH',
                    body: JSON.stringify(res),
                    headers: { 'Content-Type': 'application/json' }
                });
                window.location.replace('/admin/projects');
            })
        }
    })
}

window.addEventListener('DOMContentLoaded', () => {
    updateMethod();
    publishMethod();
    deleteMethod();
});