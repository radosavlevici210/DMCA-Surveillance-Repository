
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Production database setup
const dbPath = process.env.DATABASE_PATH || './monitoring.db';
const db = new sqlite3.Database(dbPath);

// Create indexes for performance
const createIndexes = [
  'CREATE INDEX IF NOT EXISTS idx_threats_timestamp ON threats(timestamp)',
  'CREATE INDEX IF NOT EXISTS idx_threats_ip ON threats(ip_address)',
  'CREATE INDEX IF NOT EXISTS idx_legal_actions_threat ON legal_actions(threat_id)',
  'CREATE INDEX IF NOT EXISTS idx_repository_tracking_date ON repository_tracking(detection_date)'
];

createIndexes.forEach(query => {
  db.run(query, (err) => {
    if (err) console.error('Index creation error:', err.message);
    else console.log('Database index created successfully');
  });
});

// Create views for reporting
const createViews = [
  `CREATE VIEW IF NOT EXISTS daily_threat_summary AS
   SELECT date(created_at) as date,
          COUNT(*) as total_threats,
          COUNT(CASE WHEN status = 'ACTIVE' THEN 1 END) as active_threats
   FROM threats
   GROUP BY date(created_at)`,
  
  `CREATE VIEW IF NOT EXISTS legal_action_status AS
   SELECT la.action_type,
          la.status,
          COUNT(*) as count,
          t.repository_url
   FROM legal_actions la
   JOIN threats t ON la.threat_id = t.id
   GROUP BY la.action_type, la.status`
];

createViews.forEach(query => {
  db.run(query, (err) => {
    if (err) console.error('View creation error:', err.message);
    else console.log('Database view created successfully');
  });
});

console.log('🗄️ Production database setup completed');
db.close();
