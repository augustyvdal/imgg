import { TodoItem } from "../models/TodoItem";

let mem: TodoItem[] = [
    { id: crypto.randomUUID(), title: "Try MVVM", isDone: false },
];

export const TodoService = {
    async list(): Promise<TodoItem[]> {
        // simulate latency
        await new Promise(r => setTimeout(r, 150));
        return [...mem];
    },
    async add(title: string): Promise<TodoItem> {
        const item = { id: crypto.randomUUID(), title, isDone: false };
        mem = [item, ...mem];
        return item;
    },
    async toggle(id: string): Promise<void> {
        mem = mem.map(t => (t.id === id ? { ...t, isDone: !t.isDone } : t));
    },
    async remove(id: string): Promise<void> {
        mem = mem.filter(t => t.id !== id);
    },
};
