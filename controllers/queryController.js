const Query =  require('../models/query');
const Mail = require('../models/smtpserver');

//handle errors
const handleErrors = (err) => {
    
    let errors = {
        coverPhoto: '',
        title: '',
    }

    //duplicates error code
    if (err.code == 11000) {
        errors.title = 'That title is already registered';
        return errors;
    }

    //validating errors
    if (err.message.includes('Blog validation failed')){
        Object.values(err.errors).forEach(({ properties }) => {
            errors[properties.path] = properties.message
        });
    }
    return errors;
}

// query_get, query_get_all, query_delete, query_patch

const query_patch = (req, res) => {
    const id = req.params.id;
    const trash = req.body.response ? Mail(req.body.response): console.log('ignoring a query');
    const update = req.body.res;
    Query.findByIdAndUpdate(id, update, { new: true })
    .then(result => {
        res.send();
    })
    .catch(err => {
        console.log(err);
    })
};

const query_get = (req, res) => {
    const id = req.params.id;
    Query.findById(id)
        .then(result => {
            res.send(result);
        })
        .catch(err =>  {
            console.log(err);
        });
};

const query_delete = (req, res) => {
    const id = req.params.id;
    Query.findByIdAndDelete(id)
    .then(result => {
        res.send();
    })
    .catch(err => {
        console.log(err);
    })
};

const query_get_all = (req, res) => {
    Query.find().sort({ createdAt: -1})
        .then(result => {
            res.render('admin/queries', { title: 'Queries', queries: result, styles: '/css/admin.css'}); 
        })
        .catch(err => {
            console.log(err);
        });
};

module.exports = {
    query_get, query_get_all, query_delete, query_patch
}