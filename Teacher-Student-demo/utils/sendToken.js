import jwt from 'jsonwebtoken'

export const sendToken = (id, role) => {
  try {
    if(!id && !role){
      return "id or role not found"
    }
    const token = jwt.sign({
      id: id,
      role: role
    }, process.env.SECRET_KEY, { expiresIn: '5h' });
    
    return token
  } catch (error) {
    console.log('error :>> ', error);
    return error
  }
}