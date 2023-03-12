const get_page = (req, res) => {
    res.render('client/about', {
        title: 'About',
        styles: 'css/home.css'});
};

module.exports = {
    get_page
}