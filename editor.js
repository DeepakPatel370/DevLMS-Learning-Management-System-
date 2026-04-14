document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('token');
  if (!token) {
    window.location.href = 'login.html';
    return;
  }

  const runBtn = document.getElementById('run-btn');
  const saveBtn = document.getElementById('save-btn');
  const codeEditor = document.getElementById('code-editor');
  const previewFrame = document.getElementById('preview-frame');
  const langSelect = document.getElementById('lang-select');
  const alertBox = document.getElementById('alert-box');

  const updatePreview = () => {
    const code = codeEditor.value;
    const doc = previewFrame.contentDocument || previewFrame.contentWindow.document;
    doc.open();
    doc.write(code);
    doc.close();
  };

  runBtn.addEventListener('click', updatePreview);
  
  // Auto-run initially
  updatePreview();

  saveBtn.addEventListener('click', async () => {
    try {
      saveBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
      saveBtn.disabled = true;

      const data = await api.post('/code/save', {
        language: langSelect.value,
        codeSnippet: codeEditor.value
      });

      alertBox.innerHTML = `
        <div class="alert alert-success alert-dismissible fade show">
          ${data.message || 'Code saved successfully!'}
          <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
      `;
    } catch (err) {
      alertBox.innerHTML = `
        <div class="alert alert-danger alert-dismissible fade show">
          Failed to save code.
          <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
      `;
    } finally {
      saveBtn.innerHTML = '<i class="fas fa-save"></i> Save Submission';
      saveBtn.disabled = false;
    }
  });
});
