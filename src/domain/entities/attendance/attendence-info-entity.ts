import { AttendanceEntity } from './attendance-entity';

export type AttendanceInfoEntity = AttendanceEntity & { name: string | null };
