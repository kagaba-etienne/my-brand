const Query =  require('../../models/query');
const Mail = require('../../models/smtpserver');
const Log = require('../../models/log');

// query_get, query_get_all, query_delete, query_patch

const query_patch = (req, res) => {
    const id = req.params.id;
    const trash = req.body.response ? Mail(req.body.response): {};
    const update = req.body.res;
    const status = update.status;
    Query.findByIdAndUpdate(id, update, { new: true })
    .then(result => {
        if(result) {
            const logBody = {
                action: `You ${status == "responded" ? "responded" : "ignored"} message from`,
                subject: `${result.name} <${result.email}>`
            }
            const log = new Log(logBody);
            log.save()
                .then(result1 => {
                    res.status(200).send({ id: result._id});
                })
                .catch(err1 => {
                    res.status(500).send({ message: "Encountered server error" } );
                });
        }
        else {
            res.status(400).send({ Error: 'A query with that id was not found' });
        }
    })
    .catch(err => {
        console.log(err);
    })
};

const query_get = (req, res) => {
    const id = req.params.id;
    Query.findById(id)
        .then(result => {
            if(result) {
                res.status(200).send(result);
            }
            else {
                res.status(400).send({ Error: 'A query with that id was not found' });
            }
        })
        .catch(err =>  {
            console.log(err);
        });
};

const query_delete = (req, res) => {
    const id = req.params.id;
    Query.findByIdAndDelete(id)
    .then(result => {
        if(result) {
           const logBody = {
                action: 'You deleted message from',
                subject: `${result.name} <${result.email}>`
            }
            const log = new Log(logBody);
            log.save()
                .then(result1 => {
                    res.status(200).send({ id: result._id});
                })
                .catch(err1 => {
                    res.status(500).send({ message: "Encountered server error" } );
                });
        }
        else {
            res.status(400).send({ Error: 'A query with that id was not found' });
        }
    })
    .catch(err => {
        console.log(err);
    })
};

const query_get_all = (req, res) => {
    Query.find().sort({ createdAt: -1})
        .then(result => {
            res.status(200).send(result)
        })
        .catch(err => {
            console.log(err);
        });
};

module.exports = {
    query_get, query_get_all, query_delete, query_patch
}