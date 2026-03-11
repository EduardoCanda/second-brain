document$.subscribe(() => {
  if (window.mermaid) {
    window.mermaid.initialize({
      startOnLoad: true,
      securityLevel: 'loose',
      theme: document.body.getAttribute('data-md-color-scheme') === 'slate' ? 'dark' : 'default'
    });
    window.mermaid.run();
  }
});
