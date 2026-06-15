'use client';

export default function Page() {
  return (
    <div style={{ width: '100%', height: '100vh', overflow: 'hidden', marginTop: '-24px' }}>
      <iframe
        src="http://localhost:63099/admin-dashboard.html"
        style={{
          width: '100%',
          height: '100%',
          border: 'none',
          display: 'block'
        }}
        title="Stackora Admin Dashboard"
      />
    </div>
  );
}