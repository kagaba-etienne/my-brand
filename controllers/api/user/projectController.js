const Project = require('../../../models/project');

const get_all = (req, res) => {
    Project.find({
        publish: true
    }).sort({ createdAt: -1 })
    .then(result => {
        res.status(200).send(result);
    })
    .catch(err => {
        console.log(err);
    })
};

module.exports = {
    get_all
}