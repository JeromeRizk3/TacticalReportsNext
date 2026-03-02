const daysAgo = (n) => {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return d.toISOString()
}

export const POSTS = [
  {
    id: 'p1',
    title: 'Kuwait reverses oil decline under calibrated reforms',
    category: 'Energy, Oil and Gas',
    tags: ['Kuwait', 'Upstream'],
    creditsCost: 45,
    publishedAt: daysAgo(2),
    excerpt:
      'A set of targeted reforms is stabilizing output and improving investment confidence.',
    content:
      'Officials introduced phased fiscal and regulatory changes aimed at improving project execution. Early indicators suggest a slowdown in decline rates and improved timelines for maintenance and capacity work.',
  },
  {
    id: 'p2',
    title: 'Egypt keeps energy leadership steady amid regional gas talks',
    category: 'Energy, Oil and Gas',
    tags: ['Egypt', 'Gas'],
    creditsCost: 40,
    publishedAt: daysAgo(6),
    excerpt:
      'Negotiators are exploring supply coordination while domestic demand remains the key constraint.',
    content:
      'With multiple stakeholders at the table, the most likely near-term outcome is incremental coordination rather than a single sweeping deal. Infrastructure and pricing remain the main friction points.',
  },
  {
    id: 'p3',
    title: 'US–Iran conflict: shipping routes face renewed risk premium',
    category: 'Geopolitics',
    tags: ['Maritime', 'Risk'],
    creditsCost: 55,
    publishedAt: daysAgo(1),
    excerpt:
      'Insurers and carriers price in disruption risk, raising costs across several corridors.',
    content:
      'Market participants are adjusting schedules and hedges. Even without direct disruptions, elevated risk perception can impact lead times, freight rates, and energy spot pricing.',
  },
  {
    id: 'p4',
    title: 'Carbon policy update: new reporting rules for heavy industry',
    category: 'Policy',
    tags: ['Regulation', 'Emissions'],
    creditsCost: 35,
    publishedAt: daysAgo(4),
    excerpt:
      'Revised disclosure requirements tighten audit standards and increase penalties for gaps.',
    content:
      'The practical impact is higher compliance spend and a stronger incentive to modernize measurement systems. Smaller operators may need third-party verification to remain eligible for certain contracts.',
  },
  {
    id: 'p5',
    title: 'Refining margins widen as inventories tighten',
    category: 'Energy, Oil and Gas',
    tags: ['Refining', 'Margins'],
    creditsCost: 30,
    publishedAt: daysAgo(3),
    excerpt:
      'A mix of maintenance downtime and shipping delays contributes to a near-term squeeze.',
    content:
      'Cracks improved across several products, while feedstock costs stayed volatile. Watch for whether turnarounds end on schedule and whether imports fill the gap.',
  },
  {
    id: 'p6',
    title: 'Power market briefing: grid reliability becomes political',
    category: 'Geopolitics',
    tags: ['Power', 'Infrastructure'],
    creditsCost: 50,
    publishedAt: daysAgo(9),
    excerpt:
      'A series of outages drives scrutiny of investment plans and procurement standards.',
    content:
      'Regulators are weighing new reliability obligations. In the short run, capacity payments and accelerated maintenance are likely, with longer-term reforms tied to market design.',
  },
  {
    id: 'p7',
    title: 'Commodities watch: LNG spot prices soften on mild demand',
    category: 'Energy, Oil and Gas',
    tags: ['LNG', 'Prices'],
    creditsCost: 25,
    publishedAt: daysAgo(12),
    excerpt:
      'Weather and storage dynamics ease near-term pressure, though volatility remains.',
    content:
      'With seasonal demand lower than expected, participants are rebalancing cargoes. The key variable is whether a surprise cold snap or supply outage changes the curve quickly.',
  },
  {
    id: 'p8',
    title: 'Country risk note: investment rules tighten for strategic assets',
    category: 'Policy',
    tags: ['FDI', 'Screening'],
    creditsCost: 60,
    publishedAt: daysAgo(7),
    excerpt:
      'New screening thresholds expand review scope and raise timelines for approvals.',
    content:
      'The changes increase uncertainty for cross-border deals in sensitive sectors. Expect more conditional approvals and a greater role for local partnerships to mitigate scrutiny.',
  },
]

export const POSTS_BY_ID = Object.fromEntries(POSTS.map((p) => [p.id, p]))
