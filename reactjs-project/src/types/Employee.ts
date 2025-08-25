export interface Employee {
  id: number;
  fullName: string;
  email: string;
  dateOfBirth: string;
  gender: 'NAM' | 'NU' | 'KHAC';
  phoneNumber: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEmployeeRequest {
  fullName: string;
  email: string;
  dateOfBirth: string;
  gender: 'NAM' | 'NU' | 'KHAC';
  phoneNumber: string;
  active: boolean;
  password: string;
}

export interface UpdateEmployeeRequest {
  fullName: string;
  dateOfBirth: string;
  gender: 'NAM' | 'NU' | 'KHAC';
  phoneNumber: string;
  active: boolean;
  password: string;
}
