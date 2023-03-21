const photomap = require('../../models/photomap');
const Query = require('../../models/query');
const Log = require('../../models/log');


//handle errors
const handleErrors = (err) => {
    
    let errors = { 
        email: '',
        name: '',
        message: ''
    }

    //query validation errors
    if (err.message.includes('Query validation failed')){
        Object.values(err.errors).forEach(({ properties }) => {
            errors[properties.path] = properties.message
        });
    }

    return errors;
}

//send_query, get_page
const get_page = (req, res) => {
    res.render('client/contact', {
        title: 'Contact',
        styles: 'css/home.css'});
};

const send_query = (req, res) => {
    let body = req.body;
    body.status = 'pending';
    const query = new Query(body);
    query.photo = photomap(query.photo);
    query.save()
    .then(result => {
        const logBody = {
            action: 'New message from',
            subject: `${result.name} <${result.email}>`
        }
        const log = new Log(logBody);
        log.save()
            .then(result1 => {
                res.status(200).send({ success: true });
            })
            .catch(err1 => {
                res.status(500).send({ message: "Encountered server error" } );
            });
    })
    .catch(err => {
        const errors = handleErrors(err);
        res.status(400).send({ errors });
    })
};

module.exports = {
    get_page, send_query
}