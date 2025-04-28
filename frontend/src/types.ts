export interface Item {
    id: number;
    name: string;
    unitValue: number;
    created_at?: string;
  }
  
  export interface Budget {
    id: number;
    clientName: string;
    clientPhone?: string;
    totalCost: number;
    createdAt: string;
    items: Item[];
  }