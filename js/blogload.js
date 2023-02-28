const id = new URLSearchParams(window.location.search).get('id');

const blogContainer = document.querySelector('.container.blogpost');

function manyparagraphs(body) {
    if (body.length > 1) {
        return `<div class="cover">
        <img src="./assets/shoe1.jpg" alt="Cover photo">
       </div>
       <p class="pr2">
       ${body[1]}
       </p>`;
    }
    else {
        return "";
    }
}

function dateConverter(numbers) {
    numbers = numbers.split("-")
    mapToMonths = {
        "01": 'JANUARY',
        "02": 'FEBRUARY',
        "03": 'MARCH',
        "04": 'APRIL',
        "05": 'MAY',
        "06": 'JUNE',
        "07": 'JULY',
        "08": 'AUGUST',
        "09": 'SEPTEMBER',
        "10": 'OCTOBER',
        "11": 'NOVEMBER',
        "12": 'DECEMBER',
    }

    return `${mapToMonths[numbers[1]]} ${numbers[2]}, ${numbers[0]}`
}

const renderBlogMethod = async () => {
    let res = await fetch(`http://localhost:3000/Blogs/${id}`);
    res = await res.json();

    let blog = `<div class="upper">
    <div class="content">
        <div class="heading">
             <div class="title">
                 <h1>${res.title}</h1>
             </div>
             <div class="cover" data-src="${res.coverPhoto}">
                 <img src="./assets/shoe1.jpg" alt="Cover photo">
             </div>
             <p class="date">UPDATED ON ${res.date} • BY ${res.author} • ${res.comments} COMMENTS</p>
        </div> 
        <p class="pr1">
        ${res.body[0]}
        </p>
        ${manyparagraphs(res.body)}
    </div>
</div>
<div class="lower">
    <div class="banner"></div>
    <div class="comment-container">
        <p class="jump">Jump Into The Conversation</p>
        <div class="form comment-form">
            <p>Leave a Reply:</p>
            <form data-blog-name="${res.title}">
                <input id="id" name="id" value="${id}">
                <input type="text" name="name" placeholder="Name" required><br>
                <input type="email" name="email" placeholder="Email" required><br>
                <input type="text" name="website" placeholder="website"><br>
                <textarea name="comment" cols="30" rows="10" placeholder="Message" required></textarea><br>
                <label for="agreement"><input type="checkbox" name="agreement">Save my name, email, and website in this browser for the next time I comment.</label><br>
                <button>Post Comment</button>
            </form>
        </div>
    </div>
    <div class="replies">
    </div>
</div>
<div class="graphic">
    <img src="./assets/Graphic (1).svg" alt="stripes graphic">
</div>`;

    blogContainer.innerHTML = blog;
}

const commentLoadMethod = async () => {
    const commentContainer = document.querySelector('.container.blogpost .replies');
    const commentform = document.querySelector('.comment-form form');
    let res = await fetch(`http://localhost:3000/Comments?blog=${id}`);
    res = await res.json();

    console.log(res)

    let comments = '';

    if (res.length > 0){
        comments = `<h1>${res.length} replies to “${commentform.getAttribute('data-blog-name')}”</h1>`;
        res.forEach(comment => {
            comments += `<div class="comment">
            <div class="actual card">
                <div class="photo" data-src="${comment.photo}"></div>
                <div class="content-comment">
                    <h3 class="name">${comment.name}</h3>
                    <h6 class="date">${comment.date}</h6>
                    <p>${comment.comment}</p>
                </div>
            </div>
            <hr>
        </div>`
        });
    }

    commentContainer.innerHTML = comments;
}
window.addEventListener('DOMContentLoaded', async () => {
    await renderBlogMethod();
    await commentLoadMethod();

    const commentForm = document.querySelector('.comment-form form');
    const commentingMethod = async () => {
        let comment = {
            blog: id,
            name: commentForm.name.value,
            email: commentForm.email.value,
            website: commentForm.website.value,
            comment: commentForm.comment.value,
            date: dateConverter(new Date().toJSON().slice(0, 10)),
            saveCookie: commentForm.agreement.checked,
            photo: 'URL',
            replyTo: "blog"
        }

        await fetch('http://localhost:3000/Comments', {
            method: 'POST',
            body: JSON.stringify(comment),
            headers: {"content-type": "application/json"}
        })

        let commentsCount = {
            comments: (await (await fetch(`http://localhost:3000/Comments?blog=${id}`)).json()).length
        }

        await fetch(`http://localhost:3000/Blogs/${id}`, {
            method: 'PATCH',
            body: JSON.stringify(commentsCount),
            headers: {"content-type": "application/json"}
        })
        window.location.replace(`./index.html`);
    }
    commentForm.addEventListener('submit', commentingMethod);

});