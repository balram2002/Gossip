import jwt from "jsonwebtoken";

const generateTokenAndSetCookie = (userId, res) => {
	const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
		expiresIn: "15d",
	});

	res.cookie("jwt", token, {
		httpOnly: true,
		secure: true,        // Only send over HTTPS (true for Vercel)
		sameSite: "None",    // Allow cross-site requests
		maxAge: 7 * 24 * 60 * 60 * 1000,
	});

	return token;
};

export default generateTokenAndSetCookie;
