document.querySelectorAll('.copy-button').forEach(button => {
    button.addEventListener('click', () => {
      const url = button.getAttribute('data-copy');
      navigator.clipboard.writeText(url).then(() => {
        alert('URL copied to clipboard');
      }).catch(err => {
        console.error('Could not copy URL: ', err);
      });
    });
  });