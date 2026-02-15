import blank from '../blueprints/blank.mf?raw';
import fitnessTracker from '../blueprints/fitness-tracker.mf?raw';
import tabbarOverflow from '../blueprints/tabbar-overflow.mf?raw';
import musicService from '../blueprints/music-service.mf?raw';
import socialMedia1 from '../blueprints/social-media-1.mf?raw';
import socialMedia2 from '../blueprints/social-media-2.mf?raw';
import foodRush from '../blueprints/food-rush.mf?raw';
import ecommerceStore from '../blueprints/ecommerce-store.mf?raw';
import messagingApp from '../blueprints/messaging-app.mf?raw';
import financeDashboard from '../blueprints/finance-dashboard.mf?raw';
import newsMagazine from '../blueprints/news-magazine.mf?raw';
import travelBooking from '../blueprints/travel-booking.mf?raw';
import starGym from '../blueprints/star-gym.mf?raw';

export interface Blueprint {
  name: string;
  description: string;
  data: string;
}

export const blueprints: Blueprint[] = [
  // Basic
  { name: 'Blank Project', description: 'Empty starting point', data: blank },

  // Comprehensive Apps
  { name: 'Ecommerce Store', description: 'Complete retail shopping experience', data: ecommerceStore },
  { name: 'Finance Dashboard', description: 'Fintech/banking app with charts', data: financeDashboard },
  { name: 'Fitness Tracker', description: 'Activity stats, charts, and workout log', data: fitnessTracker },
  { name: 'Food Rush', description: 'Food delivery app', data: foodRush },
  { name: 'Messaging App', description: 'Full messaging app', data: messagingApp },
  { name: 'Music Service', description: 'Full music streaming service', data: musicService },
  { name: 'News Magazine', description: 'Content-heavy news reader layout', data: newsMagazine },
  { name: 'Social Media Picture Platform', description: 'Social media profile and posts', data: socialMedia1 },
  { name: 'Social Media Post Platform', description: 'Alternative social media layout', data: socialMedia2 },
  { name: 'Star Gym', description: 'Gym membership and class booking app', data: starGym },
  { name: 'Tabbar Overflow', description: 'Tabbar with 7 tabs showing More overflow', data: tabbarOverflow },
  { name: 'Travel Booking', description: 'Flight and hotel booking app', data: travelBooking },
];

