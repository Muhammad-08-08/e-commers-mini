import User from "../models/User.js";

/**
 * @desc   User'ni admin qilish
 * @route  PUT /api/users/:id/make-admin
 * @access Admin
 */
export const makeAdmin = async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) return res.status(404).json({ message: "User topilmadi" });

  user.role = "admin";
  await user.save();

  res.json({
    message: "User admin qilindi",
    user: {
      id: user._id,
      email: user.email,
      role: user.role,
    },
  });
};
