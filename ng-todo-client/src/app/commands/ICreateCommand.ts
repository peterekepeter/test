import { CommandType } from './CommandType';

export interface ICreateCommand {
  type: CommandType.Create;
  id: string;
  parentId?: string;
}
