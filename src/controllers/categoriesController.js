// controllers/categoriesController.js
const { v4: uuidv4 } = require("uuid");

// Base de datos simulada para categorías
const categories = [
  {
    id: uuidv4(),
    nombre: "Tecnología",
    descripcion: "Noticias y tutoriales sobre desarrollo y tech",
    fechaCreacion: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    nombre: "Lifestyle",
    descripcion: "Estilo de vida, viajes y salud",
    fechaCreacion: new Date().toISOString(),
  },
];

// Obtener todas las categorías
async function getCategories(req, res) {
  try {
    res.json(categories);
  } catch (error) {
    console.error("Error obteniendo categorías:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
}

// Obtener categoría por ID
async function getCategoryById(req, res) {
  try {
    const { id } = req.params;
    const category = categories.find((c) => c.id === id);

    if (!category) {
      return res.status(404).json({ error: "Categoría no encontrada" });
    }

    res.json(category);
  } catch (error) {
    console.error("Error obteniendo categoría:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
}

// Crear nueva categoría
async function createCategory(req, res) {
  try {
    const { nombre, descripcion } = req.body;

    // Validación básica
    if (!nombre) {
      return res.status(400).json({ error: "El nombre es requerido" });
    }

    // Verificar duplicados
    const existe = categories.some(
      (c) => c.nombre.toLowerCase() === nombre.trim().toLowerCase()
    );

    if (existe) {
      return res.status(400).json({ error: "La categoría ya existe" });
    }

    const nuevaCategoria = {
      id: uuidv4(),
      nombre: nombre.trim(),
      descripcion: descripcion ? descripcion.trim() : "",
      fechaCreacion: new Date().toISOString(),
    };

    categories.push(nuevaCategoria);

    res.status(201).json({
      message: "Categoría creada exitosamente",
      category: nuevaCategoria,
    });
  } catch (error) {
    console.error("Error creando categoría:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
}

// Actualizar categoría
async function updateCategory(req, res) {
  try {
    const { id } = req.params;
    const category = categories.find((c) => c.id === id);

    if (!category) {
      return res.status(404).json({ error: "Categoría no encontrada" });
    }

    const { nombre, descripcion } = req.body;

    if (nombre) {
      // Verificar duplicados si el nombre cambia
      const existe = categories.some(
        (c) =>
          c.nombre.toLowerCase() === nombre.trim().toLowerCase() && c.id !== id
      );

      if (existe) {
        return res
          .status(400)
          .json({ error: "Ya existe una categoría con ese nombre" });
      }
      category.nombre = nombre.trim();
    }

    if (descripcion !== undefined) {
      category.descripcion = descripcion.trim();
    }

    res.json({
      message: "Categoría actualizada exitosamente",
      category,
    });
  } catch (error) {
    console.error("Error actualizando categoría:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
}

// Eliminar categoría
async function deleteCategory(req, res) {
  try {
    const { id } = req.params;
    const index = categories.findIndex((c) => c.id === id);

    if (index === -1) {
      return res.status(404).json({ error: "Categoría no encontrada" });
    }

    // Nota: Aquí se podría validar si hay posts usando esta categoría antes de borrar

    const eliminado = categories.splice(index, 1)[0];

    res.json({
      message: "Categoría eliminada exitosamente",
      category: eliminado,
    });
  } catch (error) {
    console.error("Error eliminando categoría:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
}

module.exports = {
  categories,
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};
