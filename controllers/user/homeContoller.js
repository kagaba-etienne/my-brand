const get_page = (req, res) => {
    res.render('client/index', {
        title: 'Home',
        styles: 'css/home.css'});
};

module.exports = {
    get_page
}