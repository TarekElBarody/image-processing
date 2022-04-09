export type AccessLog = {
  id?: number;
  remote_addr: string | null;
  visit_date: string | null;
  method: string | null;
  url: string | null;
  status: number | null;
  referrer: string | null;
  user_agent: string | null;
  content_length: number;
  response_time: number;
};
