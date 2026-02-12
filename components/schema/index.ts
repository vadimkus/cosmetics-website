// Schema components for SEO/structured data
export { default as ProductSchema } from './ProductSchema'
export { default as ProductsListSchema } from './ProductsListSchema'
export { default as OrganizationSchema } from './OrganizationSchema'
export { default as LocalBusinessSchema } from './LocalBusinessSchema'
export { default as BreadcrumbSchema } from './BreadcrumbSchema'
export { default as PartnersSchema } from './PartnersSchema'
// AggregateRatingSchema removed - was outputting standalone @type:AggregateRating
// which Google doesn't allow as a root schema type. The LocalBusinessSchema
// already contains aggregateRating properly nested within its structure.
