export type ITranscationGeneral = {
  row: {
    id: string
    authCode: string
    name: string | null
    avatar: string | null
    type: string
    description: string
    paymentMethod: string
    category: string
    createdAt: number
    status: string
    amount: number
    baseAmount: number
  }
}
