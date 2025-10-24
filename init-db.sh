#!/bin/bash

# MongoDB Database Initialization Script
# This script creates collections with indexes for the Team Management application

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}MongoDB Database Initialization${NC}"
echo -e "${GREEN}========================================${NC}\n"

# MongoDB connection details
DB_NAME="team-management"
MONGO_HOST="localhost"
MONGO_PORT="27017"
MONGO_USER="mongoadmin"
MONGO_PASS="mongoadmin"
MONGO_AUTH_DB="admin"

# Check if mongosh is available
if ! command -v mongosh &> /dev/null; then
    echo -e "${RED}Error: mongosh not found!${NC}"
    echo -e "${YELLOW}Please install MongoDB Shell: https://www.mongodb.com/docs/mongodb-shell/${NC}"
    exit 1
fi

echo -e "${YELLOW}Connecting to MongoDB...${NC}"

# MongoDB connection string
MONGO_URI="mongodb://${MONGO_USER}:${MONGO_PASS}@${MONGO_HOST}:${MONGO_PORT}/${DB_NAME}?authSource=${MONGO_AUTH_DB}"

# Create database and collections with indexes
mongosh "$MONGO_URI" --quiet << 'EOF'

// Use the database
db = db.getSiblingDB('team-management');

print('\nCreating collections and indexes...\n');

// 1. Users Collection
db.createCollection('users');
db.users.createIndex({ email: 1 }, { unique: true });
print('✓ Created users collection with email index');

// 2. Teams Collection
db.createCollection('teams');
db.teams.createIndex({ teamId: 1 }, { unique: true });
db.teams.createIndex({ teamName: 1 });
print('✓ Created teams collection with indexes');

// 3. TeamMembers Collection
db.createCollection('teammembers');
db.teammembers.createIndex({ userId: 1, teamId: 1 }, { unique: true });
print('✓ Created teammembers collection with composite index');

// 4. Holidays Collection
db.createCollection('holidays');
db.holidays.createIndex({ date: 1, location: 1 });
print('✓ Created holidays collection with date/location index');

// 5. PTOs Collection
db.createCollection('ptos');
db.ptos.createIndex({ userId: 1 });
db.ptos.createIndex({ status: 1 });
db.ptos.createIndex({ startDate: 1, endDate: 1 });
print('✓ Created ptos collection with indexes');

// 6. JiraQueries Collection
db.createCollection('jiraqueries');
db.jiraqueries.createIndex({ teamId: 1, jqlKey: 1 }, { unique: true });
print('✓ Created jiraqueries collection with composite index');

// 7. AuditLogs Collection
db.createCollection('auditlogs');
db.auditlogs.createIndex({ userId: 1 });
db.auditlogs.createIndex({ action: 1 });
db.auditlogs.createIndex({ resourceType: 1 });
db.auditlogs.createIndex({ timestamp: -1 });
print('✓ Created auditlogs collection with indexes');

// 8. EmailSchedules Collection
db.createCollection('emailschedules');
db.emailschedules.createIndex({ status: 1 });
db.emailschedules.createIndex({ scheduledFor: 1 });
db.emailschedules.createIndex({ emailType: 1 });
print('✓ Created emailschedules collection with indexes');

// 9. DistributionLists Collection
db.createCollection('distributionlists');
db.distributionlists.createIndex({ name: 1 }, { unique: true });
print('✓ Created distributionlists collection with name index');

// Verify collections
print('\n========================================');
print('Collections created:');
print('========================================');
db.getCollectionNames().forEach(function(collection) {
    print('  • ' + collection);
});

print('\n========================================');
print('Database initialization complete!');
print('========================================\n');

EOF

if [ $? -eq 0 ]; then
    echo -e "\n${GREEN}✓ Database initialized successfully!${NC}"
    echo -e "${YELLOW}Database:${NC} $DB_NAME"
    echo -e "${YELLOW}Host:${NC} $MONGO_HOST:$MONGO_PORT"
else
    echo -e "\n${RED}✗ Database initialization failed!${NC}"
    exit 1
fi
