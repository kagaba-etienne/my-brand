const User = require('../../models/user');
const jwt = require('jsonwebtoken');

//handle errors
const handleErrors = (err) => {
    
    let errors = {
        email: '',
        password: '',
        name: ''
    }
    //incorect email
    if (err.message === 'incorrect email') {
        errors.email = 'That email is not registered';
    }
    
    //incorect password
    if (err.message === 'incorect password') {
        errors.password = 'That password is not incorrect';
    }


    //duplicates error code
    if (err.code == 11000) {
        errors.email = 'That email is already registered';
        return errors;
    }

    //validating errors
    if (err.message.includes('User validation failed')){
        Object.values(err.errors).forEach(({ properties }) => {
            errors[properties.path] = properties.message
        });
    }
    return errors;
}

//set expiration time
const duration = (n) => {
    const now = new Date();
    return (new Date(now.getTime() + n)).toUTCString();
}

const maxAge = 2 * 24 * 60 * 60;

const createToken = (id) => {
    return jwt.sign({ id }, process.env.SECRET, {
        expiresIn: maxAge
    });
}

const get_signup = (req, res) => {
    res.render('admin/acc/signup', {
        title: 'Signup',
        styles: 'css/signup.css'
    })
}
const post_signup = (req, res) => {
    const user = new User(req.body);
    user.save()
    .then(result => {
        const token = createToken(user._id);
        res.setHeader('jwt', token);
        res.setHeader('Expires', duration(maxAge * 1000));
        res.status(200).send({ user: result._id, token: token });
    })
    .catch(err => {
        console.log(err);
        const errors = handleErrors(err);
        res.status(400).send({errors});
    })
}
const get_login = (req, res) => {
    res.render('admin/acc/login', {
        title: 'Login',
        styles: 'css/signup.css'
    })
}
const post_login = (req, res) => {
    const { email, password } = req.body;
    User.login(email, password)
    .then(user => {
        const token = createToken(user._id)
        res.setHeader('jwt', token);
        res.setHeader('Expires', duration(maxAge * 1000));
        res.status(200).send({ user: user._id, token: token })
    })
    .catch (err => {
        const errors = handleErrors(err);
        res.status(400).send({errors});
    })
}
const get_logout = (req, res) => {
    res.removeHeader('jwt');
    res.status(200).send( { message: 'Successfully Logged out' } );
}

module.exports = {
    get_signup,
    post_signup,
    get_login,
    post_login,
    get_logout
}