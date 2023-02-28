// creating blog

function getShort(body) {
    if (body.length > 203) {
        return body.slice(0, 202);
    }
    else {
        return body;
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

const form = document.querySelector('.createBlog.form > form');
const createPost = async (e) => {
    e.preventDefault();
    const doc = {
        title: form.title.value,
        body: form.body.value.split('[COVER]'),
        shortDescr: getShort(form.body.value),
        author: "Etienne Kagaba",
        date: dateConverter(new Date().toJSON().slice(0, 10)),
        coverPhoto: form.coverPhoto.value,
        comments: 0,
        publish: false
    }
    await fetch('http://localhost:3000/Blogs', {
        method: 'POST',
        body: JSON.stringify(doc),
        headers: { 'Content-Type': 'application/json' }
    });
    window.location.replace('../admin edit blog.html');
}

// createSubmitBtn.addEventListener('click', () => {
//     form.submit();
// })

form.addEventListener('submit', createPost);