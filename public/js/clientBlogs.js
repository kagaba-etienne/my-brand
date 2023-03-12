window.addEventListener('DOMContentLoaded', async () => {

    const contRdBtns = document.querySelectorAll('button.continueReading');

    contRdBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            location.assign(`./blogs/${btn.id}`);
        })
    })
});