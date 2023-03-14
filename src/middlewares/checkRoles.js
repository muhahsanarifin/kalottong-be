const checkRoles = (...allowedRoles) => {
  return (req, res, next) => {
    const payload = req.userPayload;
    let isAllowed = false;
    for (let role of allowedRoles) {
      if (role !== payload.role) continue;
      isAllowed = true;
      break;
    }
    if (!isAllowed)
      return res.status(403).json({
        data: null,
        msg: "Forbidden",
      });
    next();
  };
};

module.exports = { checkRoles };
