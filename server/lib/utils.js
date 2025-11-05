import jwt from 'jsonwebtoken'

// Generate token

export const generateToken = (userId) => {
    const token = jwt.sign(
        {userId}, process.env.SECRET
    )

    return token
}