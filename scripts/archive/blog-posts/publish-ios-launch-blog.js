#!/usr/bin/env node

/**
 * Script to publish the iOS App Launch blog post to the database
 * Usage: node scripts/publish-ios-launch-blog.js
 */

const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env.local') });

// Initialize Prisma client with proper configuration
const databaseUrl = process.env.PRISMA_DATABASE_URL || process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error('❌ DATABASE_URL or PRISMA_DATABASE_URL environment variable is required.');
  console.error('   Please set it in your .env.local file.');
  process.exit(1);
}

let prisma;
try {
  const isAccelerate = databaseUrl.startsWith('prisma+');
  
  if (isAccelerate) {
    prisma = new PrismaClient({
      accelerateUrl: databaseUrl,
      log: ['error', 'warn']
    });
  } else {
    const { PrismaPg } = require('@prisma/adapter-pg');
    const { Pool } = require('pg');
    const pool = new Pool({ connectionString: databaseUrl });
    const adapter = new PrismaPg(pool);
    prisma = new PrismaClient({
      adapter,
      log: ['error', 'warn']
    });
  }
} catch (error) {
  console.error('❌ Failed to initialize Prisma client:', error);
  process.exit(1);
}

// Load the blog post data
const blogPostPath = path.join(__dirname, '../data/blog-post-ios-launch.js');
const blogPostModule = require(blogPostPath);

async function publishBlogPost() {
  try {
    console.log('🚀 Publishing iOS App Launch Blog Post...\n');

    // Prepare the blog post data
    const blogPost = {
      title: blogPostModule.title,
      slug: blogPostModule.slug,
      excerpt: blogPostModule.excerpt,
      content: blogPostModule.content,
      featuredImage: blogPostModule.image,
      authorName: blogPostModule.author,
      published: blogPostModule.published,
      publishedAt: new Date(blogPostModule.date),
      tags: JSON.stringify(blogPostModule.tags),
      views: blogPostModule.views || 0,
    };

    console.log('📝 Blog Post Details:');
    console.log('   Title:', blogPost.title);
    console.log('   Slug:', blogPost.slug);
    console.log('   Author:', blogPost.authorName);
    console.log('   Published:', blogPost.published ? 'Yes' : 'No');
    console.log('   Date:', blogPost.publishedAt.toISOString());
    console.log('   Image:', blogPost.featuredImage);
    console.log('   Tags:', blogPost.tags);
    console.log('   Content Length:', blogPost.content.length, 'characters');
    console.log();

    // Check if post already exists
    const existingPost = await prisma.blogPost.findUnique({
      where: { slug: blogPost.slug },
    });

    if (existingPost) {
      console.log('⚠️  Post with this slug already exists!');
      console.log('   Existing Post ID:', existingPost.id);
      console.log('   Created:', existingPost.createdAt.toISOString());
      console.log();
      
      // Ask if we should update
      console.log('Would you like to update the existing post? (y/n)');
      console.log('Run with UPDATE=true to update automatically');
      
      if (process.env.UPDATE !== 'true') {
        console.log('❌ Skipping publish. Use UPDATE=true to force update.');
        process.exit(0);
      }

      // Update existing post
      console.log('📝 Updating existing blog post...');
      const updatedPost = await prisma.blogPost.update({
        where: { slug: blogPost.slug },
        data: {
          title: blogPost.title,
          excerpt: blogPost.excerpt,
          content: blogPost.content,
          featuredImage: blogPost.featuredImage,
          authorName: blogPost.authorName,
          published: blogPost.published,
          publishedAt: blogPost.publishedAt,
          tags: blogPost.tags,
        },
      });

      console.log('✅ Blog post updated successfully!');
      console.log('   Post ID:', updatedPost.id);
      console.log('   Updated At:', updatedPost.updatedAt.toISOString());
      console.log();
    } else {
      // Create new post
      console.log('📝 Creating new blog post...');
      const createdPost = await prisma.blogPost.create({
        data: blogPost,
      });

      console.log('✅ Blog post created successfully!');
      console.log('   Post ID:', createdPost.id);
      console.log('   Created At:', createdPost.createdAt.toISOString());
      console.log();
    }

    // Verify the post
    const verifyPost = await prisma.blogPost.findUnique({
      where: { slug: blogPost.slug },
      select: {
        id: true,
        title: true,
        slug: true,
        published: true,
        publishedAt: true,
        views: true,
      },
    });

    console.log('📊 Post Verification:');
    console.log('   ID:', verifyPost.id);
    console.log('   Title:', verifyPost.title);
    console.log('   Slug:', verifyPost.slug);
    console.log('   Published:', verifyPost.published);
    console.log('   Published At:', verifyPost.publishedAt?.toISOString());
    console.log('   Views:', verifyPost.views);
    console.log();

    console.log('🎉 SUCCESS!');
    console.log();
    console.log('📱 View your blog post at:');
    console.log('   https://genosys.ae/blog/' + blogPost.slug);
    console.log();
    console.log('Next steps:');
    console.log('1. Visit the blog post URL to verify it displays correctly');
    console.log('2. Share on social media');
    console.log('3. Send email newsletter');
    console.log('4. Monitor engagement metrics');
    console.log();

  } catch (error) {
    console.error('❌ Error publishing blog post:', error);
    console.error('Error details:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
publishBlogPost();

