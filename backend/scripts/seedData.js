import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Team from '../models/Team.js';
import Holiday from '../models/Holiday.js';

dotenv.config();

const seedData = async () => {
    try {
        console.log('🌱 Starting data seeding...\n');

        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB\n');

        const adminUser = await User.findOne({ email: 'admin@company.com' });
        if (!adminUser) {
            console.log('❌ Admin user not found. Run setupDB.js first.');
            process.exit(1);
        }

        console.log('📅 Seeding holidays...');

        const holidays2025 = [
            { holidayName: "New Year's Day", date: new Date('2025-01-01'), location: 'US', isRecurring: true },
            { holidayName: 'Martin Luther King Jr. Day', date: new Date('2025-01-20'), location: 'US', isRecurring: true },
            { holidayName: "Presidents' Day", date: new Date('2025-02-17'), location: 'US', isRecurring: true },
            { holidayName: 'Memorial Day', date: new Date('2025-05-26'), location: 'US', isRecurring: true },
            { holidayName: 'Independence Day', date: new Date('2025-07-04'), location: 'US', isRecurring: true },
            { holidayName: 'Labor Day', date: new Date('2025-09-01'), location: 'US', isRecurring: true },
            { holidayName: 'Thanksgiving Day', date: new Date('2025-11-27'), location: 'US', isRecurring: true },
            { holidayName: 'Christmas Day', date: new Date('2025-12-25'), location: 'US', isRecurring: true },

            { holidayName: 'Republic Day', date: new Date('2025-01-26'), location: 'India', isRecurring: true },
            { holidayName: 'Holi', date: new Date('2025-03-14'), location: 'India', isRecurring: true },
            { holidayName: 'Good Friday', date: new Date('2025-04-18'), location: 'India', isRecurring: true },
            { holidayName: 'Independence Day', date: new Date('2025-08-15'), location: 'India', isRecurring: true },
            { holidayName: 'Gandhi Jayanti', date: new Date('2025-10-02'), location: 'India', isRecurring: true },
            { holidayName: 'Diwali', date: new Date('2025-10-20'), location: 'India', isRecurring: true },
            { holidayName: 'Christmas', date: new Date('2025-12-25'), location: 'India', isRecurring: true }
        ];

        for (const holiday of holidays2025) {
            const exists = await Holiday.findOne({
                holidayName: holiday.holidayName,
                date: holiday.date,
                location: holiday.location
            });

            if (!exists) {
                await Holiday.create({
                    ...holiday,
                    createdBy: adminUser._id
                });
                console.log(`   ✓ ${holiday.holidayName} (${holiday.location})`);
            }
        }

        console.log('\n👥 Seeding sample teams...');

        const sampleTeams = [
            {
                teamId: 'eng-team',
                teamName: 'Engineering Team',
                description: 'Core product engineering team',
                jiraProject: 'PROJ',
                members: []
            },
            {
                teamId: 'qa-team',
                teamName: 'QA Team',
                description: 'Quality assurance and testing',
                jiraProject: 'TEST',
                members: []
            }
        ];

        for (const teamData of sampleTeams) {
            const exists = await Team.findOne({ teamId: teamData.teamId });

            if (!exists) {
                await Team.create({
                    ...teamData,
                    createdBy: adminUser._id
                });
                console.log(`   ✓ ${teamData.teamName}`);
            }
        }

        console.log('\n✅ Data seeding completed successfully!');
        console.log('\n📝 Summary:');
        console.log(`   Holidays seeded: ${holidays2025.length}`);
        console.log(`   Teams seeded: ${sampleTeams.length}`);
        console.log('\n💡 Next steps:');
        console.log('   1. Update backend/config/teams.yaml with your Jira queries');
        console.log('   2. Start the application: npm run dev');
        console.log('   3. Login with admin@company.com / Admin@123\n');

        process.exit(0);
    } catch (error) {
        console.error('\n❌ Data seeding failed:', error.message);
        console.error(error);
        process.exit(1);
    }
};

seedData();