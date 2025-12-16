// controllers/dashboardController.js
const { posts } = require("./postsController");
const { comments } = require("./commentsController");
const { categories } = require("./categoriesController");
const { users } = require("../middleware/auth");

async function getStats(req, res) {
    try {
        // Estadísticas Generales
        const totalPosts = posts.length;
        const totalComments = comments.length;
        const totalUsers = users.length;
        const totalCategories = categories.length;

        // Desglose de Comentarios
        const comentariosAprobados = comments.filter(c => c.estado === 'aprobado').length;
        const comentariosPendientes = comments.filter(c => c.estado === 'pendiente').length;
        const comentariosRechazados = comments.filter(c => c.estado === 'rechazado').length;

        // Posts Recientes (últimos 5)
        const recentPosts = [...posts]
            .sort((a, b) => new Date(b.fechaCreacion) - new Date(a.fechaCreacion))
            .slice(0, 5)
            .map(p => ({
                id: p.id,
                titulo: p.titulo,
                autor: p.autor,
                fechaCreacion: p.fechaCreacion,
                visitas: p.visitas,
                comentarios: comments.filter(c => c.postId === p.id).length
            }));

        // Categorías con conteo de posts
        const categoriesStats = categories.map(cat => ({
            id: cat.id,
            nombre: cat.nombre,
            postsCount: posts.filter(p => p.categoriaId === cat.id).length
        }));

        res.json({
            stats: {
                totalPosts,
                totalComments,
                totalUsers,
                totalCategories
            },
            commentsBreakdown: {
                approved: comentariosAprobados,
                pending: comentariosPendientes,
                rejected: comentariosRechazados
            },
            recentPosts,
            categoriesStats
        });

    } catch (error) {
        console.error("Error obteniendo estadísticas del dashboard:", error);
        res.status(500).json({
            error: "Error interno del servidor",
        });
    }
}

module.exports = {
    getStats,
};
