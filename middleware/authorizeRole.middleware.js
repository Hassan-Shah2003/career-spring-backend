export const authorizedRole = (...role) => {
  console.log(role, "---role");

  return (req, res, next) => {
    try {
      // const userRole = req.user.role
      if (!role.includes(req.user.role)) {
        return res.status(403).json({
          message: "not allowed",
          success: false,
        });
      }
      next();
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };
};
