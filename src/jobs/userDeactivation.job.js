import cron from 'node-cron';
import { Op } from 'sequelize';

import db from '../models/index.js';
const { User } = db;

export function scheduleUserDeactivationJob() {
  // Schedule the job to run daily at midnight
  cron.schedule(
    '* * * * *',
    async () => {
      console.log('🔥 CRON TRIGGERED AT', new Date().toISOString());
      try {
        console.log(' [CRON] Running user deactivation job...');
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Set to start of the day

        // Find users whose endDate is today or earlier and are still active
        const [usersToDeactivate] = await User.update(
          { isActive: false },
          {
            where: {
              endDate: {
                [Op.lte]: today,
              },
              isActive: true,
              deleted: false,
            },
          }
        );
        console.log(` [CRON] Deactivated ${usersToDeactivate} users.`);
      } catch (error) {
        console.error(' [CRON] Error during user deactivation job:', error);
      }
    },
    {
      timezone: 'Asia/Kolkata',
    }
  );
}
