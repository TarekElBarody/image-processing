export enum WhereOP {
  OR = 'OR',
  AND = 'AND',
  LIKE = 'LIKE'
}

export type SQLWhere = {
  op: WhereOP;
  filed: [];
};
