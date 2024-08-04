async function logout(req, res) {
  try {
    const cookieOptions = {
      http: true,
      secure: true,
    };

    return res.cookie("token", "", cookieOptions).status(200).json({
      message: "Session timed out",
      success: true,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message || err, error: true });
  }
}

module.exports = logout;
