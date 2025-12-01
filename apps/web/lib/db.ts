export type UUID = string;
export type Mission = {
  id: UUID;
  title: string;
  description: string | null;
  est_minutes: number;
  status: "pending" | "today" | "completed";
  completed_at: string | null;
};
export const sql = {
  nextIncompleteMissionForUser: `
    with user_plan as (
      select p.id from plans p where p.user_id = $1 and p.status='active' order by start_date desc limit 1
    )
    select m.* from missions m
    join plan_weeks pw on pw.id = m.plan_week_id
    where pw.plan_id = (select id from user_plan)
      and m.status <> 'completed'
    order by m.status='today' desc, m.completed_at nulls first, m.id
    limit 1;
  `
};
