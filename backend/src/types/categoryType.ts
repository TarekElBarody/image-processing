export type Category = {
  id?: number;
  name: string;
  parent: number;
  icon: string | null;
  created: Date | null;
};

export type CategoryUpdate = {
  id: number;
  name?: string;
  parent?: number;
  icon?: string | null;
};
