// src/TombstoneCreator.js
import React from 'react';

const TombstoneCreator = () => {
  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <iframe
        title="Tombstone Creator"
        src="/unity/index.html"
        style={{
          width: '100%',
          height: '100%',
          border: 'none'
        }}
      />
    </div>
  );
};

export default TombstoneCreator;
