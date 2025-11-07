import jwt from 'jsonwebtoken'
import crypto from 'crypto'

// Generate token
export const secret = '7922e768bf6af180b0b82afff2a1bffb0a0affa10a41794e73760f63eb17237d828011449c3db4f81e473f760fc06afa313648444ded52115de07204936a6acbbbc0ab5f75611cbce1436126b9075ec6e3351b9f5b651b6d97b7012a84de16c1c0bec4ad472149b8981df47473863172c76dc59c9a2f71ef9a0c8add6d3086f6723358ba587c6661a170e1e44eadcbea948830f5df8e3c11519c6a12f31d3fd01909ca7269272b63eeb276c1065013523688ebb58ac6f746fb8eb285f371f9f9a166d3c7fa6b5653ebe8f1f8f6e858a953b2711bc2b4238bdbf19490f663e626402c1c707dad77d67ea68165b1498063b2938d390b66037c21cc0407caa582f6'

export const generateToken = (userId) => {
    const token = jwt.sign(
        {userId}, secret
    )

    return token
}