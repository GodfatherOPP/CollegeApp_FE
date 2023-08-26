// ----------------------------------------------------------------------

export type ICampaignGeneral = {
  _id: string;
  id: string;
  template: string;
  rows: [];
  status: boolean;
  createdAt: string;
  accountStatus: string;
  stkNumber: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  cellNumber: string;
  nextDueAmount: string;
  nextDueDate: string;
  daysPastDue: number;
  promiseToPay: string;
  currentDueDate: string;
  promiseDueDate: string;
  autoPay: string;
  accountStatusDesc: string;
};
