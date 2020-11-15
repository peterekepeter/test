import { CommandType } from './CommandType';

export interface IToggleCommand {
  type: CommandType.Toggle;
  id: string;
  state: boolean;
}
