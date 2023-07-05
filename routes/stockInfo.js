const express = require("express");
const router = express.Router();

const upload = require("../services/upload");

const {
  getAllStockInfos,
  createStockInfo,
  getStockInfoById,
  updateStockInfo,
  deleteStockInfo,
  searchStockInfo,
  createVariant,
  deleteVariant,
  updateVariant,
} = require("../controllers/stockInfo");

const requireAuth = require("../middlewares/requireAuth");
// router.use(requireAuth);

router.get("/", getAllStockInfos);
router.post("/", upload.single("picture"), createStockInfo);

router.post("/variant", upload.array("picture"), createVariant);
router.delete("/variant/:id/:variantId", deleteVariant);
router.put("/variant/:id/:variantId", updateVariant);

router.route("/product/:id").get(getStockInfoById);

router.route("/:id").put(updateStockInfo).delete(deleteStockInfo);

router.route("/search").get(searchStockInfo);

module.exports = router;
