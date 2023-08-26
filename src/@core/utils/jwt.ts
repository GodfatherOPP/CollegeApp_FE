import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.NEXT_PUBLIC_SECRET_TOKEN_LOGIN || ''

export const jwtSignEnmail = async (email: string) => {
  const token = await jwt?.sign({ email }, JWT_SECRET, { expiresIn: 8640000 })

  return token
}
