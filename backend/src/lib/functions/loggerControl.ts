import AccessLogStore from '../../models/accessLogStore';
import { AccessLog } from '../../types/index';

export async function logMorgan(tokens: AccessLog): Promise<void> {
  const accessLogSore = new AccessLogStore();
  await accessLogSore.create(tokens);
}
