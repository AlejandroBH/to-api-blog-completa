document.addEventListener('DOMContentLoaded', () => {
    fetchStats();

    document.getElementById('refreshBtn').addEventListener('click', () => {
        const btn = document.getElementById('refreshBtn');
        btn.textContent = 'Actualizando...';
        btn.disabled = true;
        fetchStats().finally(() => {
            btn.textContent = 'Actualizar Datos';
            btn.disabled = false;
        });
    });
});

async function fetchStats() {
    try {
        const response = await fetch('/api/dashboard/stats');
        if (!response.ok) {
            throw new Error('Error al cargar datos');
        }
        const data = await response.json();
        updateDashboard(data);
    } catch (error) {
        console.error('Error:', error);
        alert('No se pudieron cargar las estadísticas. Verifica que el servidor esté corriendo.');
    }
}

function updateDashboard(data) {
    animateValue(document.getElementById('totalPosts'), data.stats.totalPosts);
    animateValue(document.getElementById('totalComments'), data.stats.totalComments);
    animateValue(document.getElementById('totalUsers'), data.stats.totalUsers);
    animateValue(document.getElementById('totalCategories'), data.stats.totalCategories);

    document.getElementById('commentsApproved').textContent = data.commentsBreakdown.approved;
    document.getElementById('commentsPending').textContent = data.commentsBreakdown.pending;
    document.getElementById('commentsRejected').textContent = data.commentsBreakdown.rejected;

    const recentPostsList = document.getElementById('recentPostsList');
    recentPostsList.innerHTML = '';

    if (data.recentPosts.length === 0) {
        recentPostsList.innerHTML = '<tr><td colspan="5">No hay posts recientes</td></tr>';
    } else {
        data.recentPosts.forEach(post => {
            const date = new Date(post.fechaCreacion).toLocaleDateString('es-ES', {
                year: 'numeric', month: 'short', day: 'numeric'
            });
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><strong>${post.titulo}</strong></td>
                <td>${post.autor}</td>
                <td>${post.visitas}</td>
                <td>${post.comentarios}</td>
                <td>${date}</td>
            `;
            recentPostsList.appendChild(tr);
        });
    }

    const categoriesList = document.getElementById('categoriesList');
    categoriesList.innerHTML = '';

    if (data.categoriesStats.length === 0) {
        categoriesList.innerHTML = '<li>Sin categorías</li>';
    } else {
        data.categoriesStats.forEach(cat => {
            const li = document.createElement('li');
            li.innerHTML = `
                <span>${cat.nombre}</span>
                <strong>${cat.postsCount} posts</strong>
            `;
            categoriesList.appendChild(li);
        });
    }
}

function animateValue(obj, end) {
    let startTimestamp = null;
    const duration = 1000;
    const start = 0;

    const current = parseInt(obj.textContent);
    if (!isNaN(current) && current === end) return;

    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        obj.innerHTML = Math.floor(progress * (end - start) + start);
        if (progress < 1) {
            window.requestAnimationFrame(step);
        } else {
            obj.innerHTML = end;
        }
    };
    window.requestAnimationFrame(step);
}
