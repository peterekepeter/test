import { CommandType } from './CommandType';
import { ICommand } from './ICommand';
import { ICreateCommand } from './ICreateCommand';

export interface IDestroyCommand
{
    type: CommandType.Destroy,
    id: string,
}