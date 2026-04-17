/**
 * Seed Utility
 * Populates the database with initial schemes and admin account on first run
 */
const User = require('../models/User');
const Scheme = require('../models/Scheme');
const Feedback = require('../models/Feedback');

const schemes = [
  {
    title: 'PM Kisan Samman Nidhi',
    description: 'Income support of ₹6,000 per year to small and marginal farmers holding cultivable land up to 2 hectares.',
    category: 'Agriculture',
    targetUsers: ['Farmer'],
    eligibility: 'Small and marginal farmers with land up to 2 hectares',
    benefits: '₹6,000 per year in three equal installments of ₹2,000',
    applicationProcess: 'Register at pmkisan.gov.in or through local agriculture office',
    ministry: 'Ministry of Agriculture',
    link: 'https://pmkisan.gov.in',
    tags: ['farmer', 'income support', 'agriculture', 'subsidy']
  },
  {
    title: 'PM Fasal Bima Yojana',
    description: 'Crop insurance scheme providing financial support to farmers suffering crop loss or damage due to unforeseen events.',
    category: 'Agriculture',
    targetUsers: ['Farmer'],
    eligibility: 'All farmers growing notified crops',
    benefits: 'Insurance coverage for crop loss due to natural calamities',
    applicationProcess: 'Apply through local bank or insurance company',
    ministry: 'Ministry of Agriculture',
    tags: ['crop insurance', 'farmer', 'natural disaster', 'agriculture']
  },
  {
    title: 'National Scholarship Portal',
    description: 'Central portal for students to apply for various central and state government scholarships.',
    category: 'Education',
    targetUsers: ['Student'],
    eligibility: 'Students from Class 1 to Post-Doctoral level',
    benefits: 'Scholarships ranging from ₹1,000 to ₹1,00,000 per year',
    applicationProcess: 'Register at scholarships.gov.in',
    ministry: 'Ministry of Education',
    link: 'https://scholarships.gov.in',
    tags: ['scholarship', 'education', 'student', 'financial aid']
  },
  {
    title: 'PM MUDRA Yojana',
    description: 'Provides loans up to ₹10 lakh to non-corporate, non-farm small and micro enterprises.',
    category: 'Business',
    targetUsers: ['Business Owner'],
    eligibility: 'Small business owners, artisans, and entrepreneurs',
    benefits: 'Loan up to ₹10 lakh without collateral under Shishu, Kishore, Tarun categories',
    applicationProcess: 'Apply at any bank, NBFC, or MFI',
    ministry: 'Ministry of Finance',
    tags: ['loan', 'business', 'entrepreneur', 'mudra', 'startup']
  },
  {
    title: 'Pradhan Mantri Awas Yojana',
    description: 'Housing scheme to provide affordable housing to urban and rural poor with financial assistance.',
    category: 'Housing',
    targetUsers: ['General Citizen', 'Farmer'],
    eligibility: 'Families without a pucca house; Income below ₹18 lakh/year',
    benefits: 'Subsidy up to ₹2.67 lakh on home loans',
    applicationProcess: 'Apply through urban local body or common service center',
    ministry: 'Ministry of Housing',
    tags: ['housing', 'home loan', 'subsidy', 'affordable housing']
  },
  {
    title: 'Beti Bachao Beti Padhao',
    description: 'Scheme to address declining child sex ratio and promote welfare of girl children.',
    category: 'Women',
    targetUsers: ['General Citizen', 'Student'],
    eligibility: 'Girl child beneficiaries and their families',
    benefits: 'Financial assistance, educational scholarships, and awareness programs',
    applicationProcess: 'Contact local Anganwadi center or District Collector office',
    ministry: 'Ministry of Women and Child Development',
    tags: ['girl child', 'women', 'education', 'empowerment']
  },
  {
    title: 'Startup India Seed Fund',
    description: 'Financial assistance to startups for proof of concept, prototype development, and product trials.',
    category: 'Business',
    targetUsers: ['Business Owner'],
    eligibility: 'DPIIT recognized startups not more than 2 years old',
    benefits: 'Up to ₹20 lakh for proof of concept; ₹50 lakh for commercialization',
    applicationProcess: 'Apply at startupindia.gov.in',
    ministry: 'DPIIT, Ministry of Commerce',
    link: 'https://startupindia.gov.in',
    tags: ['startup', 'funding', 'innovation', 'entrepreneurship', 'seed fund']
  },
  {
    title: 'PM Jan Arogya Yojana (Ayushman Bharat)',
    description: 'Health insurance scheme providing cover of ₹5 lakh per family per year for secondary and tertiary hospitalization.',
    category: 'Health',
    targetUsers: ['General Citizen', 'Farmer'],
    eligibility: 'Poor and vulnerable families identified by SECC data',
    benefits: 'Health coverage up to ₹5 lakh per year',
    applicationProcess: 'Check eligibility at pmjay.gov.in',
    ministry: 'Ministry of Health',
    link: 'https://pmjay.gov.in',
    tags: ['health insurance', 'hospital', 'medical', 'ayushman']
  },
  {
    title: 'Pre-Matric Scholarship for SC/ST',
    description: 'Scholarship for SC/ST students studying in Class 9 and 10 to reduce dropout rates.',
    category: 'SC/ST',
    targetUsers: ['Student'],
    eligibility: 'SC/ST students in Class 9-10 with income below ₹2.5 lakh',
    benefits: 'Day scholar: ₹150/month; Hosteller: ₹350/month',
    applicationProcess: 'Apply at scholarships.gov.in',
    ministry: 'Ministry of Social Justice',
    tags: ['SC', 'ST', 'scholarship', 'pre-matric', 'education']
  },
  {
    title: 'Kisan Credit Card',
    description: 'Provides farmers with timely credit for agricultural needs at concessional interest rates.',
    category: 'Agriculture',
    targetUsers: ['Farmer'],
    eligibility: 'All farmers, sharecroppers, oral lessees, and self-help groups',
    benefits: 'Credit limit up to ₹3 lakh at 4% interest rate with subsidy',
    applicationProcess: 'Apply at any nationalized bank or cooperative bank',
    ministry: 'Ministry of Agriculture',
    tags: ['credit', 'loan', 'farmer', 'kcc', 'interest subsidy']
  },
  {
    title: 'Stand-Up India',
    description: 'Facilitates bank loans between ₹10 lakh and ₹1 crore to SC/ST and women entrepreneurs.',
    category: 'Business',
    targetUsers: ['Business Owner'],
    eligibility: 'SC/ST and women entrepreneurs setting up greenfield enterprises',
    benefits: 'Composite loan of ₹10 lakh to ₹1 crore',
    applicationProcess: 'Apply at standupmitra.in or bank branch',
    ministry: 'Ministry of Finance',
    tags: ['women entrepreneur', 'SC/ST', 'business loan', 'startup']
  },
  {
    title: 'PM SVANidhi (Street Vendor)',
    description: 'Micro-credit facility for street vendors to resume livelihoods affected by COVID-19.',
    category: 'Business',
    targetUsers: ['Business Owner', 'General Citizen'],
    eligibility: 'Street vendors operating before March 24, 2020',
    benefits: 'Working capital loan of ₹10,000 initially, up to ₹50,000 on repayment',
    applicationProcess: 'Apply at pmsvanidhi.mohua.gov.in',
    ministry: 'Ministry of Housing and Urban Affairs',
    tags: ['street vendor', 'micro credit', 'small business', 'loan']
  }
];

const sampleFeedback = [
  { name: 'Ramesh Kumar', email: 'ramesh@example.com', rating: 5, message: 'Paper Box helped me discover the PM Kisan scheme I had no idea about! Got my first installment last month.' },
  { name: 'Priya Sharma', email: 'priya@example.com', rating: 5, message: 'As a student, I found 3 scholarships I was eligible for. The AI chatbot explained everything clearly.' },
  { name: 'Vikram Singh', rating: 4, message: 'Great platform for discovering business subsidies. The MUDRA loan info was very helpful for my small shop.' },
  { name: 'Lakshmi Devi', rating: 5, message: 'Finally a platform that speaks simply. Found housing scheme for my family. Thank you Paper Box!' }
];

module.exports = async function seed() {
  try {
    // Only seed if no data exists
    const schemeCount = await Scheme.countDocuments();
    if (schemeCount === 0) {
      await Scheme.insertMany(schemes);
      console.log(`🌱 Seeded ${schemes.length} schemes`);
    }

    const feedbackCount = await Feedback.countDocuments();
    if (feedbackCount === 0) {
      await Feedback.insertMany(sampleFeedback);
      console.log(`🌱 Seeded sample feedback`);
    }

    // Create admin user if not exists
    const adminExists = await User.findOne({ email: 'admin@paperbox.com' });
    if (!adminExists) {
      await User.create({
        name: 'Admin',
        email: 'admin@paperbox.com',
        password: 'admin123',
        userType: 'General Citizen',
        role: 'admin'
      });
      console.log('🌱 Admin user created: admin@paperbox.com / admin123');
    }
  } catch (err) {
    console.error('Seed error:', err.message);
  }
};
