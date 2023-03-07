window.addEventListener('DOMContentLoaded', async () => {

    const contRdBtns = document.querySelectorAll('button.continueReading');

    contRdBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            window.location.replace(`./blogs/${btn.id}`);
        })
    })
});