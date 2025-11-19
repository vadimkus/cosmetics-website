/**
 * Script to set password for a user account
 * Usage: node scripts/set-user-password.js <email> <password>
 */

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function setUserPassword(email, password) {
  try {
    console.log(`🔍 Looking up user: ${email}`);
    
    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() }
    });

    if (!user) {
      console.error(`❌ User not found: ${email}`);
      process.exit(1);
    }

    console.log(`✅ User found: ${user.name} (ID: ${user.id})`);
    console.log(`🔐 Hashing password...`);

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);

    console.log(`💾 Updating password in database...`);

    // Update user password
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword }
    });

    console.log(`✅ Password updated successfully!`);
    console.log(`📧 Email: ${updatedUser.email}`);
    console.log(`👤 Name: ${updatedUser.name}`);
    console.log(`🔑 Password hash starts with: ${updatedUser.password.substring(0, 7)}...`);

    // Verify the password works
    console.log(`\n🔍 Verifying password...`);
    const isValid = await bcrypt.compare(password, updatedUser.password);
    
    if (isValid) {
      console.log(`✅ Password verification successful!`);
    } else {
      console.error(`❌ Password verification failed!`);
      process.exit(1);
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.stack) {
      console.error(error.stack);
    }
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Get email and password from command line arguments
const email = process.argv[2];
const password = process.argv[3];

if (!email || !password) {
  console.error('Usage: node scripts/set-user-password.js <email> <password>');
  console.error('Example: node scripts/set-user-password.js user@example.com MyPassword123');
  process.exit(1);
}

// Run the script
setUserPassword(email, password)
  .then(() => {
    console.log('\n✅ Script completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Fatal error:', error);
    process.exit(1);
  });

