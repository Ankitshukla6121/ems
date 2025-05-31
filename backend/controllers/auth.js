 import jwt from 'jsonwebtoken';

const createAdminToken = (email) => {
  return jwt.sign({ role: 'admin', email }, process.env.JWT_SECRET, { expiresIn: "1d" });
};


export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    
    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      const token = createAdminToken(email);
      return res.json({ success: true, token });
    } else {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};


