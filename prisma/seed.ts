import { PrismaClient, BrandStage, BrandStatus, VisionaryStage, DayOfWeek, ContactCategory, MetricType, AlertType } from '@prisma/client'
import { startOfWeek, subDays, addDays } from 'date-fns'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Create demo user
  const user = await prisma.user.upsert({
    where: { email: 'director@company.com' },
    update: {},
    create: {
      email: 'director@company.com',
      name: 'GTM Director',
      role: 'DIRECTOR',
    },
  })

  console.log('Created user:', user.email)

  // Create visionaries
  const visionaries = await Promise.all([
    prisma.visionary.create({
      data: {
        name: 'John Smith',
        email: 'john@example.com',
        phone: '+1 (555) 123-4567',
        company: 'Smith Education Co',
        industry: 'Online Courses',
        stage: VisionaryStage.NEGOTIATION,
        nextAction: 'Follow up on contract terms',
        nextActionDate: addDays(new Date(), 3),
        notes: 'Very interested, discussing revenue share terms',
      },
    }),
    prisma.visionary.create({
      data: {
        name: 'Sarah Johnson',
        email: 'sarah@example.com',
        company: 'Digital Learning Hub',
        industry: 'E-Learning',
        stage: VisionaryStage.DISCOVERY,
        nextAction: 'Schedule discovery call',
        nextActionDate: addDays(new Date(), 1),
      },
    }),
    prisma.visionary.create({
      data: {
        name: 'Mike Williams',
        email: 'mike@example.com',
        company: 'Williams Academy',
        industry: 'Professional Training',
        stage: VisionaryStage.INITIAL_CONTACT,
        nextAction: 'Send intro email',
        nextActionDate: new Date(),
      },
    }),
    prisma.visionary.create({
      data: {
        name: 'Emily Chen',
        email: 'emily@example.com',
        company: 'Chen Coaching',
        industry: 'Life Coaching',
        stage: VisionaryStage.PROPOSAL,
        nextAction: 'Review proposal feedback',
        nextActionDate: addDays(new Date(), 2),
      },
    }),
    prisma.visionary.create({
      data: {
        name: 'David Brown',
        email: 'david@example.com',
        company: 'Brown Business School',
        industry: 'Business Education',
        stage: VisionaryStage.SIGNED,
      },
    }),
  ])

  console.log(`Created ${visionaries.length} visionaries`)

  // Create brands
  const brands = await Promise.all([
    prisma.brand.create({
      data: {
        name: 'MasterClass Pro',
        visionaryId: visionaries[4].id,
        launchDate: subDays(new Date(), 120),
        stage: BrandStage.SCALE,
        status: BrandStatus.ON_TRACK,
        monthlyRevenue: 125000,
        monthlyProfit: 37500,
        contributionMargin: 30,
        frontEndRoas: 3.2,
        backEndLtv: 580,
        targetRevenue: 100000,
        targetMargin: 25,
        thisWeekFocus: 'Scale Meta campaigns to $50k/day',
        daysToBreakeven: 45,
      },
    }),
    prisma.brand.create({
      data: {
        name: 'Leadership Academy',
        launchDate: subDays(new Date(), 90),
        stage: BrandStage.PORTFOLIO,
        status: BrandStatus.ON_TRACK,
        monthlyRevenue: 85000,
        monthlyProfit: 21250,
        contributionMargin: 25,
        frontEndRoas: 2.8,
        backEndLtv: 420,
        targetRevenue: 75000,
        targetMargin: 20,
        thisWeekFocus: 'Launch new email nurture sequence',
        daysToBreakeven: 62,
      },
    }),
    prisma.brand.create({
      data: {
        name: 'Fitness Foundations',
        launchDate: subDays(new Date(), 60),
        stage: BrandStage.LAUNCH,
        status: BrandStatus.NEEDS_ATTENTION,
        monthlyRevenue: 42000,
        monthlyProfit: 8400,
        contributionMargin: 20,
        frontEndRoas: 2.1,
        backEndLtv: 280,
        targetRevenue: 50000,
        targetMargin: 20,
        thisWeekFocus: 'Optimize landing page conversion',
        daysToBreakeven: null,
      },
    }),
    prisma.brand.create({
      data: {
        name: 'Finance Freedom',
        stage: BrandStage.TESTING,
        status: BrandStatus.ON_TRACK,
        monthlyRevenue: 12000,
        monthlyProfit: 2400,
        contributionMargin: 20,
        frontEndRoas: 1.8,
        backEndLtv: 350,
        targetRevenue: 25000,
        targetMargin: 18,
        thisWeekFocus: 'Test 3 new ad creatives',
      },
    }),
    prisma.brand.create({
      data: {
        name: 'Coding Bootcamp',
        stage: BrandStage.IDEATION,
        status: BrandStatus.ON_TRACK,
        monthlyRevenue: 0,
        monthlyProfit: 0,
        contributionMargin: 0,
        frontEndRoas: 0,
        backEndLtv: 0,
        targetRevenue: 50000,
        targetMargin: 25,
        thisWeekFocus: 'Complete market research',
      },
    }),
    prisma.brand.create({
      data: {
        name: 'Art Mastery',
        launchDate: subDays(new Date(), 200),
        stage: BrandStage.HOUSE,
        status: BrandStatus.ON_TRACK,
        monthlyRevenue: 15000,
        monthlyProfit: 2250,
        contributionMargin: 15,
        frontEndRoas: 1.5,
        backEndLtv: 180,
        targetRevenue: 20000,
        targetMargin: 15,
        daysToBreakeven: 90,
      },
    }),
  ])

  console.log(`Created ${brands.length} brands`)

  // Create priorities for this week
  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 })
  const priorities = await Promise.all([
    // Monday
    prisma.priority.create({
      data: {
        userId: user.id,
        title: 'Review weekly metrics dashboard',
        dayOfWeek: DayOfWeek.MONDAY,
        weekStartDate: weekStart,
        completed: true,
        order: 0,
      },
    }),
    prisma.priority.create({
      data: {
        userId: user.id,
        title: 'Team standup and planning',
        dayOfWeek: DayOfWeek.MONDAY,
        weekStartDate: weekStart,
        completed: true,
        order: 1,
      },
    }),
    prisma.priority.create({
      data: {
        userId: user.id,
        title: 'Call with John Smith re: contract',
        dayOfWeek: DayOfWeek.MONDAY,
        weekStartDate: weekStart,
        completed: false,
        order: 2,
      },
    }),
    // Tuesday
    prisma.priority.create({
      data: {
        userId: user.id,
        title: 'Review MasterClass Pro campaign performance',
        dayOfWeek: DayOfWeek.TUESDAY,
        weekStartDate: weekStart,
        completed: false,
        order: 0,
      },
    }),
    prisma.priority.create({
      data: {
        userId: user.id,
        title: 'Fitness Foundations optimization meeting',
        dayOfWeek: DayOfWeek.TUESDAY,
        weekStartDate: weekStart,
        completed: false,
        order: 1,
      },
    }),
    // Wednesday
    prisma.priority.create({
      data: {
        userId: user.id,
        title: 'Finance Freedom creative review',
        dayOfWeek: DayOfWeek.WEDNESDAY,
        weekStartDate: weekStart,
        completed: false,
        order: 0,
      },
    }),
    prisma.priority.create({
      data: {
        userId: user.id,
        title: 'Discovery call with Sarah Johnson',
        dayOfWeek: DayOfWeek.WEDNESDAY,
        weekStartDate: weekStart,
        completed: false,
        order: 1,
      },
    }),
    // Thursday
    prisma.priority.create({
      data: {
        userId: user.id,
        title: 'Portfolio review meeting',
        dayOfWeek: DayOfWeek.THURSDAY,
        weekStartDate: weekStart,
        completed: false,
        order: 0,
      },
    }),
    // Friday
    prisma.priority.create({
      data: {
        userId: user.id,
        title: 'Weekly report and planning',
        dayOfWeek: DayOfWeek.FRIDAY,
        weekStartDate: weekStart,
        completed: false,
        order: 0,
      },
    }),
  ])

  console.log(`Created ${priorities.length} priorities`)

  // Create contacts
  const contacts = await Promise.all([
    prisma.contact.create({
      data: {
        name: 'Sarah Chen',
        role: 'CEO',
        category: ContactCategory.EXECUTIVE,
        email: 'sarah@company.com',
        phone: '+1 (555) 123-4567',
        isFavorite: true,
        lastContacted: subDays(new Date(), 1),
      },
    }),
    prisma.contact.create({
      data: {
        name: 'Mike Johnson',
        role: 'Head of Marketing',
        category: ContactCategory.TEAM,
        email: 'mike@company.com',
        phone: '+1 (555) 234-5678',
        isFavorite: true,
        lastContacted: new Date(),
      },
    }),
    prisma.contact.create({
      data: {
        name: 'Emily Davis',
        role: 'Copywriter Lead',
        category: ContactCategory.TEAM,
        email: 'emily@company.com',
        isFavorite: false,
        lastContacted: subDays(new Date(), 2),
      },
    }),
    prisma.contact.create({
      data: {
        name: 'David Wilson',
        role: 'Meta Ads Partner',
        category: ContactCategory.PARTNER,
        email: 'david@agency.com',
        phone: '+1 (555) 345-6789',
        isFavorite: false,
      },
    }),
    prisma.contact.create({
      data: {
        name: 'Lisa Park',
        role: 'CFO',
        category: ContactCategory.EXECUTIVE,
        email: 'lisa@company.com',
        isFavorite: false,
      },
    }),
    prisma.contact.create({
      data: {
        name: 'Tom Roberts',
        role: 'Sales Lead',
        category: ContactCategory.TEAM,
        email: 'tom@company.com',
        phone: '+1 (555) 456-7890',
        isFavorite: false,
        lastContacted: subDays(new Date(), 3),
      },
    }),
  ])

  console.log(`Created ${contacts.length} contacts`)

  // Create metrics (last 30 days for each brand)
  const metricsData: Array<{ brandId: string; metricType: MetricType; value: number; date: Date }> = []

  for (const brand of brands.filter(b => b.stage !== BrandStage.IDEATION)) {
    for (let i = 0; i < 30; i++) {
      const date = subDays(new Date(), i)
      const baseRevenue = Number(brand.monthlyRevenue) / 30
      const variance = (Math.random() - 0.5) * 0.3 // +/- 15% variance

      metricsData.push({
        brandId: brand.id,
        metricType: MetricType.REVENUE,
        value: baseRevenue * (1 + variance),
        date,
      })

      metricsData.push({
        brandId: brand.id,
        metricType: MetricType.PROFIT,
        value: (baseRevenue * (1 + variance)) * (Number(brand.contributionMargin) / 100),
        date,
      })

      metricsData.push({
        brandId: brand.id,
        metricType: MetricType.ROAS,
        value: Number(brand.frontEndRoas) * (1 + (Math.random() - 0.5) * 0.2),
        date,
      })
    }
  }

  await prisma.metric.createMany({
    data: metricsData,
  })

  console.log(`Created ${metricsData.length} metrics`)

  // Create alerts
  const alerts = await Promise.all([
    prisma.alert.create({
      data: {
        userId: user.id,
        type: AlertType.DECISION_DUE,
        title: 'Keep/Pass Decision Due',
        message: 'Fitness Foundations requires a keep/pass decision within 7 days',
        priority: 1,
      },
    }),
    prisma.alert.create({
      data: {
        userId: user.id,
        type: AlertType.MILESTONE_REACHED,
        title: 'Revenue Milestone',
        message: 'MasterClass Pro hit $125K monthly revenue!',
        isRead: true,
        priority: 0,
      },
    }),
    prisma.alert.create({
      data: {
        userId: user.id,
        type: AlertType.FOLLOWUP_OVERDUE,
        title: 'Follow-up Overdue',
        message: 'Follow up with Emily Chen is overdue by 2 days',
        priority: 2,
      },
    }),
  ])

  console.log(`Created ${alerts.length} alerts`)

  // Create milestones
  await prisma.milestone.createMany({
    data: [
      {
        title: '90-Day Revenue Goal',
        description: 'Reach $100K MRR within 90 days',
        targetDate: addDays(new Date(), 45),
        targetValue: 100000,
        currentValue: 75000,
        category: 'revenue',
      },
      {
        title: '6-Month Revenue Goal',
        description: 'Reach $500K MRR by month 6',
        targetDate: addDays(new Date(), 120),
        targetValue: 500000,
        currentValue: 280000,
        category: 'revenue',
      },
      {
        title: '12-Month ARR Goal',
        description: 'Reach $1.2M ARR by end of year',
        targetDate: addDays(new Date(), 270),
        targetValue: 1200000,
        currentValue: 450000,
        category: 'revenue',
      },
    ],
  })

  console.log('Created milestones')

  // Create budgets
  await prisma.budget.createMany({
    data: [
      {
        category: 'annual',
        allocated: 500000,
        spent: 180000,
        fiscalYear: new Date().getFullYear(),
      },
      {
        category: 'hiring',
        allocated: 100000,
        spent: 35000,
        fiscalYear: new Date().getFullYear(),
      },
      {
        category: 'marketing',
        allocated: 200000,
        spent: 85000,
        fiscalYear: new Date().getFullYear(),
      },
    ],
  })

  console.log('Created budgets')

  console.log('Seeding complete!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
