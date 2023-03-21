const Project = require('../models/project');
const Log = require('../models/log');

//handle errors
const handleErrors = (err) => {
    
    let errors = {
        coverPhoto: '',
        title: '',
        body: ''
    }

    //duplicates error code
    if (err.code == 11000) {
        errors.title = 'That title is already registered';
        return errors;
    }

    //validating errors
    if (err.message.includes('Project validation failed')){
        Object.values(err.errors).forEach(({ properties }) => {
            errors[properties.path] = properties.message
        });
    }
    return errors;
};

//Getting short descriptions
const getShort = function (body) {
    if (body.length > 203) {
        return `${body.slice(0, 202)} ...`;
    }
    else {
        return body;
    }
}

// project_delete, project_update, project_get_one, project_index, project_create

const project_index = (req, res) => {
    const term = req.query.term? req.query.term : '.*';
    Project.find({
        title: { $regex: term, $options:'i'}
    }).sort({ createdAt: -1})
        .then(result => {
            res.render('admin/projects', { title: 'Projects', projects: result, styles: '/css/admin.css'}); 
        })
        .catch(err => {
            console.log(err);
        });
};

const project_create = (req, res) => {
    req.body.shortDescr = getShort(req.body.body);
    req.body.rest = req.body.body.replace(req.body.shortDescr, '');
    req.body.publish = false;
    const project = new Project(req.body);
    project.save()
        .then(result => {
            const logBody = {
                    action: "You created this project title",
                    subject: result.title
                }
            const log = new Log(logBody);
            log.save()
                .then(result1 => {
                    res.status(200).send({ id: result._id});
                })
                .catch(err1 => {
                    res.status(500).send({ message: "Encountered server error" } );
                });
        })
        .catch(err => {
            const errors = handleErrors(err);
            res.status(400).send({ errors });
        });
};

const project_delete = (req, res) => {
    const id = req.params.id;
    Project.findByIdAndDelete(id)
        .then(result => {
            const logBody = {
                action: "You deleted this project title",
                subject: result.title
            }
            const log = new Log(logBody);
            log.save()
                .then(result3 => {
                    res.status(200).send({ id: result._id });
                })
                .catch(err3 => {
                    res.status(500).send({ message: "Encountered server error" } );
                });
        })
        .catch(err => {
            console.log(err);
        })
};

const project_update = (req, res) => {
    const id = req.params.id;
    req.body.body ? req.body.shortDescr = getShort(req.body.body) : {};
    req.body.body ? req.body.rest = req.body.body.replace(req.body.shortDescr, '') : {};
    const update = req.body;
    const ifpublish = update.publish? update.publish: 'not';
    Project.findById(id)
        .then(project => {
            for (var key in update) {
                project[key] = update[key];
            }
            project.save()
                .then(result => {
                    const logBody = {
                        action: `You ${ifpublish !== "not"? (ifpublish? "published" : "unpublished") : "updated"} this project title`,
                        subject: result.title
                    }
                    const log = new Log(logBody);
                    log.save()
                        .then(result1 => {
                            res.status(200).send({ id: result._id});
                        })
                        .catch(err1 => {
                            res.status(500).send({ message: "Encountered server error" } );
                        });
                })
                .catch(err => {
                    const errors = handleErrors(err);
                    res.status(400).send({ errors });
                });
        })
        .catch(err => {
            const errors = handleErrors(err);
            res.status(400).send({ errors });
        })
};

const project_get_one = (req, res) => {
    const id = req.params.id;
    Project.findById(id)
        .then(result => {
            res.send(result);
        })
        .catch(err =>  {
            console.log(err);
        })
};


module.exports = {
    project_delete,
    project_update,
    project_get_one,
    project_index,
    project_create
}