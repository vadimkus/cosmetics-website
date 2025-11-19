/**
 * Script to find users with plaintext passwords
 * Usage: node scripts/check-plaintext-passwords.js
 */

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkPlaintextPasswords() {
  try {
    console.log('🔍 Checking for users with plaintext passwords...\n');

    // Get all users
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        password: true,
        createdAt: true,
        lastLoginAt: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    console.log(`📊 Total users in database: ${users.length}\n`);

    const plaintextUsers = [];
    const hashedUsers = [];
    const noPasswordUsers = [];

    users.forEach(user => {
      if (!user.password) {
        noPasswordUsers.push(user);
      } else if (user.password.startsWith('$2')) {
        // Bcrypt hash starts with $2a$, $2b$, or $2y$
        hashedUsers.push(user);
      } else {
        // Plaintext password
        plaintextUsers.push(user);
      }
    });

    // Display results
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📋 Password Status Summary:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`   ✅ Hashed passwords:     ${hashedUsers.length}`);
    console.log(`   ⚠️  Plaintext passwords: ${plaintextUsers.length}`);
    console.log(`   ❌ No password:          ${noPasswordUsers.length}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    if (plaintextUsers.length > 0) {
      console.log('⚠️  USERS WITH PLAINTEXT PASSWORDS:');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      plaintextUsers.forEach((user, index) => {
        console.log(`\n${index + 1}. ${user.name || 'N/A'}`);
        console.log(`   Email: ${user.email}`);
        console.log(`   Password: ${user.password.substring(0, 20)}${user.password.length > 20 ? '...' : ''}`);
        console.log(`   Created: ${user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}`);
        console.log(`   Last Login: ${user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleDateString() : 'Never'}`);
        console.log(`   ID: ${user.id}`);
      });
      console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log(`\n💡 These users will have their passwords automatically upgraded to bcrypt on their next login.`);
      console.log(`   Or you can manually set passwords using: node scripts/set-user-password.js <email> <password>\n`);
    } else {
      console.log('✅ No users with plaintext passwords found!\n');
    }

    if (noPasswordUsers.length > 0) {
      console.log('❌ USERS WITHOUT PASSWORDS (Social login accounts):');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      noPasswordUsers.forEach((user, index) => {
        console.log(`${index + 1}. ${user.email} (${user.name || 'N/A'})`);
      });
      console.log('');
    }

    // Return summary
    return {
      total: users.length,
      hashed: hashedUsers.length,
      plaintext: plaintextUsers.length,
      noPassword: noPasswordUsers.length,
      plaintextUsers: plaintextUsers.map(u => ({
        email: u.email,
        name: u.name,
        password: u.password
      }))
    };

  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.stack) {
      console.error(error.stack);
    }
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
checkPlaintextPasswords()
  .then((summary) => {
    console.log('✅ Check completed successfully!');
    process.exit(summary.plaintext > 0 ? 1 : 0); // Exit with error if plaintext passwords found
  })
  .catch((error) => {
    console.error('\n💥 Fatal error:', error);
    process.exit(1);
  });

