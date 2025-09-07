import axios from 'axios';

const BACKEND_URL = 'https://jobhunt-server-six.vercel.app';

console.log('🔍 Testing Backend Status...\n');

async function testBackend() {
    const tests = [
        {
            name: 'Root Endpoint',
            url: `${BACKEND_URL}/`,
            expected: 'Should return welcome message'
        },
        {
            name: 'Health Check',
            url: `${BACKEND_URL}/api/v1/health`,
            expected: 'Should return health status with database info'
        },
        {
            name: 'Ping',
            url: `${BACKEND_URL}/api/v1/ping`,
            expected: 'Should return pong'
        },
        {
            name: 'Companies Endpoint',
            url: `${BACKEND_URL}/api/v1/company/get`,
            expected: 'Should return companies or error'
        },
        {
            name: 'Mixed Jobs',
            url: `${BACKEND_URL}/api/v1/mixed-jobs/random`,
            expected: 'Should return random jobs'
        }
    ];

    for (const test of tests) {
        try {
            console.log(`\n📝 Testing: ${test.name}`);
            console.log(`   URL: ${test.url}`);
            
            const response = await axios.get(test.url, {
                timeout: 10000,
                validateStatus: () => true // Accept any status code
            });
            
            console.log(`   Status: ${response.status} ${response.statusText}`);
            
            if (response.status === 200) {
                console.log(`   ✅ SUCCESS`);
                if (test.name === 'Health Check' && response.data.database) {
                    console.log(`   Database: ${response.data.database.status}`);
                    if (response.data.database.error) {
                        console.log(`   ⚠️  DB Error: ${response.data.database.error}`);
                    }
                }
            } else if (response.status === 500) {
                console.log(`   ❌ INTERNAL SERVER ERROR`);
                if (response.data.error) {
                    console.log(`   Error: ${response.data.error}`);
                }
            } else {
                console.log(`   ⚠️  Unexpected status code`);
            }
            
            if (response.data) {
                console.log(`   Response:`, JSON.stringify(response.data, null, 2).substring(0, 200));
            }
            
        } catch (error) {
            console.log(`   ❌ FAILED: ${error.message}`);
            if (error.code === 'ECONNREFUSED') {
                console.log(`   Server appears to be down`);
            }
        }
    }
    
    console.log('\n' + '='.repeat(50));
    console.log('\n📊 Summary:');
    console.log('If you see 500 errors, the server is running but MongoDB is not connected.');
    console.log('Follow the steps in URGENT_MONGODB_FIX.md to fix the database connection.\n');
}

testBackend().catch(console.error);
