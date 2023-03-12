const get_page = (req, res) => {
    res.render('client/skills', {
        title: 'Skills',
        styles: 'css/home.css'});
};
module.exports = {
    get_page
}