import type { ReliefTask } from '@/types';

export const mockTasks: ReliefTask[] = [
  {
    id: '1', title: 'Emergency Water Supply Needed', description: 'Village well contaminated after flooding. 200+ families need clean drinking water urgently.',
    location: 'Kigali, Rwanda', lat: -1.9403, lng: 29.8739, category: 'Water & Sanitation', required_skills: ['Logistics', 'Water Purification'],
    timestamp: '2026-04-05T08:00:00Z', source_type: 'NGO', verification_status: 'VERIFIED', priority_score: 95, urgency_level: 'CRITICAL', status: 'OPEN',
  },
  {
    id: '2', title: 'Temporary Shelter Construction', description: 'Displaced families need temporary shelters after earthquake. Materials available on-site.',
    location: 'Port-au-Prince, Haiti', lat: 18.5944, lng: -72.3074, category: 'Shelter', required_skills: ['Construction', 'Carpentry'],
    timestamp: '2026-04-04T14:30:00Z', source_type: 'NGO', verification_status: 'VERIFIED', priority_score: 88, urgency_level: 'HIGH', status: 'ASSIGNED', assigned_to: 'vol-1',
  },
  {
    id: '3', title: 'Medical Supplies Distribution', description: 'Clinic running low on essential medicines. Malaria cases rising in the region.',
    location: 'Freetown, Sierra Leone', lat: 8.4657, lng: -13.2317, category: 'Healthcare', required_skills: ['Medical', 'Logistics'],
    timestamp: '2026-04-05T06:15:00Z', source_type: 'NGO', verification_status: 'VERIFIED', priority_score: 92, urgency_level: 'CRITICAL', status: 'OPEN',
  },
  {
    id: '4', title: 'School Roof Repair Needed', description: 'Community school roof damaged by storm. 150 children unable to attend classes.',
    location: 'Dhaka, Bangladesh', lat: 23.8103, lng: 90.4125, category: 'Education', required_skills: ['Construction', 'Roofing'],
    timestamp: '2026-04-03T10:00:00Z', source_type: 'PUBLIC', verification_status: 'UNVERIFIED', priority_score: 65, urgency_level: 'MEDIUM', status: 'OPEN',
  },
  {
    id: '5', title: 'Food Distribution Drive', description: 'Monthly food distribution for 500 families in drought-affected area.',
    location: 'Nairobi, Kenya', lat: -1.2921, lng: 36.8219, category: 'Food Security', required_skills: ['Logistics', 'Community Outreach'],
    timestamp: '2026-04-05T09:00:00Z', source_type: 'NGO', verification_status: 'VERIFIED', priority_score: 78, urgency_level: 'HIGH', status: 'IN_PROGRESS',
  },
  {
    id: '6', title: 'Bridge Repair After Flood', description: 'Key bridge connecting two villages collapsed. Community isolated from markets and hospitals.',
    location: 'Kathmandu, Nepal', lat: 27.7172, lng: 85.324, category: 'Infrastructure', required_skills: ['Engineering', 'Construction'],
    timestamp: '2026-04-04T07:45:00Z', source_type: 'PUBLIC', verification_status: 'UNVERIFIED', priority_score: 72, urgency_level: 'HIGH', status: 'OPEN',
  },
  {
    id: '7', title: 'Vaccination Campaign Support', description: 'Need volunteers to assist with polio vaccination door-to-door campaign.',
    location: 'Lagos, Nigeria', lat: 6.5244, lng: 3.3792, category: 'Healthcare', required_skills: ['Medical', 'Community Outreach'],
    timestamp: '2026-04-05T11:00:00Z', source_type: 'NGO', verification_status: 'VERIFIED', priority_score: 83, urgency_level: 'HIGH', status: 'OPEN',
  },
  {
    id: '8', title: 'Solar Panel Installation for Clinic', description: 'Rural clinic has no electricity. Solar panels donated but need installation.',
    location: 'Kampala, Uganda', lat: 0.3476, lng: 32.5825, category: 'Energy', required_skills: ['Electrical', 'Solar Installation'],
    timestamp: '2026-04-02T15:30:00Z', source_type: 'NGO', verification_status: 'VERIFIED', priority_score: 55, urgency_level: 'LOW', status: 'COMPLETED',
  },
  {
    id: '9', title: 'Community Garden Setup', description: 'Teaching sustainable farming to displaced families for food independence.',
    location: 'Addis Ababa, Ethiopia', lat: 9.0054, lng: 38.7636, category: 'Agriculture', required_skills: ['Agriculture', 'Teaching'],
    timestamp: '2026-04-01T08:00:00Z', source_type: 'PUBLIC', verification_status: 'UNVERIFIED', priority_score: 42, urgency_level: 'LOW', status: 'OPEN',
  },
  {
    id: '10', title: 'Emergency Evacuation Assistance', description: 'Rising floodwaters threatening 300+ households. Need boats and evacuation support.',
    location: 'Manila, Philippines', lat: 14.5995, lng: 120.9842, category: 'Emergency', required_skills: ['Search & Rescue', 'First Aid', 'Logistics'],
    timestamp: '2026-04-05T12:00:00Z', source_type: 'NGO', verification_status: 'VERIFIED', priority_score: 98, urgency_level: 'CRITICAL', status: 'OPEN',
  },
];
