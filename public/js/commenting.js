window.addEventListener('DOMContentLoaded', async () => {
    const commentbtn = document.querySelector('button.commentingbtn');
    const commentForm = document.querySelector('.comment-form form');
    const commentingMethod = async () => {
        const id = commentForm.dataset.id;
        let comment = {
            blog: id,
            name: commentForm.name.value,
            email: commentForm.email.value,
            website: commentForm.website.value,
            comment: commentForm.comment.value,
            saveCookie: commentForm.agreement.checked,
            photo: 'URL'
        }

        await fetch(`https://kagaba-etienne.cyclic.app/admin/blogs/${id}`, {
            method: 'POST',
            body: JSON.stringify(comment),
            headers: {"content-type": "application/json"}
        });
        window.location.reload();
    };
    commentForm.addEventListener('submit', (e) => {
        e.preventDefault();
        commentingMethod();
    });

});