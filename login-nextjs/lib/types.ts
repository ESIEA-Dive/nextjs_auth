// Interface to defining our object of response functions
export interface ResponseFuncs {
  GET?: Function,
  POST?: Function,
  PUT?: Function,
  DELETE?: Function,
}

// Interface to define our User model on the frontend
export interface User {
  id: number,
  name: string,
  email: string,
  hashedPassword: string,
  image: string,
  filledForm: boolean,
}

// Interface to define our Form model on the frontend
export interface Form {
  userId: string,
  qstUniversity: string,
  qstYear: string,
  qstSport: string,
  qstSex: string,
  qstIdol: string,
  qstEmotion1: string,
  qstEmotion2: string,
  qstEmotion3: number,
  qstPhysical1: string,
  qstPhysical2: string,
  qstPhysical3: string,
  qstMental1: string,
  qstMental2: string,
  qstSpiritual1: string,
  qstSpiritual2: string,
  qstSocial1: string,
  qstSocial2: string,
  qstSocial3: string,
  qstEnvironmental1: number,
  qstEnvironmental2: string,
  qstEnvironmental3: string,
  qstFinancial1: number,
  qstFinancial2: string,
  qstFinancial3: string,
  qstOccupational1: string,
  qstOccupational2: string,
}