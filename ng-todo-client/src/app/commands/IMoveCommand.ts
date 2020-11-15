import { CommandType } from "./CommandType";

export interface IMoveCommand
{
    type: CommandType.Move,
    id: string,
    newParentId?: string
    position?: number,
}