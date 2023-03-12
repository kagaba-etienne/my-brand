const Project = require('../models/project');

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
}

// project_delete, project_update, project_get_one, project_index, project_create

const project_index = (req, res) => {
    Project.find().sort({ createdAt: -1})
        .then(result => {
            res.render('admin/projects', { title: 'Projects', projects: result, styles: '/css/admin.css'}); 
        })
        .catch(err => {
            console.log(err);
        });
};

const project_create = (req, res) => {
    const project = new Project(req.body);
    project.save()
    .then(result => {
        res.send({ id: result._id});
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
        res.send();
    })
    .catch(err => {
        console.log(err);
    })
};

const project_update = (req, res) => {
    const id = req.params.id;
    const update = req.body;
    Project.findById(id)
    .then(project => {
        for (var key in update) {
            project[key] = update[key];
        }
        project.save()
        .then(result => {
            res.send({ id: result._id});
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