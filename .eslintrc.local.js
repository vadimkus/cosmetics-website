module.exports = {
  extends: ['./eslint.config.mjs'],
  rules: {
    'react/no-unescaped-entities': 'off'
  },
  overrides: [
    {
      files: [
        'app/products/[id]/ProductPageClient.tsx',
        'app/profile/page.tsx', 
        'app/training/page.tsx'
      ],
      rules: {
        'react/no-unescaped-entities': 'off'
      }
    }
  ]
}
