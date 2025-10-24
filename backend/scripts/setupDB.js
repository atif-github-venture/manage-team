import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

dotenv.config();

const setupDatabase = async () => {
    try {
        console.log('🚀 Starting database setup...\n');

        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB');
        console.log(`   Database: ${mongoose.connection.name}\n`);

        const db = mongoose.connection.db;

        const collections = [
            'users',
            'teams',
            'teammembers',
            'holidays',
            'ptos',
            'auditlogs',
            'emailschedules'
        ];

        console.log('📦 Creating collections...');
        for (const collection of collections) {
            const exists = await db.listCollections({ name: collection }).hasNext();
            if (!exists) {
                await db.createCollection(collection);
                console.log(`   ✓ Created: ${collection}`);
            } else {
                console.log(`   ℹ Already exists: ${collection}`);
            }
        }

        console.log('\n📊 Creating indexes...');

        await db.collection('users').createIndex({ email: 1 }, { unique: true });
        console.log('   ✓ users: email (unique)');

        await db.collection('users').createIndex({ role: 1 });
        console.log('   ✓ users: role');

        await db.collection('users').createIndex({ active: 1 });
        console.log('   ✓ users: active');

        await db.collection('teams').createIndex({ teamId: 1 }, { unique: true });
        console.log('   ✓ teams: teamId (unique)');

        await db.collection('teams').createIndex({ teamName: 1 });
        console.log('   ✓ teams: teamName');

        await db.collection('teams').createIndex({ active: 1 });
        console.log('   ✓ teams: active');

        await db.collection('teammembers').createIndex({ teamId: 1, userId: 1 }, { unique: true });
        console.log('   ✓ teammembers: teamId + userId (unique)');

        await db.collection('teammembers').createIndex({ teamId: 1, active: 1 });
        console.log('   ✓ teammembers: teamId + active');

        await db.collection('holidays').createIndex({ location: 1, year: 1 });
        console.log('   ✓ holidays: location + year');

        await db.collection('holidays').createIndex({ date: 1 });
        console.log('   ✓ holidays: date');

        await db.collection('ptos').createIndex({ userId: 1, startDate: 1 });
        console.log('   ✓ ptos: userId + startDate');

        await db.collection('ptos').createIndex({ teamId: 1, startDate: 1 });
        console.log('   ✓ ptos: teamId + startDate');

        await db.collection('ptos').createIndex({ status: 1 });
        console.log('   ✓ ptos: status');

        await db.collection('auditlogs').createIndex({ userId: 1, timestamp: -1 });
        console.log('   ✓ auditlogs: userId + timestamp');

        await db.collection('auditlogs').createIndex({ resourceType: 1, timestamp: -1 });
        console.log('   ✓ auditlogs: resourceType + timestamp');

        await db.collection('auditlogs').createIndex({ timestamp: 1 }, { expireAfterSeconds: 31536000 });
        console.log('   ✓ auditlogs: TTL index (1 year)');

        await db.collection('emailschedules').createIndex({ enabled: 1 });
        console.log('   ✓ emailschedules: enabled');

        await db.collection('emailschedules').createIndex({ nextRun: 1 });
        console.log('   ✓ emailschedules: nextRun');

        console.log('\n👤 Creating default admin user...');

        const adminExists = await db.collection('users').findOne({ email: 'admin@company.com' });

        if (!adminExists) {
            const hashedPassword = await bcrypt.hash('Admin@123', 10);

            await db.collection('users').insertOne({
                email: 'admin@company.com',
                password: hashedPassword,
                firstName: 'Admin',
                lastName: 'User',
                role: 'admin',
                teams: [],
                active: true,
                createdAt: new Date(),
                updatedAt: new Date()
            });

            console.log('   ✓ Admin user created');
            console.log('   📧 Email: admin@company.com');
            console.log('   🔑 Password: Admin@123');
            console.log('   ⚠️  CHANGE PASSWORD ON FIRST LOGIN!');
        } else {
            console.log('   ℹ Admin user already exists');
        }

        console.log('\n✅ Database setup completed successfully!');
        console.log('\n📝 Summary:');
        console.log(`   Collections: ${collections.length}`);
        console.log(`   Indexes: Created successfully`);
        console.log(`   Default admin: ${adminExists ? 'Already exists' : 'Created'}`);
        console.log('\n🎉 Ready to start the application!\n');

        process.exit(0);
    } catch (error) {
        console.error('\n❌ Database setup failed:', error.message);
        console.error(error);
        process.exit(1);
    }
};

setupDatabase();