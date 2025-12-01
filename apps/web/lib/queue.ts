import { Queue } from "bullmq";
const connection = process.env.REDIS_URL ? { url: process.env.REDIS_URL } : undefined;
export const jobQueue = new Queue("ind-jobs", { connection });
export enum JobNames {
  ParseResume = "parse-resume",
  GeneratePlan = "generate-plan",
  ScheduleDaily = "schedule-daily"
}
