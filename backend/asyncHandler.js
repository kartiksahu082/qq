const asyncHandler = (fn) => (req, res, next) =>
  fn(req, res, next).catch((err) =>
    res.status(err.code || 500).json({ success: false })
  );

export default asyncHandler;
