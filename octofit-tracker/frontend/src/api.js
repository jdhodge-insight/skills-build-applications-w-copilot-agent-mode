export function getApiBase() {
  const codespaceName = process.env.REACT_APP_CODESPACE_NAME;

  if (codespaceName) {
    return `https://${codespaceName}-8000.app.github.dev/api`;
  }

  const { protocol, hostname, port } = window.location;

  if (hostname.endsWith('.app.github.dev')) {
    const backendHost = hostname.replace(/-3000\.app\.github\.dev$/, '-8000.app.github.dev');
    return `https://${backendHost}/api`;
  }

  if (port === '3000') {
    return `${protocol}//${hostname}:8000/api`;
  }

  return `${protocol}//${hostname}${port ? `:${port}` : ''}/api`;
}