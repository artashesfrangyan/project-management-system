export interface IBoard {
    id: number;
    name: string;
    description: string;
    taskCount: number;
}

export interface IBoardContext {
    boardId: number;
    setBoardId: (id: number) => void;
}

export type CreateBoardData = Partial<IBoard> & Pick<IBoard, 'name' | 'description' | 'taskCount'>;
export type UpdateBoardData = Partial<IBoard> & { id: number };