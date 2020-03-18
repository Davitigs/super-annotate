export class Tasks {
  id: number;
  title: string;
  description: string;
  status: Partial<Tasks>;
  priority: Partial<Tasks>;
  assignee: {
    id: number;
    name: string
  };
}
