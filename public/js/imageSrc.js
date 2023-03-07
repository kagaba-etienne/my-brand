window.addEventListener('DOMContentLoaded', () => {
    const covers = document.querySelectorAll('.cover');

    covers.forEach(async (cover) => {
        const res = await fetch(cover.dataset.photourl);
        if (res.status == 200)  {
            cover.style.backgroundImage = `url(${cover.dataset.photourl})`;
        } else {}
    });
});
