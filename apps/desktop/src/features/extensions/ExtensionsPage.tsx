export function ExtensionsPage() {
  return (
    <div>
      <h1 className="page-heading">Extensions</h1>
      <p className="page-subtitle">Manage TigressOS extensions</p>
      <div className="empty-state">
        <div className="empty-state-icon">⊞</div>
        <div className="empty-state-text">
          Extension host coming soon. The SDK is available at{' '}
          <code style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent)' }}>
            @tigressos/extensions-sdk
          </code>
          .
        </div>
      </div>
    </div>
  );
}
