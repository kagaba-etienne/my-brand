window.addEventListener('DOMContentLoaded', () => {
    const covers = document.querySelectorAll('.cover');

    covers.forEach(async (cover) => {
        cover.style.backgroundImage = `url(${cover.dataset.photourl})`;
    })
});
