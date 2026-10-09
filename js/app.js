window.navigate = function(viewId) {
    document.querySelectorAll('.view').forEach(view => {
        view.classList.remove('active');
    });
    document.getElementById(viewId + '-view').classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
};

window.showToast = function(message, isError = false) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.style.backgroundColor = isError ? "var(--danger)" : "var(--success)";
    toast.style.color = "white";
    toast.classList.remove('hidden');
    setTimeout(() => { toast.classList.add('hidden'); }, 3000);
};