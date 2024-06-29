exports.getPairs = async (req, res) => {
  res.status(200).json({
    success: true,
    data: [
      {
        name: "XLM-EURC",
        tokenA: "XLM",
        tokenB: "EURC",
      },
      {
        name: "EURC-USDC",
        tokenA: "EURC",
        tokenB: "USDC",
      },
      {
        name: "USDC-XLM",
        tokenA: "USDC",
        tokenB: "XLM",
      },
    ],
  });
};
