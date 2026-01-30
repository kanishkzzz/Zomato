const userModel = require('../models/user.model');
const foodPartnerModel = require('../models/foodpartner.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

async function registerUser(req, res) {
    
    const { fullName, email, password, phone } = req.body;

    const isUserAlreadyExists = await userModel.findOne({
        email
    })

    if(isUserAlreadyExists) {
        return res.status(400).json({
            message : 'User already exists'
        })
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await userModel.create({
        fullName,
        email,
        password : hashedPassword,
        phone
    })

    const token = jwt.sign({
        id : user._id
    }, process.env.JWT_SECRET)

    res.cookie('token', token)

    res.status(201).json({
        message : 'User registered successfully',
        user : {
            _id : user._id,
            email : user.email,
            fullName : user.fullName,
            phone : user.phone
        }
    })
}

async function loginUser(req, res) {

    const { email, password } = req.body;

    const user = await userModel.findOne({
        email
    })
    if (!user) {
        return res.status(400).json({
            message: 'Invalid email or password'
        })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if(!isPasswordValid) {
        return res.status(400).json({
            message : 'Invalid email or password'
        })
    }

    const token = jwt.sign({
        id : user._id,
    }, process.env.JWT_SECRET)

    res.cookie('token', token)

    res.status(200).json({
        message : 'Login successful',
        user: {
            _id : user._id,
            email : user.email,
            fullName : user.fullName,
            
        }
    })
}

function logoutUser(req, res) {
    res.clearCookie('token');
    res.status(200).json({
        message: 'Logout successful'
    })
}

async function registerFoodPartner(req, res){
    try {
        const {name, email, password, phone, businessName, address, restaurantType} = req.body;

        const isAccountalreadyExists = await foodPartnerModel.findOne({
            email
        })

        if(isAccountalreadyExists){
            return res.status(400).json({
                message: 'Account already exists'
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const foodPartner = await foodPartnerModel.create({
            name,
            email,
            password : hashedPassword,
            phone,
            businessName,
            address,
            restaurantType
        })

        const token = jwt.sign({
            id : foodPartner._id
        }, process.env.JWT_SECRET)

        res.cookie('token', token)

        res.status(201).json({
            message : 'Food Partner registered successfully',
            foodPartner : {
                _id: foodPartner._id,
                email: foodPartner.email,
                name: foodPartner.name,
                address: foodPartner.address,
                contact: foodPartner.phone,
                businessName: foodPartner.businessName,
                restaurantType: foodPartner.restaurantType
            }
        })
    } catch (error) {
        console.error('Food Partner Registration error:', error);
        res.status(500).json({
            message: error.message || 'Registration failed'
        })
    }
}

async function loginFoodPartner(req, res){
    const { email, password } = req.body;
    const foodPartner = await foodPartnerModel.findOne({
        email
    })

    if(!foodPartner){
        return res.status(400).json({
            message: 'Invalid email or password'
        })
    }
    const isPasswordValid = await bcrypt.compare(password, foodPartner.password);
    if(!isPasswordValid){
        return res.status(400).json({
            message: 'Invalid email or password'
        })
    }
    const token = jwt.sign({
        id: foodPartner._id
    }, process.env.JWT_SECRET)  
    res.cookie('token', token)

    res.status(200).json({
        message: 'Login successful',
        foodPartner: {
            _id: foodPartner._id,
            email: foodPartner.email,
            name: foodPartner.name
        }
    })

}

function logoutFoodPartner(req, res) {
    res.clearCookie('token');
    res.status(200).json({
        message: 'Logout successful'
    })
}

module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    registerFoodPartner,
    loginFoodPartner,
    logoutFoodPartner
}