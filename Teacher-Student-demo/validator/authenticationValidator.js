import Joi from 'joi'
 
const emailValidation = Joi.string().email().required().regex(/^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/).messages({
    'string.pattern.base': 'Please enter a valid email address.',
})

const nameValidation = Joi.string().min(2).max(10).required().messages({
    'string.base': `"name" should be a type of 'text'`,
    'string.empty': `"name" cannot be an empty field`,
    'string.min': `"name" should have a minimum length of {#limit}`,
    'any.required': `"name" is a required field`
})

const passwordValidation = Joi.string().required().regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/).messages({
    "string.pattern.base": "Password must be strong. At least one upper case alphabet. At least one lower case alphabet. At least one digit. At least one special character. Minimum eight in length"
})

const confirmPasswordValidation = Joi.any().valid(Joi.ref('password')).required().label('Confirm password').options({ messages: { 'any.only': '{{#label}} does not match' } })

const contactValidation = Joi.string().length(10).pattern(/^[0-9]+$/).required().messages({
    'string.contact': 'Please enter a valid contact Number.',
})

const otpValidation = Joi.number().integer().min(100000).max(999999).required().messages({
    'number.min': 'OTP should be 6 digit.',
    'number.max': 'OTP should be 6 digit'
})

export const SignUpValidator = Joi.object({
    name: nameValidation,
    email: emailValidation,
    password: passwordValidation,
    contact: contactValidation
});

export const studentSignUpValidator = Joi.object({
    name: nameValidation,
    email: emailValidation,
    password: passwordValidation,
    contact: contactValidation,
    selectedTeacher : Joi.array().items(Joi.string().hex().length(24))
});

export const verifyOtpValidator = Joi.object({
    email: emailValidation,
    otp: otpValidation
});

export const emailValidator = Joi.object({
    email: emailValidation
});

export const SignInValidator = Joi.object({
    email: emailValidation,
    password: passwordValidation
});

export const forgotPasswordValidator = Joi.object({
    password: passwordValidation,
    confirmPassword: confirmPasswordValidation
});

export const resetPasswordValidator = Joi.object({
    oldPassword : passwordValidation,
    password: passwordValidation,
    confirmPassword: confirmPasswordValidation
});