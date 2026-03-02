export const PLANS = [
  {
    id: 'starter',
    name: 'Starter',
    price: 0,
    blurb: 'Free sample categories.',
    allowedCategories: ['Product', 'Company'],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 9,
    blurb: 'Unlock product deep dives + growth.',
    allowedCategories: ['Product', 'Growth', 'Company'],
  },
  {
    id: 'ultimate',
    name: 'Ultimate',
    price: 19,
    blurb: 'Everything, including engineering + design.',
    allowedCategories: ['Product', 'Growth', 'Company', 'Engineering', 'Design'],
  },
]

export const PLANS_BY_ID = Object.fromEntries(PLANS.map((p) => [p.id, p]))
