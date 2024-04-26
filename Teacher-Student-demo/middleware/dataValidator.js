
export const validateData = (validator) => (req, res, next) => {
    const data = {...req.body , ...req.params , ...req.query}
    const validationResult = validator.validate(data)
    if (validationResult.error) {
        return res.status(200).json({ message: validationResult.error.details[0].message })
    }
    next()
}

