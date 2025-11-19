/**
 * Script to check password reset requests
 * Shows how many users have requested password resets
 */

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkPasswordResetRequests() {
  try {
    console.log('🔍 Checking password reset requests...\n');

    // Get all password reset tokens
    const tokens = await prisma.passwordResetToken.findMany({
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    console.log(`📊 Total password reset tokens: ${tokens.length}\n`);

    // Count unique users
    const uniqueUserIds = new Set(tokens.map(t => t.userId));
    const uniqueUsers = Array.from(uniqueUserIds).map(userId => {
      const userTokens = tokens.filter(t => t.userId === userId);
      const user = userTokens[0].user;
      return {
        userId,
        email: user.email,
        name: user.name,
        tokenCount: userTokens.length,
        latestRequest: userTokens[0].createdAt,
        usedTokens: userTokens.filter(t => t.used).length,
        unusedTokens: userTokens.filter(t => !t.used).length
      };
    });

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📋 Password Reset Statistics:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`   Total tokens created:     ${tokens.length}`);
    console.log(`   Unique users:             ${uniqueUsers.length}`);
    console.log(`   Used tokens:             ${tokens.filter(t => t.used).length}`);
    console.log(`   Unused tokens:           ${tokens.filter(t => !t.used).length}`);
    console.log(`   Expired tokens:          ${tokens.filter(t => new Date(t.expiresAt) < new Date()).length}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    if (uniqueUsers.length > 0) {
      console.log('👥 Users who requested password reset:');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      
      // Sort by latest request (most recent first)
      uniqueUsers.sort((a, b) => new Date(b.latestRequest) - new Date(a.latestRequest));
      
      uniqueUsers.forEach((user, index) => {
        console.log(`\n${index + 1}. ${user.name || 'N/A'}`);
        console.log(`   Email: ${user.email}`);
        console.log(`   Total requests: ${user.tokenCount}`);
        console.log(`   Used: ${user.usedTokens}, Unused: ${user.unusedTokens}`);
        console.log(`   Latest request: ${new Date(user.latestRequest).toLocaleString()}`);
      });
      
      console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    } else {
      console.log('✅ No password reset requests found.\n');
    }

    // Show recent requests
    const recentTokens = tokens.slice(0, 10);
    if (recentTokens.length > 0) {
      console.log('\n📧 Most Recent Password Reset Requests:');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      recentTokens.forEach((token, index) => {
        const expired = new Date(token.expiresAt) < new Date();
        const status = token.used ? '✅ Used' : expired ? '⏰ Expired' : '⏳ Active';
        console.log(`${index + 1}. ${token.user.email} - ${status} - ${new Date(token.createdAt).toLocaleString()}`);
      });
      console.log('');
    }

    return {
      totalTokens: tokens.length,
      uniqueUsers: uniqueUsers.length,
      usedTokens: tokens.filter(t => t.used).length,
      unusedTokens: tokens.filter(t => !t.used).length,
      expiredTokens: tokens.filter(t => new Date(t.expiresAt) < new Date()).length
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
checkPasswordResetRequests()
  .then((summary) => {
    console.log('✅ Check completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Fatal error:', error);
    process.exit(1);
  });

