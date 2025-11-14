# Archived Scripts

This directory contains one-time migration scripts, data fixes, and testing scripts that have been completed and are no longer actively used.

## Categories

### Data Migration Scripts
- `migrate-*.ts/js` - Database migration scripts
- `populate-*.js` - Data population scripts
- `add-*.js` - One-time data addition scripts

### Data Fix Scripts
- `fix-*.js` - One-time data correction scripts
- `update-*.js` - One-time data update scripts
- `remove-*.js` - One-time data removal scripts

### Testing & Verification Scripts
- `test-*.js/ts` - Testing scripts
- `check-*.js/ts` - Verification scripts
- `verify-*.js` - Verification scripts
- `cleanup-*.ts` - Cleanup scripts

### Blog Post Creation Scripts
- `create-bio-ferment-blog-post.js`
- `create-first-blog-post.js`
- `create-growth-factors-blog-post.js`
- `update-blog-post-*.js` - Blog post update scripts

### Analysis & Utility Scripts
- `analyze-*.js` - Dependency analysis scripts
- `web-app-analysis.js` - Web app analysis
- `find-*.js` - Search/find utility scripts
- `search-*.js` - Search scripts

## Note

These scripts are kept for historical reference but should not be run again unless you understand their purpose and impact. Some scripts may reference database schemas or data structures that have changed since they were written.

## Active Scripts

The following scripts remain in the main `scripts/` directory as they are actively used:

- `deploy-setup.js` - Used in package.json postinstall hook
- `create-admin-user.js` - Utility for creating admin users
- `migrate-password-reset-table.js` - May be needed for migrations
- `validate-sitemap.js` - Utility for validating sitemap

