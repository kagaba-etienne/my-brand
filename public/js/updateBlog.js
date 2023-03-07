//update blog
function updateMethod(){
    const editBtn = document.querySelectorAll('.blogActions .edit');
    const deleteBtn = document.querySelector('.editing.form .submit > .delete');
    const updateBtn = document.querySelector('.editing.form .submit > .update');
    const editForm = document.querySelector('.editing.form > form');

    editBtn.forEach(btn => {
        btn.addEventListener('click', async () => {
            tabs[1].classList.remove('active');
            tabs[2].classList.add('active');
            let res = await fetch(`https://kagaba-etienne.cyclic.app/admin/blogs/${btn.dataset.id}`);
            res = await res.json();
            let resbody = '';
            for(var j=0; j<res.body.length; j++) {
                resbody += res.body[j];
                if (j+1 == res.body.length) {
                    break;
                }
                resbody += '\n[COVER]\n';
            }
            editForm.title.value = res.title;
            editForm.coverPhoto.value = res.coverPhoto;
            editForm.body.value = resbody;
            updateBtn.dataset.id = btn.dataset.id;
            deleteBtn.dataset.id = btn.dataset.id;
        })
    })
    editForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        let doc = {
            title: editForm.title.value,
            body: editForm.body.value.split('\n[COVER]\n'),
            shortDescr: getShort(editForm.body.value),
            author: "Etienne Kagaba",
            coverPhoto: editForm.coverPhoto.value,
        }

        await fetch(`https://kagaba-etienne.cyclic.app/admin/blogs/${updateBtn.dataset.id}`, {
            method: 'PATCH',
            body: JSON.stringify(doc),
            headers: { 'Content-Type': 'application/json' }
        });
        window.location.replace('/admin/blogs');
    })
    deleteBtn.addEventListener('click', async() => {
        await fetch(`https://kagaba-etienne.cyclic.app/admin/blogs/${deleteBtn.dataset.id}`, {
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
            await fetch(`https://kagaba-etienne.cyclic.app/admin/blogs/${btn.dataset.id}`, {
                method: 'DELETE'
            });
            window.location.replace('/admin/blogs');
        })
    })
}

//publish blog
function publishMethod() {
    const publishBtn = document.querySelectorAll('.blogActions .publish');

    publishBtn.forEach(btn => {
        if (btn.classList.contains('false')) {
            btn.addEventListener('click', async (e) => {
                e.preventDefault();
                const res = {
                    publish: true
                }
                await fetch(`https://kagaba-etienne.cyclic.app/admin/blogs/${btn.dataset.id}`, {
                    method: 'PATCH',
                    body: JSON.stringify(res),
                    headers: { 'Content-Type': 'application/json' }
                });
                window.location.replace('/admin/blogs');
            })
        }
        else {
            btn.addEventListener('click', async (e) => {
                e.preventDefault();
                const res = {
                    publish: false
                }
                await fetch(`https://kagaba-etienne.cyclic.app/admin/blogs/${btn.dataset.id}`, {
                    method: 'PATCH',
                    body: JSON.stringify(res),
                    headers: { 'Content-Type': 'application/json' }
                });
                window.location.replace('/admin/blogs');
            })
        }
    })
}

window.addEventListener('DOMContentLoaded', () => {
    updateMethod();
    publishMethod();
    deleteMethod();
});