// src/routes/categories.js
const express = require("express");
const router = express.Router();
const { body, param } = require("express-validator");
const categoriesController = require("../controllers/categoriesController");
const { authenticate, authorize } = require("../middleware/auth");

// Validaciones
const validateCategory = [
  body("nombre")
    .trim()
    .notEmpty()
    .withMessage("El nombre es requerido")
    .isLength({ min: 2 })
    .withMessage("El nombre debe tener al menos 2 caracteres"),
];

// Rutas públicas
router.get("/", categoriesController.getCategories);
router.get("/:id", categoriesController.getCategoryById);

// Rutas protegidas (Admin/Auth)
router.post(
  "/",
  authenticate,
  authorize("admin"),
  validateCategory,
  categoriesController.createCategory
);

router.put(
  "/:id",
  authenticate,
  authorize("admin"),
  categoriesController.updateCategory
);

router.delete(
  "/:id",
  authenticate,
  authorize("admin"),
  categoriesController.deleteCategory
);

module.exports = router;
