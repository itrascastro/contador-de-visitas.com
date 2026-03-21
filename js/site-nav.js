(function () {
  var toggles = document.querySelectorAll('.nav-toggle');

  function closeAll() {
    document.querySelectorAll('.site-topbar.is-open').forEach(function (header) {
      header.classList.remove('is-open');
      var button = header.querySelector('.nav-toggle');
      if (button) {
        button.setAttribute('aria-expanded', 'false');
      }
    });
  }

  toggles.forEach(function (button) {
    button.addEventListener('click', function () {
      var header = button.closest('.site-topbar');
      if (!header) return;

      var isOpen = header.classList.contains('is-open');
      closeAll();

      if (!isOpen) {
        header.classList.add('is-open');
        button.setAttribute('aria-expanded', 'true');
      }
    });
  });

  document.addEventListener('click', function (event) {
    if (event.target.closest('.site-nav-shell')) return;
    closeAll();
  });

  window.addEventListener('resize', function () {
    if (window.innerWidth > 980) {
      closeAll();
    }
  });
})();
