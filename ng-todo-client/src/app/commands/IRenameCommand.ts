import { CommandType } from './CommandType';

export interface IRenameCommand {
  type: CommandType.Rename;
  id: string;
  name: string;
}
